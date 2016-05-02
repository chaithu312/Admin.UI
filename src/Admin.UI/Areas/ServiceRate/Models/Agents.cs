using Admin.UI.Utility.Enumerations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.User.Models
{
    public class Agents
    {
        public long Id { get; set; }

        public string CountryId { get; set; }

        public string AgentName { get; set; }

        public string LabelAPI { get; set; }

        public string PickupCharge { get; set; }

        public string SaturdayPickupCharge { get; set; }

        public string TrackingURL { get; set; }

    }
}