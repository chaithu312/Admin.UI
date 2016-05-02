using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
	public class ZoneUS
	{
		public int Id { get; set; }
		public string OriginZipLower { get; set; }
		public string OriginZipUpper { get; set; }
		public string DestinationZipLower { get; set; }
		public string DestinationZipUpper { get; set; }
		public string Created { get; set; }
		public string Zone { get; set; }
	}
}
