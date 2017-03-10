// VisitorController.cs

using System;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web.Http;
using CRMC.DataAccess;
using CRMC.Domain;

namespace web.Controllers
{
    public class VisitorController : ApiController
    {

        public object Get()
        {
            using (var context = DataContext.Create())
            {
                var list = context.People.OrderBy(e => e.Lastname).Take(10).ToList();
                return Ok(list);
            }
        }

        public object Get(int id)
        {
            using (var context = DataContext.Create())
            {
                var visitor = context.People.Find(id);
                if (visitor == null) return NotFound();

                return Ok(visitor);
            }
        }

        public object Post(CreateEditVisitorModel model)
        {
            //SET DateCreated on saving context
            using (var context = DataContext.Create())
            {
                var visitor = context.People.Find(model.Id);
                if (visitor != null)
                {
                    visitor.Firstname = model.Firstname;
                    visitor.Lastname = model.Lastname;
                    visitor.EmailAddress = model.EmailAddress;
                    visitor.Zipcode = model.Zipcode;
                    visitor.IsDonor = model.IsDonor;
                    visitor.IsPriority = model.IsPriority;
                    visitor.FuzzyMatchValue = model.FuzzyMatchValue;

                }
                else
                {
                    visitor = new Person()
                    {
                        Firstname = model.Firstname,
                        Lastname = model.Lastname,
                        EmailAddress = model.EmailAddress,
                        Zipcode = model.Zipcode,
                        IsDonor = model.IsDonor,
                        IsPriority = model.IsPriority,
                        FuzzyMatchValue = model.FuzzyMatchValue,
                        SortOrder = Guid.NewGuid()
                    };

                }
                context.People.AddOrUpdate(visitor);
                context.SaveChanges();

                return Ok(visitor);
            }
        }

        [HttpDelete]
        public IHttpActionResult Delete(int id)
        {
            using (var context = DataContext.Create())
            {
                var visitor = context.People.Find(id);
                if (visitor == null) return NotFound();

                context.People.Remove(visitor);
                context.SaveChanges();
                return Ok("Deleted");
            }
        }
    }
}