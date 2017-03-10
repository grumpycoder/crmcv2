using System;
using CRMC.Domain;

namespace web.Models
{
    public class VisitorSearchModel : PagerModel<Person>
    {
        public string AccountId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string EmailAddress { get; set; }
        public string Zipcode { get; set; }
        public bool? IsDonor { get; set; }
        public bool? IsPriority { get; set; }
        public decimal? FuzzyMatchValue { get; set; }
        public Guid? SortOrder { get; set; }
        public DateTime DateCreated { get; set; }

    }
}