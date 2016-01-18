using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
    public class Discount
    {
		public string OriginZip { get; set; }
		public string DestinationZip { get; set; }
		public string GeneralDiscount { get; set; }
	}
}
