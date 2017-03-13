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
            var config = _context.AppSettings.FirstOrDefault();
            return Ok(config);
        }

        public object Post([FromBody] AppConfig model)
        {
            var config = _context.AppSettings.Find(model.Id);

            if (config == null) return NotFound();

            config.HubName = model.HubName;
            config.WebServerURL = model.WebServerURL;
            config.Volume = model.Volume;
            config.ScrollSpeed = model.ScrollSpeed;
            config.AddNewItemSpeed = model.AddNewItemSpeed;
            config.MinFontSize = model.MinFontSize;
            config.MaxFontSize = model.MaxFontSize;
            config.MinFontSizeVIP = model.MinFontSizeVIP;
            config.MaxFontSizeVIP = model.MaxFontSizeVIP;
            config.AudioFilePath = model.AudioFilePath;

            _context.AppSettings.AddOrUpdate(model);
            _context.SaveChanges();
            return Ok(model);
        }
    }
}
