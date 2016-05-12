using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Shipment.Models
{
    public class Address
    {
        [Required(ErrorMessage = "Address is Required")]
        [Display(Name = "Address")]
        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        [Required(ErrorMessage = "City is Required")]
        public string City { get; set; }

        [Display(Name = "Division Code")]
        public string DivisionCode { get; set; }

        [Display(Name = "Division Name")]
        public string DivisionName { get; set; }

        [Required(ErrorMessage = "Country is Required")]
        [Display(Name = "Country Code")]
        public string CountryCode { get; set; }

        [Display(Name = "Country Name")]
        public string CountryName { get; set; }

        [Required(ErrorMessage = "Postal Code is Required")]
        [Display(Name = "Postal Code")]
        public string PostalCode { get; set; }

        [Display(Name = "Company Name")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Name is Required")]
        [Display(Name = "Contact Name")]
        public string ContactName { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string MiddleName { get; set; }
        public string NamePostfix { get; set; }
        public string NamePrefix { get; set; }

        public bool IsRemoteArea { get; set; }
        public bool IsResidential { get; set; }

        [Required(ErrorMessage = "Email is Required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address")]
        public string Email { get; set; }

        public string Fax { get; set; }

        [Required(ErrorMessage = "Phone is Required")]
        public string Phone { get; set; }

        public string PhoneExtension { get; set; }

        public string Mobile { get; set; }
    }
}