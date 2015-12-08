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

                new Navigation { Id = 1, Title = "Dashboard", ParentId = 0, Type = "", NavURL = Constants.VirtualDir+"/Index" },
                new Navigation { Id = 2, Title = "Shipments ", ParentId = 0, Type = "", NavURL = Constants.VirtualDir+"/Shipment" },
                new Navigation { Id = 3, Title = "User", ParentId = 0, Type = "", NavURL = Constants.VirtualDir+"/User" } ,

                //Child Navigation

                new Navigation { Id = 5, Title = "AWB with Price", ParentId = 2, Type = "", NavURL = Constants.VirtualDir+"/Shipment/AWBwithPrice" },
                new Navigation { Id = 6, Title = "Pickup Request ", ParentId = 2, Type = "", NavURL = Constants.VirtualDir+"/Shipment/PickUpRequest" },
                new Navigation { Id = 7, Title = "View Pickup", ParentId = 2, Type = "", NavURL = Constants.VirtualDir+"/Shipment/ViewPickup" },
                new Navigation { Id = 8, Title = "Tracking", ParentId = 2, Type = "", NavURL = Constants.VirtualDir+"/Shipment/Tracking" } ,
                new Navigation { Id = 8, Title = "Vendor Setting", ParentId = 2, Type = "", NavURL = Constants.VirtualDir+"/Shipment/VendorSetting" } ,
                new Navigation { Id = 9, Title = "Shipments", ParentId = 2, Type = "", NavURL = Constants.VirtualDir+"/Shipment/Shipments" } ,

                new Navigation { Id = 10, Title = "Create User", ParentId = 3, Type = "", NavURL = Constants.VirtualDir+"/User" },
                new Navigation { Id = 11, Title = "View User ", ParentId = 3, Type = "", NavURL = Constants.VirtualDir+"/User/List" },
                new Navigation { Id = 12, Title = "AddressBook", ParentId = 3, Type = "", NavURL = Constants.VirtualDir+"/User/AddressBook" },
                new Navigation { Id = 13, Title = "View Address", ParentId = 3, Type = "", NavURL = Constants.VirtualDir+"/User/ViewAddress" },

                new Navigation { Id = 14, Title = "Home", ParentId = 1, Type = "", NavURL = Constants.VirtualDir+"/default" },
            };
        }
    }
}