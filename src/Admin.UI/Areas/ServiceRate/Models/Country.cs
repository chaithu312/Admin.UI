using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
    public class Country
    {
		public long Id { get; set; }
		public string Name { get; set; }
		public string ISOCode { get; set; }
		public string TopLevelDomain { get; set; }
		public string DialingCode { get; set; }
		public string Delivery { get; set; }
		public string Membership { get; set; }
		public string TimeZone { get; set; }
		public string Status { get; set; }
		public string SecurityCharge { get; set; }
	}
}
