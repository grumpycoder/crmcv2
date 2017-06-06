using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Shapes;
using AsyncBridge;
using AutoMapper;
using CRMC.Domain;
using Microsoft.AspNet.SignalR.Client;
using wot.Extensions;
using wot.Services;
using wot.ViewModels;

namespace wot
{
    //TODO: Need logging!!!
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private const int DefaultTakeCount = 50;

        private static readonly string WebServerUrl = Properties.Settings.Default.WebserverUri;


        private int _currentCount;
        private Canvas _canvas;
        public Configuration Configuration;
        public AudioManager AudioManager;
        private static readonly string AudioFilePath = @Properties.Settings.Default.AudioFilePath;
        private static readonly int _numberOfLanes = @Properties.Settings.Default.NumberOfLanes;
        private static readonly bool _debugMode = @Properties.Settings.Default.DebugMode;

        public List<IDisplayLane> Lanes = new List<IDisplayLane>();
        public CancellationToken CancelToken = new CancellationToken();
        public CancellationTokenSource Canceller = new CancellationTokenSource();
        public IHubProxy Hub;

        public MainWindow()
        {
            InitializeComponent();
            Loaded += MainWindow_Loaded;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            await InitConfiguration();
            await InitDisplay();
            await InitAudioSettings();
            await InitConnectionManager();
            if (_debugMode) AddLines();

            AsyncHelper.FireAndForget(BeginRotaion);
        }

        private async Task InitConfiguration()
        {
            var service = new ConfigurationService(WebServerUrl);

            Configuration = await service.GetConfigurationAsync(ConfigurationMode.Normal);
            //TODO: Check configuration bottom margin for exceeding height of canvas and make height of canvas
        }

        private async Task BeginRotaion()
        {
            var width = _canvas.ActualWidth;

            //Kiosk Lanes
            for (var i = 1; i < _numberOfLanes + 1; i++)
            {
                //TODO: Refactor out width
                Lanes.Add(new KioskDisplayLane(laneIndex: i, canvasWidth: width, totalLanes: _numberOfLanes));
            }

            //General Lane
            var model = new GeneralDisplayLane(Configuration.GeneralRotationDelay, width);
            await model.LoadNamesAsync(_currentCount, DefaultTakeCount, WebServerUrl); //TODO: Remove dependecy on webserverurl string
            _currentCount += DefaultTakeCount;
            Lanes.Add(model);

            //Priority Lane
            var priorityLane = new PriorityDisplayLane(Configuration.PriorityRotationDelay, width);
            await priorityLane.LoadNamesAsync(0, DefaultTakeCount, WebServerUrl); //TODO: Remove dependecy on webserverurl string
            Lanes.Add(priorityLane);

            foreach (var lane in Lanes)
            {
                AsyncHelper.FireAndForget(() => DisplayScreenModelAsync(lane), e =>
                {
                    Console.WriteLine($@"Error starting loop for lane {lane.LaneIndex}");
                    Debug.WriteLine(e);
                });
            }
        }

        private void AddLines()
        {
            var c = WallCanvas;
            for (var i = 1; i <= _numberOfLanes; i++)
            {
                var LaneWidth = c.ActualWidth / _numberOfLanes;
                var LeftMargin = LaneWidth * (i - 1);
                var RightMargin = LeftMargin + LaneWidth;
                //TODO: Refactor out width
                //Lanes.Add(new KioskDisplayLane(laneIndex: i, canvasWidth: width, totalLanes: 4));
                var h = _canvas.ActualHeight;
                var line = new Line
                {
                    Stroke = Brushes.Red,
                    X1 = RightMargin,
                    X2 = RightMargin,
                    Y1 = 0,
                    Y2 = h,
                    StrokeThickness = 2
                };
                c.Children.Add(line);

            }
        }

        private async Task DisplayScreenModelAsync(IDisplayLane lane)
        {
            while (true)
            {
                foreach (var person in lane.People.ToList())
                {
                    if (lane.GetType() == typeof(KioskDisplayLane))
                    {
                        if ((DateTime.Now >= person.NextDisplayTime))
                        {
                            Debug.WriteLine($"Displaying {person} for {person.CurrentDisplayCount} in lane {lane.LaneIndex}");
                            await Animate(person, lane);
                            person.CurrentDisplayCount += 1;
                            //TODO: Refactor out RecycleCount
                            if (person.CurrentDisplayCount >= Configuration.KioskDisplayRecycleCount) lane.People.Remove(person);
                        }
                        continue;
                    }
                    await Animate(person, lane);

                    var percent = lane.People.IndexOf(person).ToDouble().PercentOf(DefaultTakeCount.ToDouble());
                    if (percent >= 90)
                    {
                        AsyncHelper.FireAndForget(
                            () => lane.UpdateQueueAsync(_currentCount, DefaultTakeCount, WebServerUrl),
                            e =>
                            {
                                Console.WriteLine(@"Error updating name queue for general names");
                                Debug.WriteLine(e);
                            });
                        _currentCount += DefaultTakeCount;
                    }
                    using (Canceller.Token.Register(Thread.CurrentThread.Abort))
                    {
                        //NOTE: This is amount of time before next name displays and begins animation
                        await Task.Delay(TimeSpan.FromSeconds(lane.RotationDelay), Canceller.Token);
                    }
                }

                //TODO: If queue list is not populated continue with existing list. Notifiy issue
                if (!lane.Queue.Any()) continue;

                //NOTE: If current queue count less than DefaultTakeCount assume at end of database list and start over at beginning. Need to same position for next runtime.
                if (lane.Queue.Count < DefaultTakeCount) _currentCount = 0;

                lane.People.Clear();
                lane.People.AddRange(lane.Queue);
                lane.Queue.Clear();
            }
        }

        private async Task<double> Animate(PersonViewModel person, IDisplayLane lane)
        {
            var totalTime = 0.0; var width = _canvas.ActualWidth;
            await Dispatcher.InvokeAsync(() =>
            {
                NameScope.SetNameScope(this, new NameScope());
                var storyboard = new Storyboard();

                var displayElement = new DisplayElement(person, lane, width, Configuration, _debugMode);
                List<MyAnimation> animations = displayElement.CreateAnimations();
                RegisterName(displayElement.Label.Name, displayElement.Label);
                RegisterName(displayElement.Border.Name, displayElement.Border);

                var e = new AnimationEventArgs { TagName = displayElement.Border.Uid };
                storyboard.Completed += (sender, args) => StoryboardOnCompleted(e);

                foreach (var da in animations)
                {
                    Storyboard.SetTargetName(da, da.TargetName);
                    Storyboard.SetTargetProperty(da, da.PropertyPath);
                    storyboard.Children.Add(da);
                }
                totalTime = displayElement.TotalTime;
                var xPosition = displayElement.XAxis;
                var yPosition = displayElement.YAxis;
                Canvas.SetLeft(displayElement.Border, xPosition);
                Canvas.SetTop(displayElement.Border, yPosition);
                _canvas.Children.Add(displayElement.Border);
                _canvas.UpdateLayout();
                storyboard.Begin(this);
            });
            person.NextDisplayTime = DateTime.Now.AddSeconds(totalTime);
            return totalTime;
        }

        private async void KioskEntry(string kiosk, Person person)
        {
            Mapper.CreateMap<Person, PersonViewModel>().ReverseMap(); //TODO: Should be in mapper configuration module

            var lane = Lanes.FirstOrDefault(x => x.LaneIndex == kiosk.ToInt());
            if (lane == null) return;

            var pvm = Mapper.Map<Person, PersonViewModel>(person);
            lane.People.Add(pvm);
        }

        private void ConfigurationChange(Configuration config)
        {
            Configuration = config;
            Dispatcher.InvokeAsync(() =>
            {
                AudioManager.ChangeVolume(Configuration.Volume);
            });
        }

        #region Initializations

        private async Task InitConnectionManager()
        {
            var connection = new HubConnection($"{WebServerUrl}signalr");
            Hub = connection.CreateHubProxy("NameNotificationHub");

            connection.Start().ContinueWith(task =>
            {
                if (task.IsFaulted)
                {
                    Console.WriteLine(@"There was an error opening the connection:{0}",
                        task.Exception?.GetBaseException());
                }
                else
                {
                    Console.WriteLine(@"Connected");
                }
            }).Wait(CancelToken);

            Hub.On<string, Person>("addName", (kiosk, person) => Dispatcher.Invoke(() => KioskEntry(kiosk, person)));
            Hub.On<Configuration>("configurationChange", (config) => Dispatcher.Invoke(() => ConfigurationChange(config)));
        }

        private async Task InitAudioSettings()
        {
            if (!Directory.GetFiles(AudioFilePath).Any(f => f.EndsWith(".mp3"))) return;
            AudioManager = new AudioManager(MediaPlayer, @Properties.Settings.Default.AudioFilePath);
            AudioManager.ChangeVolume(Configuration.Volume);
            AudioManager.Play();
        }

        protected async Task InitDisplay()
        {
            _canvas = WallCanvas;
            _canvas.Height = SystemParameters.PrimaryScreenHeight;
            _canvas.Width = SystemParameters.PrimaryScreenWidth;

            _canvas.UpdateLayout();

            //HACK: Test if needed.
            Timeline.DesiredFrameRateProperty.OverrideMetadata(typeof(Timeline),
                new FrameworkPropertyMetadata { DefaultValue = 80 });
        }

        #endregion Initializations

        #region Events

        private void MediaElement_MediaEnded(object sender, RoutedEventArgs e)
        {
        }

        private void MainWindow_OnClosed(object sender, EventArgs e)
        {
            Console.WriteLine(@"Window Closed");
            //Canceller.Cancel();
        }

        private void StoryboardOnCompleted(AnimationEventArgs eventArgs)
        {
            var tagName = eventArgs.TagName;

            foreach (UIElement child in _canvas.Children.Cast<UIElement>().Where(child => tagName == child.Uid))
            {
                child.BeginAnimation(TopProperty, null);
                _canvas.Children.Remove(child);
                return;
            }
        }

        #endregion Events
    }
}