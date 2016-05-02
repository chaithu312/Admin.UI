using Admin.UI.CP.Pickup.Models;

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Shipment.Models
{
    public class ShipmentModel
    {
        public int Agent { get; set; }
        public long AccountId { get; set; }
        public long UserId { get; set; }

        [Required]
        public DateTime ShipTimestamp { get; set; }

        public DateTime DeliveryDate { get; set; }

        [Required]
        public Billing Billing { get; set; }

        [Required]
        public Address Recipient { get; set; }

        [Required]
        public Address Shipper { get; set; }

        [Required]
        public List<Parcel> Parcels { get; set; }

        [Required]
        public string PartnerTransactionId { get; set; }

        public CollectionOnDelivery CollectionOnDelivery { get; set; }

        public InsuranceModel InsuranceModel { get; set; }

        public string ConfirmationNumber { get; set; }

        public bool IsInternational => Shipper.CountryCode != Recipient.CountryCode;

        // Contents in Database

        public List<Content> CommodityDetails { get; set; }

        public decimal DeclaredValue { get; set; }

        public bool IsDocument { get; set; }

        public string LabelSize { get; set; }

        public string LabelType { get; set; }

        public string Comments { get; set; }

        public string ShipmentChargeType { get; set; }

        public long ShipmentId { get; set; }

        public bool Status { get; set; }

        public bool HoldOff { get; set; }
    }

    public class LabelImage
    {
        public string OutputFormat { get; set; }

        public byte[] OutputByteArray { get; set; }
    }
}