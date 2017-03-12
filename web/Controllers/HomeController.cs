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
        [Authorize]
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
            return View();
        }
    }
}