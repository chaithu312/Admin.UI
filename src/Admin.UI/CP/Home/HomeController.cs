﻿using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.CP.Home
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}