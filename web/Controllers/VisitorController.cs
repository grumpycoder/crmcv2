// VisitorController.cs

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
    }
}