using Admin.UI.Areas.Shipment.Models;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Web.Script.Serialization;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Admin.UI.ShipmentArea
{
    [Area("Shipment")]
    public class HomeController : Controller
    {
        public IActionResult Shipments()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Shipments([FromBody] Shipments shipment)
        {
            if (shipment != null)
            {
                shipment.UserId = "4";//TODO:
                shipment.AccountId = "2";//TODO:
                shipment.TrackingNumber = "";//TODO:
                shipment.PickupId = "";//TODO:
                
            }

            if (shipment.AddressType == "0")
            {
                Admin.UI.Areas.User.Models.Address register = new Admin.UI.Areas.User.Models.Address();

                register.FirstName = shipment.Name;
                register.AccountId = 2;
                register.Status = 1;
                register.Created = DateTime.Now;
                register.AddressType = Areas.User.Models.Address.AddressTypes.Recipient;
                register.ShortName = shipment.AddressCaption;
                register.Phone1 = shipment.Phone;
                register.EMail = shipment.Email;
                register.CountryId = shipment.CountryId;
                register.PostalCode = shipment.PostalCode;
                register.Division = shipment.Division;
                register.City = shipment.City;
                register.Address1 = shipment.Address1;
                register.Address2 = shipment.Address2;

                string url = Constants.APIURL + "MasterApi/Address/Insert";

                using (var client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string serialisedData = JsonConvert.SerializeObject(register);

                    client.UploadString(url, serialisedData);
                }
            }

            var postData = JsonConvert.SerializeObject(shipment);
            string strURL = Constants.APIURL + "Shipments/SaveShipment";
            // string strURL= "http://localhost:49201/"+"DHL/Pickup";

            //Constants.ShippingURL + "Endicia/Pickup"
            //Constants.ShippingURL + "UPS/Pickup"
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            byte[] bytes;
            //bytes = System.Text.Encoding.ASCII.un(requestXml);
            bytes = System.Text.Encoding.UTF8.GetBytes(postData);
            request.ContentType = "application/json";
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();
            HttpWebResponse response;
            response = (HttpWebResponse)request.GetResponse();
            string responseString = string.Empty;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream responseStream = response.GetResponseStream();
                responseString = new StreamReader(responseStream).ReadToEnd();

                JavaScriptSerializer json_serializer = new JavaScriptSerializer();

                Response routes_list = JsonConvert.DeserializeObject<Response>(responseString);
                string replacestring = Constants.ReplaceErrorMessage;
                string ErrorMessage = routes_list.ErrorMessage.Replace(replacestring, "").Replace(Constants.xmlns, "").Replace(Constants.xsi, "");

                ResponseMessage errorResponse = JsonConvert.DeserializeObject<ResponseMessage>(ErrorMessage);
                if (errorResponse.Response.Status.ActionStatus == "Error")
                    return Json(errorResponse.Response.Status.Condition.ConditionData);
            }

            return Json("Failed");
        }

        public IActionResult VendorSetting()
        {
            return View();
        }

        [HttpPost]
        public JsonResult VendorSetting([FromBody]VendorSetting vendorSetting)
        {
            var message = Constants.message;
            try
            {
                if (vendorSetting != null)
                {
                    vendorSetting.AccountId = Constants.accountId;
                    vendorSetting.DomainKey = Constants.DomainKey;
                    vendorSetting.VendorId = (long)vendorSetting.VendorType;

                    vendorSetting.Expiration = DateTime.ParseExact(vendorSetting.Expiration, "dd-MM-yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd");
                    vendorSetting.Effective = DateTime.ParseExact(vendorSetting.Effective, "dd-MM-yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd");
                    string url = "http://localhost:49201/VendorSetting/";

                    object result = string.Empty;

                    using (var client = new WebClient())
                    {
                        client.Headers[HttpRequestHeader.ContentType] = Constants.ContentType;

                        string serialisedData = JsonConvert.SerializeObject(vendorSetting);

                        var response = client.UploadString(url, serialisedData);

                        result = JsonConvert.DeserializeObject(response);
                    }
                }
            }
            catch (Exception ex)
            {
                message = ex.Message;
            }

            return Json(message);
        }

        public IActionResult AWBWithprice()
        {
            return View();
        }

        public IActionResult PickupRequest()
        {
            return View();
        }

        [HttpPost]
        public JsonResult PickupRequest([FromBody]PickupRequest pickupRequest)
        {
            if (pickupRequest != null)
            {
                pickupRequest.UserID = "4";//TODO:
                pickupRequest.AccountID = "2";//TODO:
                pickupRequest.VendorAccountID = "1";//TODO:
                pickupRequest.PickupDate = CarrierSpecificValueConversion.GetDate(pickupRequest.PickupDate, (Carrier)Convert.ToInt16(pickupRequest.Carrier));
            }

            if (pickupRequest.AddressType == "0")
            {
                Admin.UI.Areas.User.Models.Address register = new Admin.UI.Areas.User.Models.Address();

                register.FirstName = pickupRequest.ContactName;
                register.AccountId = 2;
                register.Status = 1;
                register.Created = DateTime.Now;
                register.AddressType = Areas.User.Models.Address.AddressTypes.Recipient;
                register.ShortName = pickupRequest.AddressCaption;
                register.Phone1 = pickupRequest.Phone;
                register.EMail = pickupRequest.PickUpNotificationEmail;
                register.CountryId = pickupRequest.CountryID;
                register.PostalCode = pickupRequest.ZipCode;
                register.Division = pickupRequest.Division;
                register.City = pickupRequest.City;
                register.Address1 = pickupRequest.Address1;
                register.Address2 = pickupRequest.Address2;

                string url = Constants.APIURL + "MasterApi/Address/Insert";

                using (var client = new WebClient())
                {
                    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                    string serialisedData = JsonConvert.SerializeObject(register);

                    client.UploadString(url, serialisedData);
                }
            }

            var postData = JsonConvert.SerializeObject(pickupRequest);
            string strURL = Constants.APIURL + "DHL/Pickup";
            // string strURL= "http://localhost:49201/"+"DHL/Pickup";

            //Constants.ShippingURL + "Endicia/Pickup"
            //Constants.ShippingURL + "UPS/Pickup"
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(strURL);
            byte[] bytes;
            //bytes = System.Text.Encoding.ASCII.un(requestXml);
            bytes = System.Text.Encoding.UTF8.GetBytes(postData);
            request.ContentType = "application/json";
            request.ContentLength = bytes.Length;
            request.Method = "POST";
            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);
            requestStream.Close();
            HttpWebResponse response;
            response = (HttpWebResponse)request.GetResponse();
            string responseString = string.Empty;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                Stream responseStream = response.GetResponseStream();
                responseString = new StreamReader(responseStream).ReadToEnd();

                JavaScriptSerializer json_serializer = new JavaScriptSerializer();

                Response routes_list = JsonConvert.DeserializeObject<Response>(responseString);
                string replacestring = Constants.ReplaceErrorMessage;
                string ErrorMessage = routes_list.ErrorMessage.Replace(replacestring, "").Replace(Constants.xmlns, "").Replace(Constants.xsi, "");

                ResponseMessage errorResponse = JsonConvert.DeserializeObject<ResponseMessage>(ErrorMessage);
                if (errorResponse.Response.Status.ActionStatus == "Error")
                    return Json(errorResponse.Response.Status.Condition.ConditionData);
            }

            return Json("Failed");
        }

        public ActionResult ViewPickup()
        { return View(); }

        [HttpGet]
        public JsonResult GetAllPickup()
        {
            string strPostData = "accountId=2&orderBy=[Pickup].[Created]&sortBy=DESC";
            string url = Constants.APIURL + "/DHL/accountId?" + strPostData;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
            request.ContentType = Constants.ContentType;
            request.Method = "GET";

            using (WebResponse response = request.GetResponse())
            {
                Stream responseStream = response.GetResponseStream();
                string responseString = new StreamReader(responseStream).ReadToEnd();
                var objData = JsonConvert.DeserializeObject(responseString);

                //object result = string.Empty;

                //using (var client = new WebClient())
                //{
                //    client.Headers[HttpRequestHeader.ContentType] = "application/json";

                //    string serialisedData = JsonConvert.SerializeObject(strPostData);

                //    var response = client.UploadString(url, serialisedData);

                //    var objData = JsonConvert.DeserializeObject(response);

                JArray varPickUP = JArray.Parse(objData.ToString());
                IList<ViewPickup> viewpickup = varPickUP.Select(p => new ViewPickup
                {
                    Id = (string)p["Id"],
                    Detail = (string)p["Detail"],
                    Confirmation = (string)p["Confirmation"],
                    Destination = (string)p["Destination"],
                    Created = ((DateTime)p["Created"]).ToString("yyyy-MM-dd"),
                    Status = (string)p["Status"].ToString() == "1" ? "Success" : "Failed"
                }).ToList();

                var result = JsonConvert.SerializeObject(viewpickup);

                //result = JsonConvert.DeserializeObject(response);
                return Json(result);
            }
        }

        public JsonResult DeletePickup(string selectedIds)
        {
            return Json("Deleted Successfully");
        }

        public IActionResult Tracking()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetAddressById(long addressType)
        {
            string url = Constants.APIURL + "MasterApi/Address/Id";

            object result = string.Empty;

            using (var client = new WebClient())
            {
                client.Headers[HttpRequestHeader.ContentType] = Constants.ContentType;

                string serialisedData = JsonConvert.SerializeObject(addressType);

                var response = client.UploadString(url, serialisedData);

                result = JsonConvert.DeserializeObject(response);
            }
            return Json(result);
        }
    }

    internal struct CarrierSpecificValueConversion
    {
        public static string GetDate(string pickupDate, Carrier carrierType)
        {
            switch (carrierType)
            {
                case Carrier.DHL:
                    pickupDate = DateTime.ParseExact(pickupDate, "dd-MM-yyyy", CultureInfo.InvariantCulture).ToString("yyyy-MM-dd");
                    break;
            }
            return pickupDate;
        }
    }

    public enum Carrier
    {
        DHL = 1,
        Endicia
    }
}