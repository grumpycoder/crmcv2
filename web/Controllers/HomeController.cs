using System.Web.Mvc;

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
        [Authorize]
        public ActionResult Censors()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
        [Authorize]
        public ActionResult Configuration()
        {
            return View();
        }
        [Authorize]
        public ActionResult Users()
        {
            return View();
        }
        [Authorize]
        public ActionResult Upload()
        {
            return View();
        }
    }
}