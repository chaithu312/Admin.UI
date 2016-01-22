using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Freight.Models
{
    public class Signature
    {
		public long Id { get; set; }
		public string Caption { get; set; }
		public string SignatureText { get; set; }
		public string Created { get; set; }
	}
}
