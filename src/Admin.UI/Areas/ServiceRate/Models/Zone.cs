using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
    public class Zone
    {
		public long Id { get; set; }
		public string Service { get; set; }
		public string OriginCountry { get; set; }
		public string DestinationCountry { get; set; }
		public string ZoneUS { get; set; }
		public string TransitTime { get; set; }
	}
}
