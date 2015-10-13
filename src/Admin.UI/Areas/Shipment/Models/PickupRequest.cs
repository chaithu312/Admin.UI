using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Shipment.Models
{
    public class PickupRequest
    {
        public string UserID { get; set; }
        public string AccountID { get; set; }
        public string VendorAccountID { get; set; }

        public string ContactName { get; set; }

        public string Phone { get; set; }

        public string AddressCaption { get; set; }

        public string AddressType { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string City { get; set; }

        public string Division { get; set; }

        public string ZipCode { get; set; }
        public string CountryCode { get; set; }
        public string Country { get; set; }
        public string CountryID { get; set; }

        public string AddressNotes { get; set; }

        public bool isResidential { get; set; }

        public string Carrier { get; set; }

        public string PickupFrom { get; set; }

        public string PickupDate { get; set; }

        public string Destination { get; set; }

        public bool isHeavy { get; set; }

        public string ReadyTime { get; set; }
        public string AvailableTime { get; set; }
        public int? ParcelType { get; set; }
        public int TotalPieces { get; set; }

        public string AdditionalsInstructions { get; set; }

        public string PickUpNotificationMobile { get; set; }
        public string PickUpNotificationEmail { get; set; }
        public string PickUpNotificationYourEmail { get; set; }
        public string PickUpNotificationPersonalizedMessage { get; set; }
    }

    public class Pickup
    {
        [Required]
        public bool UseShipperAddress { get; set; }

        [Required]
        public Address Address { get; set; }

        [Required]
        public DateTime ReadyBy { get; set; }

        [Required]
        public DateTime NoLaterThan { get; set; }

        [Required]
        public string Instructions { get; set; }

        [Required]
        public bool IsHeavy { get; set; }

        [Required]
        public bool IsBulky { get; set; }

        public string ConfirmationNumber { get; set; }

        public string OriginSvcArea { get; set; }

        public string CancelReason { get; set; }

        public string RegionCode { get; set; }

        [Required]
        public string RequestorName { get; set; }

        [Required]
        public string RequestorAccountType { get; set; }

        [Required]
        public string RequestorPhone { get; set; }

        [Required]
        public string AccountType { get; set; }

        [Required]
        public string RequestorAccountNumber { get; set; }

        [Required]
        public string Date { get; set; }

        [Required]
        public string ReadyByTime { get; set; }

        [Required]
        public string CloseTime { get; set; }

        [Required]
        public string Weight { get; set; }

        [Required]
        public string WeightUnit { get; set; }

        [Required]
        public string AWBNumber { get; set; }

        [Required]
        public List<Parcel> Parcels { get; set; }
    }

    public class Response
    {
        public string RequesterID { get; set; }
        public string RequestID { get; set; }
        public string ConfirmationNumber { get; set; }
        public PackagePickup PackagePickup { get; set; }
        public string OriginSvcArea { get; set; }
        public string Status { get; set; }
        public string ErrorMessage { get; set; }
        public string PickupStatus { get; set; }
    }

    public class PackagePickup
    {
        public string DayOfWeek { get; set; }
        public string Date { get; set; }
        public string CarrierRoute { get; set; }
    }

    public class Address
    {
        public string Department { get; set; }

        public string FirstName { get; set; }

        public string MiddleName { get; set; }

        public string LastName { get; set; }

        public string NamePrefix { get; set; }

        public string NamePostfix { get; set; }

        public string Name
        {
            get
            {
                return Regex.Replace(
                    string.Format("{0} {1} {2} {3} {4}", this.NamePrefix, this.FirstName, this.MiddleName, this.LastName, this.NamePostfix),
                    @"\s+", " ").Trim();
            }
        }

        public string Phone { get; set; }

        public string EMail { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string City { get; set; }

        public string PostalCode { get; set; }

        public string DivisionName { get; set; }

        public string DivisionCode { get; set; }

        public string CountryName { get; set; }

        public string CountryCode { get; set; }

        public string Division
        {
            get
            {
                return this.DivisionCode ?? this.DivisionName;
            }
        }

        public string State { get; set; }

        public bool IsResidential { get; set; }

        public bool IsRemoteArea { get; set; }

        public string LocationType { get; set; }

        public string PackageLocation { get; set; }
    }

    public class Parcel
    {
        public string NumberOfPieces { get; set; }//Quantity for UPS
        public string Weight { get; set; }
        public string WeightUnit { get; set; }
        public string Width { get; set; }
        public string Length { get; set; }
        public string Height { get; set; }
        public string Depth { get; set; }
    }
}