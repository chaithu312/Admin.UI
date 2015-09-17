using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;

namespace Admin.UI.Controllers
{
    public class HomeController : Controller
    {
        private IOptions<AppSettings> AppSettings;

        public HomeController(IOptions<AppSettings> appSettings)
        {
            AppSettings = appSettings;
        }

        public IActionResult Index()
        {
            string siteName = AppSettings.Options.SiteTitle;

            if (User.Identity.IsAuthenticated)
                return View();
            else
                return RedirectToAction("Index", "Home", new { area = "User" });
        }

        public IActionResult Index2()
        {
            return View();
        }
    }
}