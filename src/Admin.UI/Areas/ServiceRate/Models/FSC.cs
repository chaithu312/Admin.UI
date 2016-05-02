using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.ServiceRate.Models
{
    public class FSC
    {
		public int Id { get; set; }
		public string Service { get; set; }
		public string FSCValue { get; set; }
		public string EffectiveDate { get; set; }
		public string Created { get; set; }
	}
}
