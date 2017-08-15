using CRMC.Domain;
using CsvHelper.Configuration;

namespace web.Models
{
    public class PersonMap : CsvClassMap<Person>
    {
        public PersonMap()
        {
            Map(m => m.AccountId).Name("LookupID", "LookupId", "Lookup Id", "Lookup ID");
            Map(m => m.Zipcode).Name("Zip Code", "ZipCode", "zipcode", "zip code");
            Map(m => m.Firstname).Name("Name");
        }

    }
}