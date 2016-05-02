using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Shipment.Models
{
    public class CollectionOnDelivery
    {
        [Range(0.01, 999999999, ErrorMessage = "Amount must be greater than 0.00")]
        public decimal Amount { get; set; }

        public byte CollectionType { get; set; }
        public string Company { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string EMail { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string Division { get; set; }
        public string PostalCode { get; set; }
        public int CountryId { get; set; }
    }
}