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
        public async Task<IActionResult> GetAll()
        {
             return View("Index");
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
            var shipmentModel = new ShipmentModel() { Parcels = new List<Parcel>(), Contents = new List<Models.Content>() };

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

            if (shipmentModel.Contents?.Count == 0)
                shipmentModel.Contents = new List<Content> { new Content() };

            if (shipmentModel.Parcels?.Count == 0)
                shipmentModel.Parcels = new List<Parcel> { new Parcel() };

            return View("Shipment", shipmentModel);
        }

        [HttpPost]
        [Route(Constants.RoutePaths.Shipment)]
        public async Task<IActionResult> Index(ShipmentModel model)
        {
            var result = default(HttpResponseMessage);
            var response = new ShipmentResponseModel();

            //If international remove commodity validation
            if (!model.IsInternational)
            {
                foreach (var ms in ModelState.ToArray())
                {
                    if (ms.Key.StartsWith("CommodityDetails"))
                    {
                        ModelState.Remove(ms);
                    }
                }
                model.Contents = null;
            }

            if (!ModelState.IsValid)
            {
                foreach (var error in ModelState.Values.SelectMany(v => v.Errors))
                {
                    this.ShowMessage(AlertMessageType.Error, error.ErrorMessage, true);
                }
                if (model.Contents == null)
                    model.Contents = new List<Models.Content>();
                return View("Shipment", model);
            }

            using (var client = new OAuthClient(User, _apiSettings.Value, "Shipping"))
            {
                try
                {
                    if (model.ShipmentId == 0)
                        result = await client.PostAsJsonAsync<ShipmentModel>($"Shipment/", model);
                    else
                        result = await client.PutAsJsonAsync<ShipmentModel>($"Shipment/", model);

                    if (result.IsSuccessStatusCode)
                    {
                        response = result.Content.ReadAsAsync<ShipmentResponseModel>().Result;
                        if (response.Status == ShipOS.Utility.Common.Enumerations.Status.APIRequestStatus.Success)
                        {
                            this.ShowMessage(AlertMessageType.Success, string.Format("Shipment scheduled with AWB {0}", response.AirwayBillNumber), true);
                            RedirectToAction("Index", new { id = 0 });
                        }
                        else
                        {
                            var errorList = string.Empty;
                            if (response.ErrorMessage != null)
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
                    this.ShowMessage(AlertMessageType.Error, ex.Message + "Internal Server Error", true);
                }
            }

            this.ShowMessage(AlertMessageType.Success, "Successfully Saved", true);
            RedirectToAction("Index");

            if (model.Contents == null)
                model.Contents = new List<Models.Content>();
            return View("Shipment", model);
        }
    }
}