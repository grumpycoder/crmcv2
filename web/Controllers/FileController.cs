using CRMC.DataAccess;
using CRMC.Domain;
using CsvHelper;
using CsvHelper.Configuration;
using EntityFramework.Utilities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using web.Models;

namespace web.Controllers
{
    [RoutePrefix("api/file")]
    public class FileController : ApiController
    {
        private readonly DataContext _context;

        public FileController()
        {
            _context = DataContext.Create();
        }

        [HttpPost, Route("donor")]
        public async Task<object> Donor()
        {
            var stopwatch = new Stopwatch();
            stopwatch.Restart();
            try
            {
                var postedFile = HttpContext.Current.Request.Files[0];
                // Fix for IE file path issue.
                var filename =
                    postedFile.FileName.Substring(postedFile.FileName.LastIndexOf("\\", StringComparison.Ordinal) + 1);
                var filePath = HttpContext.Current.Server.MapPath(@"~\app_data\" + filename);
                postedFile.SaveAs(filePath);

                var configuration = new CsvConfiguration()
                {
                    IsHeaderCaseSensitive = false,
                    WillThrowOnMissingField = false,
                    IgnoreReadingExceptions = true,
                    ThrowOnBadData = false,
                    SkipEmptyRecords = true,
                    TrimHeaders = true
                };

                var result = new OperationResult(false);
                using (var csv = new CsvReader(reader: new StreamReader(filePath, Encoding.Default, true), configuration: configuration))
                {


                    csv.Configuration.RegisterClassMap<PersonMap>();
                    var list = csv.GetRecords<Person>().ToList();
                    list = await UpdateMailers(list);

                    using (_context)
                    {
                        _context.People.AsNoTracking();
                        EFBatchOperation.For(_context, _context.People).InsertAll(list, _context.Database.Connection, 5000);
                    }

                    var message = $"Processed {list.Count} records";
                    stopwatch.Stop();
                    result.Messages.Add(message);
                    result.TotalTime = stopwatch.Elapsed;
                }

                File.Delete(filePath);
                return Ok(result);

            }
            catch (Exception ex)
            {
                var message = $"Error occurred processing records. {ex.Message}";
                return BadRequest(message);
            }

        }

        private async Task<List<Person>> UpdateMailers(List<Person> list)
        {
            await Task.Run(() =>
            {
                foreach (var mailer in list)
                {
                    var split = mailer.Firstname.Split(new char[] { ' ' }, 2);
                    mailer.Lastname = split[1];
                    mailer.Firstname = split[0];
                    mailer.DateCreated = DateTime.Now;
                    mailer.FuzzyMatchValue = 0;
                    mailer.IsDonor = true;
                }
            });
            return list;
        }
    }
}
