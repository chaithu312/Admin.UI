using Admin.UI.CP.Pickup.Models;
using Admin.UI.Utility;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Http;
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
        public async Task<IActionResult> GetAll()
        {
            return View("Index");
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
            var pickupModel = new PickupModel()
            {
                Parcels = new List<Parcel>()
            };

            if (id != 0)
            {
                using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
                {
                    try
                    {
                        var response = await client.GetAsync($"pickup/{id}");
                        response.EnsureSuccessStatusCode();
                        pickupModel = await response.Content.ReadAsAsync<PickupModel>();
                        pickupModel.ReadyTime = Convert.ToDateTime(pickupModel.ReadyTime).ToString("hh:mm");
                        pickupModel.AvailableUntil = Convert.ToDateTime(pickupModel.AvailableUntil).ToString("hh:mm");
                    }
                    catch (Exception ex)
                    {
                        //TODO Log Here
                    }
                }
            }

            if (pickupModel.Parcels?.Count == 0)
                pickupModel.Parcels = new List<Parcel> { new Parcel() };

            return View("Pickup", pickupModel);
        }

        [HttpPost]
        [Route(Constants.RoutePaths.Pickup)]
        public async Task<IActionResult> Index(PickupModel model)
        {
            var response = new PickupResponseModel();
            var result = default(HttpResponseMessage);
            if (!ModelState.IsValid)
            {
                var allErrors = ModelState.Values.SelectMany(v => v.Errors);

                foreach (var error in allErrors)
                {
                    this.ShowMessage(AlertMessageType.Error, error.ErrorMessage, true);
                }
                return View("Pickup", model);
            }

            model.ReadyTime = model.PickupDate.Add(Convert.ToDateTime(model.ReadyTime).TimeOfDay).ToString();
            model.AvailableUntil = model.PickupDate.Add(Convert.ToDateTime(model.AvailableUntil).TimeOfDay).ToString();

            using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
            {
                try
                {
                    if (model.PickupId == 0)
                        result = await client.PostAsJsonAsync<PickupModel>($"pickup/", model);
                    else
                        result = await client.PutAsJsonAsync<PickupModel>($"pickup/", model);

                    if (result.IsSuccessStatusCode)
                    {
                        response = result.Content.ReadAsAsync<PickupResponseModel>().Result;
                        if (response.Status == ShipOS.Utility.Common.Enumerations.Status.APIRequestStatus.Success)
                        {
                            this.ShowMessage(AlertMessageType.Success, string.Format("Pickup scheduled with confirmation number {0}", response.ConfirmationNumber), true);
                            RedirectToAction("Index", new { id = 0 });
                        }
                        else
                        {
                            var errorList = string.Empty;
                            foreach (var error in response.ErrorMessage)
                            {
                                errorList += string.Format("</br><b>Code:</b>{0} <b>Description:</b>{1}", error.Code, error.Description);
                            }
                            this.ShowMessage(AlertMessageType.Error, errorList, true);
                        }
                    }
                    else
                        this.ShowMessage(AlertMessageType.Error, result.Content.ReadAsStringAsync().Result, true);
                }
                catch (Exception ex)
                {
                    this.ShowMessage(AlertMessageType.Error, "Internal Server Error", true);
                }
            }

            return View("Pickup", model);
        }
    }
}