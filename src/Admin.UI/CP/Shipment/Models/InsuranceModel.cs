using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.CP.Shipment.Models
{
    public class InsuranceModel
    {
        public long VendorSettingId { get; set; }

        [Range(0.01, 999999999, ErrorMessage = "Amount must be greater than 0.00")]
        public decimal InsuredAmount { get; set; }

        public DateTime Created { get; set; }
    }
}