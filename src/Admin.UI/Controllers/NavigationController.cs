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
                    new Navigation {Id=1, Title="Dashboard", ParentId=0, Type="" },
                    new Navigation {Id=2, Title="Shipments ", ParentId=0, Type="" },
                    new Navigation {Id=3, Title="Contact",ParentId=0, Type="" } ,
                    new Navigation {Id=4, Title="Finance", ParentId=0, Type="" },

                };
        }
    }
}
