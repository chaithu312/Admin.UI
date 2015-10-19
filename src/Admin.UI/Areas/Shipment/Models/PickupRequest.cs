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
    
    public class Response
    {
        public string RequesterID { get; set; }
        public string RequestID { get; set; }
        public string ConfirmationNumber { get; set; }
        public PackagePickup PackagePickup { get; set; }
        public string OriginSvcArea { get; set; }
        public string ErrorMessage { get; set; }
        public string PickupStatus { get; set; }
        public string Status { get; set; }
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
    public class ServiceHeader
    {
        public string MessageTime { get; set; }
        public string MessageReference { get; set; }
        public string SiteID { get; set; }
    }

    public class Condition
    {
        public string ConditionCode { get; set; }
        public string ConditionData { get; set; }
    }

    public class Status
    {
        public string ActionStatus { get; set; }
        public Condition Condition { get; set; }
    }


    public class ResponseMessage
    {
        public string res { get; set; }
        public string xsi { get; set; }
        public string schemaLocation { get; set; }
        public ErrorRespnse Response { get; set; }
    }

    public class ErrorRespnse
    {
        public ServiceHeader ServiceHeader { get; set; }
        public Status Status { get; set; }
    }
    public class ViewPickup
    {
        public string Id { get; set; }
        public string Detail { get; set; }
        public string Confirmation { get; set; }
        public string Destination { get; set; }
        public string Status { get; set; }
        public string Created { get; set; }
    }
}