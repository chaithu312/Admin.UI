using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
    public class State
    {
		public long Id { get; set; }
		public string Country { get; set; }
		public string Name { get; set; }
		public string Code { get; set; }
		public string FIPS { get; set; }
		public string AdditionalDays { get; set; }
		public string TimeZone { get; set; }
		public string Status { get; set; }
	}
}
