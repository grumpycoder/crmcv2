// VisitorController.cs

using System.Data.Entity.Migrations;
using System.Linq;
using System.Web.Http;
using CRMC.DataAccess;

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

                    context.People.AddOrUpdate(visitor);
                }
                context.SaveChanges();

                return Ok(model);
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