using Microsoft.AspNet.Mvc;

namespace Admin.UI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            if (User.Identity.IsAuthenticated)
                return View();
            else
                return RedirectToAction("Index", "Home", new { area="User"});
        }

        public IActionResult Index2()
        {
            return View();
        }
    }
}