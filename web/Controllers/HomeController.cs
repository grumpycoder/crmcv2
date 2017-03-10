using System.Web.Mvc;

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
            return View();
        }
    }
}