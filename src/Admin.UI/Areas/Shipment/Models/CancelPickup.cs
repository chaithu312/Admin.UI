using Admin.UI.Areas.User.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Shipment.Models
{
    public class CancelPickup
    {
        [Required]
        public string CancelReason { get; set; }

        [Required]
        public string ConfirmationNumber { get; set; }

		[Required]
		public string RequesterID { get; set; }

		[Required]
		public string RequestID { get; set; }

		[Required]
		public string PickupAccountID { get; set; }

		[Required]
		public string UseAddressOnFile { get; set; }

		[Required]
		public string PassPhrase { get; set; }


		[Required]
        public string RegionCode { get; set; }

        [Required]
        public string CountryCode { get; set; }

        [Required]
        public string RequestorName { get; set; }

        [Required]
        public Address Address { get; set; }

    }
}