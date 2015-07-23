using Admin.UI.Models;
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
                new Navigation {Id=1, Title="Dashboard", ParentId=0, Type="",NavURL="/Index" },
                new Navigation {Id=2, Title="Shipments ", ParentId=0, Type="",NavURL="/Shipment" },
                new Navigation {Id=3, Title="User",ParentId=0, Type="",NavURL="/User" } ,
                new Navigation {Id=4, Title="Finance", ParentId=0, Type="",NavURL="/Finance" },

                //Child Navigation
                new Navigation {Id=5, Title="AWB with Price", ParentId=2, Type="",NavURL="/Shipment/AWBwithPrice" },
                new Navigation {Id=6, Title="Pickup Request ", ParentId=2, Type="",NavURL="/Shipment/PickUpRequest" },
                new Navigation {Id=7, Title="Tracking",ParentId=2, Type="",NavURL="/Shipment/Tracking" } ,

                new Navigation {Id=8, Title="Create User", ParentId=3, Type="",NavURL="/User" },
                new Navigation {Id=9, Title="View User ", ParentId=3, Type="",NavURL="/User/List" },
                new Navigation {Id=10, Title="Test",ParentId=3, Type="",NavURL="/User/Test" } ,
            };
        }
    }
}