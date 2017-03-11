using System.Linq;
using System.Web.Mvc;
using CRMC.DataAccess;
using CRMC.Domain;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Visitors()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Censors()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        public ActionResult Configuration()
        {
            return View();
        }

        public ActionResult Users()
        {
            var manager = new UserManager<ApplicationUser>(
       new UserStore<ApplicationUser>(
           DataContext.Create()));

            var list =
              manager.Users.ToList();

            return View();
        }
    }
}