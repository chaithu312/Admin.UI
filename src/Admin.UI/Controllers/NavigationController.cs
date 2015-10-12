﻿using Admin.UI.Models;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using System.Collections.Generic;

namespace Admin.UI.Controllers
{
    [Route("api/[controller]")]
    public class NavigationController : Controller
    {
        [HttpGet]
        public IEnumerable<Navigation> Get()
        {
            return new List<Navigation>
            {
                //Parent Navigation

                new Navigation { Id = 1, Title = "Dashboard", ParentId = 0, Type = "", NavURL = "/AdminUI/Index" },
                new Navigation { Id = 2, Title = "Shipments ", ParentId = 0, Type = "", NavURL = "/AdminUI/Shipment" },
                new Navigation { Id = 3, Title = "User", ParentId = 0, Type = "", NavURL = "/AdminUI/User" } ,
                new Navigation { Id = 4, Title = "Finance", ParentId = 0, Type = "", NavURL = "/AdminUI/Finance" },

                //Child Navigation
                new Navigation { Id = 5, Title = "AWB with Price", ParentId = 2, Type = "", NavURL = "/AdminUI/Shipment/AWBwithPrice" },
                new Navigation { Id = 6, Title = "Pickup Request ", ParentId = 2, Type = "", NavURL = "/AdminUI/Shipment/PickUpRequest" },
                new Navigation { Id = 7, Title = "View Pickup", ParentId = 2, Type = "", NavURL = "/AdminUI/Shipment/ViewPickup" },
                new Navigation { Id = 8, Title = "Tracking", ParentId = 2, Type = "", NavURL = "/AdminUI/Shipment/Tracking" } ,
                new Navigation { Id = 8, Title = "Vendor Setting", ParentId = 2, Type = "", NavURL = "/AdminUI/Shipment/VendorSetting" } ,

                new Navigation { Id = 9, Title = "Create User", ParentId = 3, Type = "", NavURL = "/AdminUI/User" },
                new Navigation { Id = 10, Title = "View User ", ParentId = 3, Type = "", NavURL = "/AdminUI/User/List" },
                new Navigation { Id = 11, Title = "AddressBook", ParentId = 3, Type = "", NavURL = "/AdminUI/User/AddressBook" },
                new Navigation { Id = 12, Title = "View Address", ParentId = 3, Type = "", NavURL = "/AdminUI/User/ViewAddress" }
            };
        }
    }
}