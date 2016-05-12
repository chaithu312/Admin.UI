using Admin.UI.CP.Pickup.Models;
using ShipOS.Utility.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Shipment.Models
{
    public class ShipmentModel : IValidatableObject
    {
        public long ShipmentId { get; set; }

        public int Agent { get; set; }
        public long AccountId { get; set; }
        public long UserId { get; set; }

        [Required(ErrorMessage = "Shipment Date is Required")]
        [Display(Name = "Shipment Date")]
        public DateTime ShipmentDate { get; set; }

        public DateTime DeliveryDate { get; set; }

        public Billing Billing { get; set; }

        [Required(ErrorMessage = "Recipient is Required")]
        public Address Recipient { get; set; }

        [Required(ErrorMessage = "Shipper is Required")]
        public Address Shipper { get; set; }

        [Required(ErrorMessage = "Parcels are Required")]
        public List<Parcel> Parcels { get; set; }

        public CollectionOnDelivery CollectionOnDelivery { get; set; }

        public List<InsuranceModel> Insurance { get; set; }

        public string TrackingNumber { get; set; }

        public bool IsInternational => Shipper.CountryCode != Recipient.CountryCode;

        // Contents in Database

        public List<Content> Contents { get; set; }

        public bool IsDocument { get; set; }

        public string Comments { get; set; }

        public bool Status { get; set; }

        public string ShipmentChargeType { get; set; }

        public byte Unit { get; set; }

        public bool HoldOff { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (IsInternational && this.Contents.IsNullOrEmpty())
            {
                yield return new ValidationResult("Commodity Details are required for international shipping", new List<string>() { "Commodity Details" });
            }
        }
    }
}