using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CRMC.Domain;
using Microsoft.AspNet.Identity.EntityFramework;

namespace CRMC.DataAccess
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext() : base("DefaultConnection")
        {
            Database.Log = msg => Debug.WriteLine(msg);
        }

        public static DataContext Create()
        {
            return new DataContext();
        }

        public DbSet<Person> People { get; set; }
        public DbSet<Censor> Censors { get; set; }
        public DbSet<Configuration> Configurations { get; set; }
        public virtual DbSet<ConfigurationColor> ConfigurationColors { get; set; }

        protected override void OnModelCreating(DbModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Properties<string>().Configure(c => c.HasColumnType("varchar"));
            builder.Properties<DateTime>().Configure(c => c.HasColumnType("smalldatetime"));

            builder.Entity<Person>().ToTable("Persons");
            builder.Entity<Configuration>().ToTable("Configuration");
            builder.Entity<ConfigurationColor>().ToTable("ConfigurationColors");
            builder.Entity<Configuration>().ToTable("Configuration");
        }
    }
}
