using System;

namespace wot.ViewModels
{
    public class Song
    {
        public Song(string title, string path)
        {
            Title = title;
            Path = new Uri(path);
        }

        public string Title { get; set; }
        public Uri Path { get; set; }
    }
}