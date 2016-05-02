using Admin.UI.CP.Pickup.Models;
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

        [HttpGet]
        [Route(Constants.RoutePaths.PickupList)]
        public async Task<IActionResult> Index()
        {
            return View();
        }

        [HttpGet]
        [Route(Constants.RoutePaths.PickupData)]
        public async Task<JsonResult> GetData()
        {
            var modal = new PickupListModel { Pickups = new List<PickupModel>() };
            using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
            {
                try
                {
                    var response = await client.GetAsync($"pickup/");
                    response.EnsureSuccessStatusCode();
                    modal.Pickups = await response.Content.ReadAsAsync<List<PickupModel>>();
                }
                catch (Exception ex)
                {
                    //TODO Log Here
                }
                return new JsonResult(modal.Pickups);
            }
        }

        [HttpGet("{id}")]
        [Route(Constants.RoutePaths.Pickup)]
        public async Task<IActionResult> Index(long id)
        {
            var pickupRequestModel = new PickupModel();

            if (id != 0)
            {
                using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
                {
                    try
                    {
                        var response = await client.GetAsync($"pickup/{id}");
                        response.EnsureSuccessStatusCode();
                        pickupRequestModel = await response.Content.ReadAsAsync<PickupModel>();
                    }
                    catch (Exception ex)
                    {
                        //TODO Log Here
                    }
                }
            }

            if (pickupRequestModel.Parcels?.Count == 0)
                pickupRequestModel.Parcels = new List<Parcel> { new Parcel() };

            return View("Pickup", pickupRequestModel);
        }

        [HttpPost]
        [Route(Constants.RoutePaths.Pickup)]
        public IActionResult Index(PickupModel model)
        {
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);

                foreach (var error in allErrors)
                {
                    this.ShowMessage(AlertMessageType.Error, error.ErrorMessage, true);
                }
                //this.ShowMessage(AlertMessageType.Error, "Error occured", true);
                return View("Pickup", model);
            }
            this.ShowMessage(AlertMessageType.Success, "Successfully Saved", true);
            RedirectToAction("Index");

            return View("Pickup", model);
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