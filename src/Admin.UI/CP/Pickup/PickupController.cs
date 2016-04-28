using Admin.UI.CP.Pickup.Models;
using Admin.UI.Utility;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Admin.UI.CP.Pickup
{
    public class PickupController : BaseController
    {
        // GET: /<controller>/

        public PickupController(ILogger<Controller> logger, IOptions<Configuration.IdentityServer> config,
        IOptions<List<Configuration.ApiSetting>> apiSettings)
            : base(logger, config, apiSettings)
        {
        }

        [HttpGetAttribute]
        [Route(Constants.RoutePaths.Shipments_Pickup)]
        public IActionResult Index()
        {
            var pickupRequestModel = new PickupRequestModel();

            return View(pickupRequestModel);
        }

        [HttpPost]
        [Route(Constants.RoutePaths.Shipments_Pickup)]
        public IActionResult Index(PickupRequestModel model)
        {
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);

                foreach (var error in allErrors)
                {
                    this.ShowMessage(AlertMessageType.Error, error.ErrorMessage, true);
                }
                //this.ShowMessage(AlertMessageType.Error, "Error occured", true);
                return View(model);
            }
            this.ShowMessage(AlertMessageType.Success, "Successfully Saved", true);
            RedirectToAction("Index");

            return View(model);
        }

        //[HttpPost]
        //[AllowAnonymous]
        //[Route("Shipping/Pickup/Ajax")]
        //public JsonResult Index(PickupRequestModel model)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        var allErrors = ModelState.Values.SelectMany(v => v.Errors);

        //        foreach (var error in allErrors)
        //        {
        //            this.ShowMessage(AlertMessageType.Error, error.ErrorMessage, true);
        //        }
        //        //this.ShowMessage(AlertMessageType.Error, "Error occured", true);
        //        return new JsonResult(allErrors);
        //    }
        //    this.ShowMessage(AlertMessageType.Success, "Successfully Saved", true);

        //    return new JsonResult("saved");
        //}
    }
}