using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using CRMC.DataAccess;
using CRMC.Domain;

namespace web.Controllers
{
    public class ConfigurationController : ApiController
    {
        private readonly DataContext _context = DataContext.Create();

        public object Get()
        {
            var config = _context.Configurations.FirstOrDefault();
            return Ok(config);
        }

        public object Post([FromBody] Configuration model)
        {
            var config = _context.Configurations.Find(model.Id);

            if (config == null) return NotFound();

            _context.Configurations.AddOrUpdate(model);
            _context.SaveChanges();
            return Ok(model);
        }
    }
}
