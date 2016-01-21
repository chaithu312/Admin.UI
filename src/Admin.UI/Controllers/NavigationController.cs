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
          
            new Navigation { Id = 1, Title = "Dashboard", ParentId = 0, Type = "", NavURL = "/Index" },
                new Navigation { Id = 2, Title = "Shipments ", ParentId = 0, Type = "", NavURL = "/Shipment" },
                new Navigation { Id = 3, Title = "User", ParentId = 0, Type = "", NavURL = "/User" } ,
                new Navigation { Id = 4, Title = "Service & Rate", ParentId = 0, Type = "", NavURL = "/ServiceRate" } ,

                //Child Navigation

                //new Navigation { Id = 5, Title = "AWB with Price", ParentId = 2, Type = "", NavURL = "/Shipment/AWBwithPrice" },
                new Navigation { Id = 6, Title = "Pickup Request ", ParentId = 2, Type = "", NavURL = "/Shipment/PickUpRequest" },
                new Navigation { Id = 7, Title = "View Pickup", ParentId = 2, Type = "", NavURL = "/Shipment/ViewPickup" },
                //new Navigation { Id = 8, Title = "Tracking", ParentId = 2, Type = "", NavURL = "/Shipment/Tracking" } ,
                new Navigation { Id = 8, Title = "Vendor Setting", ParentId = 2, Type = "", NavURL = "/Shipment/VendorSetting" } ,
                new Navigation { Id = 9, Title = "Shipments", ParentId = 2, Type = "", NavURL = "/Shipment/Shipments" } ,

                //new Navigation { Id = 10, Title = "Create User", ParentId = 3, Type = "", NavURL = "/User" },
                //new Navigation { Id = 11, Title = "View User ", ParentId = 3, Type = "", NavURL = "/User/List" },
                new Navigation { Id = 12, Title = "AddressBook", ParentId = 3, Type = "", NavURL = "/User/AddressBook" },
                new Navigation { Id = 13, Title = "View Address", ParentId = 3, Type = "", NavURL = "/User/ViewAddress" },

                new Navigation { Id = 14, Title = "Home", ParentId = 1, Type = "", NavURL = "/home/Dashboard" },


                new Navigation { Id = 15, Title = "Agents", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewAgents" },
                new Navigation { Id = 16, Title = "Agent Service ", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewAgentService" },
                new Navigation { Id = 17, Title = "Country", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewCountries" },
                new Navigation { Id = 18, Title = "State", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewStates" },
                new Navigation { Id = 19, Title = "Postal Code", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewPostCode" },
				new Navigation { Id = 20, Title = "Zone US", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewZoneUS" },
				new Navigation { Id = 20, Title = "Zone", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewZone" },
				new Navigation { Id = 20, Title = "FSC", ParentId = 4, Type = "", NavURL = "/ServiceRate/ViewFSC" },
				new Navigation { Id = 20, Title = "Invoice Message", ParentId = 4, Type = "", NavURL = "/Finance/ViewInvoiceMessage" },
				new Navigation { Id = 20, Title = "Payment", ParentId = 4, Type = "", NavURL = "/Finance/Payment" },
				new Navigation { Id = 20, Title = "Freight Request", ParentId = 4, Type = "", NavURL = "/Freight/FreightRequests" },
			};
        }
    }
}