using Microsoft.AspNet.Mvc;

namespace Admin.UI.UserArea
{
    [Area("User")]
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult List()
        {
            return View();
        }
    }
}