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
          
            new Navigation { Id = 1, Title = "Dashboard", ParentId = 0, Type = "", NavURL = "/Index" },
                new Navigation { Id = 2, Title = "Shipments ", ParentId = 0, Type = "", NavURL = "/Shipment" },
                new Navigation { Id = 3, Title = "User", ParentId = 0, Type = "", NavURL = "/User" } ,
                

                //Child Navigation

                new Navigation { Id = 5, Title = "AWB with Price", ParentId = 2, Type = "", NavURL = "/Shipment/AWBwithPrice" },
                new Navigation { Id = 6, Title = "Pickup Request ", ParentId = 2, Type = "", NavURL = "/Shipment/PickUpRequest" },
                new Navigation { Id = 51, Title = "Supply Order", ParentId = 2, Type = "", NavURL = "/Shipment/SupplyOrder" },
                new Navigation { Id = 52, Title = "Supply Material", ParentId = 2, Type = "", NavURL = "/Shipment/ViewSupplyMaterial" },
                new Navigation { Id = 7, Title = "View Pickup", ParentId = 2, Type = "", NavURL = "/Shipment/ViewPickup" },
                new Navigation { Id = 8, Title = "Tracking", ParentId = 2, Type = "", NavURL = "/Shipment/Tracking" } ,
                new Navigation { Id = 8, Title = "Vendor Setting", ParentId = 2, Type = "", NavURL = "/Shipment/VendorSetting" } ,
                new Navigation { Id = 9, Title = "Shipments", ParentId = 2, Type = "", NavURL = "/Shipment/Shipments" } ,

                //new Navigation { Id = 10, Title = "Create User", ParentId = 3, Type = "", NavURL = "/User" },
                //new Navigation { Id = 11, Title = "View User ", ParentId = 3, Type = "", NavURL = "/User/List" },
                new Navigation { Id = 12, Title = "AddressBook", ParentId = 3, Type = "", NavURL = "/User/AddressBook" },
                new Navigation { Id = 13, Title = "View Address", ParentId = 3, Type = "", NavURL = "/User/ViewAddress" },

                new Navigation { Id = 14, Title = "Home", ParentId = 1, Type = "", NavURL = "/home/Dashboard" },

                //new Navigation { Id = 4, Title = "Service & Rate", ParentId = 0, Type = "", NavURL = "/ServiceRate" } ,
                new Navigation { Id = 23, Title = "Agents", ParentId = 0, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 15, Title = "Agents", ParentId = 23, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 16, Title = "Agent Service ", ParentId = 23, Type = "", NavURL = "/ServiceRate/ViewAgentService" },

                new Navigation { Id = 27, Title = "Routing", ParentId = 0, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 28, Title = "Route Definations", ParentId = 27, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 29, Title = "Route Selections", ParentId = 27, Type = "", NavURL = "/ServiceRate/RouteSelections" },
                new Navigation { Id = 30, Title = "US Post Code Sets", ParentId = 27, Type = "", NavURL = "/ServiceRate/USPostCodes" },
                new Navigation { Id = 31, Title = "Country Sets", ParentId = 27, Type = "", NavURL = "/ServiceRate/CountrySets" },


                new Navigation { Id = 24, Title = "Locations", ParentId = 0, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 17, Title = "Country", ParentId = 24, Type = "", NavURL = "/ServiceRate/ViewCountries" },
                new Navigation { Id = 18, Title = "State", ParentId = 24, Type = "", NavURL = "/ServiceRate/ViewStates" },
                new Navigation { Id = 19, Title = "Postal Code", ParentId = 24, Type = "", NavURL = "/ServiceRate/ViewPostCode" },

                new Navigation { Id = 25, Title = "Zone Setting", ParentId = 0, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 20, Title = "Zone US", ParentId = 25, Type = "", NavURL = "/ServiceRate/ViewZoneUS" },
				new Navigation { Id = 21, Title = "Zone", ParentId = 25, Type = "", NavURL = "/ServiceRate/ViewZone" },

                new Navigation { Id = 26, Title = "Rate & Setting", ParentId = 0, Type = "", NavURL = "/ServiceRate/ViewRoutes" },
                new Navigation { Id = 22, Title = "Discount", ParentId = 26, Type = "", NavURL = "/ServiceRate/Discount" },
                new Navigation { Id = 22, Title = "Agents FSC Values", ParentId = 26, Type = "", NavURL = "/ServiceRate/ViewFSC" },


                new Navigation { Id = 32, Title = "Finance", ParentId = 0, Type = "", NavURL = "/Finance/ViewInvoiceMessage" },
                new Navigation { Id = 33, Title = "Invoice Message", ParentId = 32, Type = "", NavURL = "/Finance/ViewInvoiceMessage" },
                
                new Navigation { Id = 34, Title = "Payment", ParentId = 32, Type = "", NavURL = "/Finance/Payment" },


                new Navigation { Id = 35, Title = "Freight", ParentId = 0, Type = "", NavURL = "/Freight/ViewRoutes" },
                new Navigation { Id = 36, Title = "Freight Requests", ParentId = 35, Type = "", NavURL = "/Freight/ViewFreightRequests" },
                


            };
        }
    }
}