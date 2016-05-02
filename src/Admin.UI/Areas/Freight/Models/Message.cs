using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Freight.Models
{
    public class Message
    {
		public long Id { get; set; }
		public string Description { get; set; }
		public string MessageText { get; set; }
		public string Created { get; set; }
	}
}
