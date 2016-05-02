using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Shipment.Models
{
    public class Address
    {
        [Required]
        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        [Required]
        public string City { get; set; }

        public string DivisionCode { get; set; }
        public string DivisionName { get; set; }

        [Required]
        public string CountryCode { get; set; }

        public string CountryName { get; set; }
        public string PostalCode { get; set; }

        public string CompanyName { get; set; }
        public string ContactName { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        public string MiddleName { get; set; }
        public string NamePostfix { get; set; }
        public string NamePrefix { get; set; }

        public bool IsRemoteArea { get; set; }
        public bool IsResidential { get; set; }

        [Required]
        [EmailAddress]
        public string EMail { get; set; }

        public string Fax { get; set; }

        [Required]
        public string Phone { get; set; }

        public string PhoneExtension { get; set; }

        [Required]
        public string Mobile { get; set; }
    }
}