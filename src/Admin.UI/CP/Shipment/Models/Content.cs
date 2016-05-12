using System.ComponentModel.DataAnnotations;

namespace Admin.UI.CP.Shipment.Models
{
    public class Content
    {
        [Required]
        public string Code { get; set; }
        public string Description { get; set; }
        public int CountryOfOrigin { get; set; }
        public int Quantity { get; set; }
        public int Unit { get; set; }

        [Required]
        public decimal UnitValue { get; set; }
    }
}