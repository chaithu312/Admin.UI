﻿using Admin.UI.Filter;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;

namespace Admin.UI.Controllers
{
    public class HomeController : Controller
    {
        private IOptions<AppSettings> AppSettings;
        private static readonly object filterContext;

        public HomeController(IOptions<AppSettings> appSettings)
        {
            AppSettings = appSettings;
        }
		
		public IActionResult Index()
        {
			ViewBag.User = HttpContext.Session.GetString("User");
			return RedirectToAction("Index", "Home", new { area = "User" });
        }

		[CustomAction]
        public IActionResult Dashboard()
        {
			ViewBag.User = HttpContext.Session.GetString("User");
			ViewBag.t = HttpContext.Session.GetString("Welcome");
            return View();
        }

        public IActionResult Index2()
        {
            return View();
        }
    }
}