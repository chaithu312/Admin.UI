using Admin.UI.Models;
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

                new Navigation { Id = 1, Title = "Dashboard", ParentId = 0, Type = "", NavURL = "/adminui/Index" },
                new Navigation { Id = 2, Title = "Shipments ", ParentId = 0, Type = "", NavURL = "/adminui/Shipment" },
                new Navigation { Id = 3, Title = "User", ParentId = 0, Type = "", NavURL = "/adminui/User" } ,

                //Child Navigation

                new Navigation { Id = 5, Title = "AWB with Price", ParentId = 2, Type = "", NavURL = "/adminui/Shipment/AWBwithPrice" },
                new Navigation { Id = 6, Title = "Pickup Request ", ParentId = 2, Type = "", NavURL = "/adminui/Shipment/PickUpRequest" },
                new Navigation { Id = 7, Title = "View Pickup", ParentId = 2, Type = "", NavURL = "/adminui/Shipment/ViewPickup" },
                new Navigation { Id = 8, Title = "Tracking", ParentId = 2, Type = "", NavURL = "/adminui/Shipment/Tracking" } ,
                new Navigation { Id = 8, Title = "Vendor Setting", ParentId = 2, Type = "", NavURL = "/adminui/Shipment/VendorSetting" } ,
                new Navigation { Id = 9, Title = "Shipments", ParentId = 2, Type = "", NavURL = "/adminui/Shipment/Shipments" } ,

                new Navigation { Id = 10, Title = "Create User", ParentId = 3, Type = "", NavURL = "/adminui/User" },
                new Navigation { Id = 11, Title = "View User ", ParentId = 3, Type = "", NavURL = "/adminui/User/List" },
                new Navigation { Id = 12, Title = "AddressBook", ParentId = 3, Type = "", NavURL = "/adminui/User/AddressBook" },
                new Navigation { Id = 13, Title = "View Address", ParentId = 3, Type = "", NavURL = "/adminui/User/ViewAddress" },

                new Navigation { Id = 14, Title = "Home", ParentId = 1, Type = "", NavURL = "/adminui/default" },
            };
        }
    }
}