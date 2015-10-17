using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Shipment.Models
{
    public class VendorSetting
    {
        public long Id { get; set; }
        public string DomainKey { get; set; }
        public long AccountId { get; set; }
        public long VendorId { get; set; }
        
        public string Detail { get; set; }
        public string Effective { get; set; }
        public string Expiration { get; set; }
        public string Status { get; set; }
        public DateTime Created { get; set; }

        public string Name { get; set; }
        public VendorType VendorType { get; set; }
        public string DHLAcc { get; set; }
        public string EndiciaAcc { get; set; }
        public string FedexAcc { get; set; }
        public string FedexMeter { get; set; }
        public string FedexPayAcc { get; set; }
        public string UPSLicenseNo { get; set; }
        public string UPSUserName { get; set; }
        public string UPSpassword { get; set; }
        public string UPSAcc { get; set; }
    }

    public enum VendorType : sbyte
    {
        DHL=1,
        Endicia,
        FedEx,
        UPS
    }
}
