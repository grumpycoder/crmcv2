namespace web.Models
{
    public class CreateEditVisitorModel
    {
        public int Id { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string EmailAddress { get; set; }
        public string Zipcode { get; set; }
        public decimal? FuzzyMatchValue { get; set; }
        public bool? IsDonor { get; set; }
        public bool? IsPriority { get; set; }
    }
}