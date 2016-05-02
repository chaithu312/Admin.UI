using Admin.UI.CP.Pickup.Models;
using Admin.UI.CP.Shipment.Models;
using Admin.UI.Utility;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.OptionsModel;
using ShipOS.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Admin.UI.CP.Shipment
{
    public class ShipmentController : BaseController
    {
        // GET: /<controller>/

        public ShipmentController(ILogger<Controller> logger, IOptions<Configuration.IdentityServer> config,
        IOptions<List<Configuration.ApiSetting>> apiSettings)
            : base(logger, config, apiSettings)
        {
        }

        [HttpGet]
        [Route(Constants.RoutePaths.ShipmentList)]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpGet]
        [Route(Constants.RoutePaths.ShipmentData)]
        public async Task<JsonResult> GetData()
        {
            var modal = new ShipmentListModel { Shipments = new List<ShipmentModel>() };
            using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
            {
                try
                {
                    var response = await client.GetAsync($"Shipment/");
                    response.EnsureSuccessStatusCode();
                    modal.Shipments = await response.Content.ReadAsAsync<List<ShipmentModel>>();
                }
                catch (Exception ex)
                {
                    //TODO Log Here
                }
                return new JsonResult(modal.Shipments);
            }
        }

        [HttpGet("{id}")]
        [Route(Constants.RoutePaths.Shipment)]
        public async Task<IActionResult> Index(long id)
        {
            var shipmentModel = new ShipmentModel();

            if (id != 0)
            {
                using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
                {
                    try
                    {
                        var response = await client.GetAsync($"shipment/{id}");
                        response.EnsureSuccessStatusCode();
                        shipmentModel = await response.Content.ReadAsAsync<ShipmentModel>();
                    }
                    catch (Exception ex)
                    {
                        //TODO Log Here
                    }
                }
            }

            if (shipmentModel.Parcels?.Count == 0)
                shipmentModel.Parcels = new List<Parcel> { new Parcel() };

            return View("Shipment", shipmentModel);
        }

        [HttpPost]
        [Route(Constants.RoutePaths.Shipment)]
        public IActionResult Index(ShipmentModel model)
        {
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);

                foreach (var error in allErrors)
                {
                    this.ShowMessage(AlertMessageType.Error, error.ErrorMessage, true);
                }
                //this.ShowMessage(AlertMessageType.Error, "Error occured", true);
                return View("Shipment", model);
            }
            this.ShowMessage(AlertMessageType.Success, "Successfully Saved", true);
            RedirectToAction("Index");

            return View("Shipment", model);
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