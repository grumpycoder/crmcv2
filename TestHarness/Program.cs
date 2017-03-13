using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRMC.Domain;
using Microsoft.AspNet.SignalR.Client;

namespace TestHarness
{
    class Program
    {
        static void Main(string[] args)
        {
            HubTest();

            Console.WriteLine("Finished");
            Console.ReadLine();
        }

        private static void HubTest()
        {
            var connection = new HubConnection("http://localhost:49960/signalr");
            var hub = connection.CreateHubProxy("NameNotificationHub");
            connection.Start().ContinueWith(task =>
            {
                if (task.IsFaulted)
                {
                    Console.WriteLine("There was an error opening the connection:{0}",
                                      task.Exception.GetBaseException());
                }
                else
                {
                    Console.WriteLine("Connected");
                }
            }).Wait();

            hub.On<string, string>("addName", (kiosk, message) =>
            {
                Console.WriteLine("From Hub: {0} : {1}", kiosk, message);
            });

            while (true)
            {
                Console.WriteLine("Enter name:");
                var line = Console.ReadLine();
                if (line == "exit")
                {
                    break;
                }

                var person = new Person() { Firstname = line.Split(new char[] { ' ' })[0], Lastname = line.Split(new char[] { ' ' })[1] };
                hub.Invoke("addName", "1", person).ContinueWith(task =>
                {
                    if (task.IsFaulted)
                    {
                        Console.WriteLine("There was an error calling send: {0}",
                            task.Exception.GetBaseException());
                    }
                    else
                    {
                        Console.WriteLine("Added name: {0}", line);
                    }
                });
            }
        }
    }
}
