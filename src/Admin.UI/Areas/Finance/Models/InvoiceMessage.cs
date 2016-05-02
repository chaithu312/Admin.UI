using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Finance.Models
{
    public class InvoiceMessage
	{
		public long Id { get; set; }
		public string AccountNo { get; set; }
		public string MessageTitle { get; set; }
		public string MessageBody { get; set; }
		public string EffectiveFrom { get; set; }
		public string EffectiveTo { get; set; }
		public string Status { get; set; }
		public string Created { get; set; }
	}
}
