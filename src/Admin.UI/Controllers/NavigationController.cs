using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Admin.UI.Models;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

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
                new Navigation {Id=1, Title="Dashboard", ParentId=0, Type="",NavURL="#" },
                new Navigation {Id=2, Title="Shipments ", ParentId=0, Type="",NavURL="#" },
                new Navigation {Id=3, Title="User",ParentId=0, Type="",NavURL="/User" } ,
                new Navigation {Id=4, Title="Finance", ParentId=0, Type="",NavURL="#" },

                //Child Navigation
                new Navigation {Id=5, Title="AWB with Price", ParentId=2, Type="",NavURL="#" },
                new Navigation {Id=6, Title="Pickup Request ", ParentId=2, Type="",NavURL="#" },
                new Navigation {Id=7, Title="Tracking",ParentId=2, Type="",NavURL="#" } ,


                new Navigation {Id=8, Title="Create User", ParentId=3, Type="",NavURL="/User" },
                new Navigation {Id=9, Title="View User ", ParentId=3, Type="",NavURL="/User/List" },
                new Navigation {Id=10, Title="Test",ParentId=3, Type="",NavURL="/User/Test" } ,
            };
        }
    }
}
