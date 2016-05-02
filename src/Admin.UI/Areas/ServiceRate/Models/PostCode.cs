using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
	public class PostCode
	{
		public long Id { get; set; }

		public string Country { get; set; }

		public string State { get; set; }

		public string PostalCode { get; set; }

		public string Class { get; set; }

		public string CityName { get; set; }

		public string CityType { get; set; }

		public string CountryName { get; set; }

		public string CountryFIPS { get; set; }

		public string AreaCode { get; set; }

		public string TimeZone { get; set; }

		public bool DaylightSavingsTime { get; set; }

		public string Latitude { get; set; }

		public string Longitude { get; set; }

		public string AdditionalDays { get; set; }

		public string EarliestDeliveryTime { get; set; }

		public string LastPickupOrder { get; set; }

		public string LastPickup { get; set; }

		public bool SaturdayDelivery { get; set; }

		public bool Pickup { get; set; }

		public bool Delivery { get; set; }

		public string Status { get; set; }
	}
}
