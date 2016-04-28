using Microsoft.AspNet.Mvc.Rendering;
using ShipOS.Utility.Common.Enumerations;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Pickup.Models
{
    public class PickupRequestModel
    {
        //Account Details
        public Guid DomainKey { get; set; }

        public string SessionKey { get; set; }
        public long UserId { get; set; }
        public long AccountId { get; set; }
        public long Agent { get; set; }
        public long VendorSettingId { get; set; }

        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage = "E-mail is not valid")]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Display(Name = "Contact Name")]
        public string ContactName { get; set; }

        [Display(Name = "Company Name")]
        public string CompanyName { get; set; }

        [Display(Name = "Address Caption")]
        public string AddressCaption { get; set; }

        [Required]
        [Display(Name = "Phone")]
        [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Phone number format should be xxx-xxx-xxxx")]
        public string Phone { get; set; }

        [Display(Name = "Ext")]
        public string PhoneExtension { get; set; }

        [Required]
        [Display(Name = "Address ")]
        public string Address1 { get; set; }

        [Display(Name = "Address 2")]
        public string Address2 { get; set; }

        [Display(Name = "Address 3")]
        public string Address3 { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string State { get; set; }

        [Required]
        [Display(Name = "Postal Code")]
        [RegularExpression(@"(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXYabceghjklmnprstvxy]{1}\d{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstv‌​xy]{1} *\d{1}[ABCEGHJKLMNPRSTVWXYZabceghjklmnprstvxy]{1}\d{1}$)", ErrorMessage = "That postal code is not a valid US or Canadian postal code.")]
        public string PostalCode { get; set; }

        //Pickup
        [Required]
        [Display(Name = "Pickup From")]
        public string PickupFrom { get; set; }

        [Required]
        [Display(Name = "Pickup Date")]
        [DefaultValue(typeof(DateTime))]
        public DateTime PickupDate { get; set; }

        //[Required, NestedValidateObject]
        //public List<Parcel> Parcels { get; set; }

        [Required]
        public string ReadyTime { get; set; }

        public string AvailableUntil { get; set; }

        [Required]
        public bool IsResidential { get; set; }

        public string Destination { get; set; }
        public string Instructions { get; set; }
        public string Notifications { get; set; }
        public string ConfirmationNumber { get; set; }

        public List<Parcel> Parcels { get; set; }
    }

    public class Parcel
    {
        public string Contents { get; set; }
        public string Reference { get; set; }

        //Dimensions and width

        public ParcelType PackageType { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(0.5, 9999, ErrorMessage = "< 0.5 inches")]
        public decimal Height { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(0.5, 9999, ErrorMessage = "Weight must be greater than 0.00")]
        public decimal Weight { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(0.5, 9999, ErrorMessage = "< 0.5 inches")]
        public decimal Width { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(0.5, 9999, ErrorMessage = "< 0.5 inches")]
        public decimal Length { get; set; }

        [Required(ErrorMessage = "Required")]
        [Range(1, int.MaxValue, ErrorMessage = "At least one")]
        public short ItemCount { get; set; }

        public bool IsLarge { get; set; }
        public bool IsIregularShape { get; set; }
        public bool IsDocument { get; set; }

        //Quantity for UPS
    }
}