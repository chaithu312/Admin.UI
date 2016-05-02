using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Freight.Models
{
    public class FreightRequests
    {
		public long Id { get; set; }
		public string Service { get; set; }
		public string TrackingNumber { get; set; }
		public string CompanyName { get; set; }
		public string ContactName { get; set; }
		public string Phone { get; set; }
		public string Fax { get; set; }
		public string Email { get; set; }
		public string ShipmentDate { get; set; }
		public string ContactMethod { get; set; }
		public string ProcessedType { get; set; }
		public string ProcessedBy { get; set; }
		public string ProcessedDetail { get; set; }
	}
}
