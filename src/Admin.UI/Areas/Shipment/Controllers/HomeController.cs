using Microsoft.AspNet.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Admin.UI.ShipmentArea
{
    [Area("Shipment")]
    public class HomeController : Controller
    {
        public IActionResult Shipping()
        {
            return View();
        }

        public IActionResult VendorSetting()
        {
            return View();
        }

        public IActionResult AWBWithprice()
        {
            return View();
        }

        public IActionResult PickupRequest()
        {
            return View();
        }

        public IActionResult Tracking()
        {
            return View();
        }
    }
}