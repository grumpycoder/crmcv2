using System;
using CRMC.Domain;

namespace wot.ViewModels
{
    public class PersonViewModel : Person
    {
        public int CurrentDisplayCount { get; set; }
        public DateTime NextDisplayTime { get; set; }

        public bool IsFirstRun => CurrentDisplayCount == 0;
    }
}