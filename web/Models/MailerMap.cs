using CRMC.Domain;
using CsvHelper.Configuration;
using System;

namespace web.Models
{
    public class PersonMap : CsvClassMap<Person>
    {
        public PersonMap()
        {
            Map(m => m.AccountId).Name("LookupID", "LookupId", "Lookup Id", "Lookup ID");
            Map(m => m.Zipcode).Name("Zip Code", "ZipCode", "zipcode", "zip code");
            Map(m => m.Firstname).Name("Name");
            Map(m => m.DateCreated).Default(DateTime.Now);
            Map(m => m.FuzzyMatchValue).Default(0);
            Map(m => m.IsDonor).Default(1);

        }

    }
}