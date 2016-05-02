using System;
using System.ComponentModel;

namespace Admin.UI.CP.Shipment.Models
{
    public class Billing
    {
        public enum PaymentTypes
        {
            [Description("S")]
            Shipper,

            [Description("R")]
            Recipient,

            [Description("T")]
            ThirdParty_Other
        }

        public string DutyTaxPaymentAccount { get; set; }
        public PaymentTypes DutyTaxPaymentType { get; set; }
        public string ShippingPaymentAccount { get; set; }
        public PaymentTypes ShippingPaymentType { get; set; }
    }
}