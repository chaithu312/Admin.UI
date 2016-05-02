using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Finance.Models
{
    public class Payment
    {
		public long Id { get; set; }
		public string AccountNo{ get; set; }
		public string CreditType { get; set; }
		public string MemoNumber { get; set; }
		public string Date { get; set; }
		public string Amount { get; set; }
		public string Notes { get; set; }
	}
}
