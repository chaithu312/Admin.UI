using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

namespace Admin.UI.Areas.User.Controllers
{
    [Area("User")]
    public class HomeController : Controller
    {
        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }

        // GET: /<controller>/
        public IActionResult Test()
        {
            return View();
        }

        public IActionResult List()
        {
            return View();
        }
    }
}
