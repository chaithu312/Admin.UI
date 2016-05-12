using Admin.UI.CP.Pickup.Models;
using ShipOS.Utility.Common.Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.CP.Shipment.Models
{
    public class ShipmentResponseModel
    {
        public string AirwayBillNumber { get; set; }
        public string RoutingNumber { get; set; }
        public string BillingCode { get; set; }
        public string ChargeableWeight { get; set; }
        public decimal Charge { get; set; }
        public string CountryCode { get; set; }
        public string CourierMessage { get; set; }
        public List<ErrorModel> ErrorMessage { get; set; }
        public string CurrencyCode { get; set; }
        public DateTime DeliveryDate { get; set; }
        public List<string> LabelURLS { get; set; }
        public string ShippingCharge { get; set; }
        public string StatusDescription { get; set; }
        public Status.APIRequestStatus Status { get; set; }
        public int TransactionId { get; set; }
    }
}