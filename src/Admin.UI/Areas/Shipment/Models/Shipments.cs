using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Shipment.Models
{
    public class Shipments
    {
        public long Id { get; set; }
        public string UserId { get; set; }
        public string SessionKey { get; set; }
        public string VendorSettingId { get; set; }
        public string AccountId { get; set; }
        public string PickupId { get; set; }

        public string shipmentdate { get; set; }
        public string TrackingNumber { get; set; }

        public string Address { get; set; }
        public string Company { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string AddressType { get; set; }
        public string AddressCaption { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string Division { get; set; }
        public string DivisionName { get; set; }
        public string PostalCode { get; set; }
        public string CountryId { get; set; }

        public string RCompany { get; set; }
        public string Rname { get; set; }
        public string Rphone { get; set; }
        public string REmail { get; set; }
        public string RAddressType { get; set; }
        public string RaddressCaption { get; set; }
        public string Raddressline1 { get; set; }
        public string Raddressline2 { get; set; }
        public string Raddressline3 { get; set; }
        public string Rcity { get; set; }
        public string RDivision { get; set; }
        public string RDivisionName { get; set; }
        public string Rpostalcode { get; set; }
        public string RCountryId { get; set; }

        public string Notifications { get; set; }
        public string Unit { get; set; }
        public string Currency { get; set; }
        public string Detail { get; set; }
        public decimal Declared { get; set; }

        public string weight { get; set; }
        public string Length { get; set; }
        public string width { get; set; }
        public string Height { get; set; }
        public List<Parcel> Parcel { get; set; }
        public DateTime Created { get; set; }
    }

    public class Parcel
    {
        public List<items> items { get; set; }
    }

    public class items
    {
        public decimal Weight { get; set; }
        public long Width { get; set; }
        public long Height { get; set; }
        public long Length { get; set; }
        public string Detail { get; set; }
    }


    public class Consignee
    {
        public string Department { get; set; }
        public string FirstName { get; set; }
        public object MiddleName { get; set; }
        public string LastName { get; set; }
        public object NamePrefix { get; set; }
        public object NamePostfix { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string EMail { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public object Division { get; set; }
        public string State { get; set; }
        public bool IsResidential { get; set; }
        public bool IsRemoteArea { get; set; }
        public string LocationType { get; set; }
        public string PackageLocation { get; set; }
    }

    public class Shipper
    {
        public object Department { get; set; }
        public string FirstName { get; set; }
        public object MiddleName { get; set; }
        public string LastName { get; set; }
        public object NamePrefix { get; set; }
        public object NamePostfix { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string EMail { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string CountryName { get; set; }
        public string CountryCode { get; set; }
        public object Division { get; set; }
        public string State { get; set; }
        public bool IsResidential { get; set; }
        public bool IsRemoteArea { get; set; }
        public string LocationType { get; set; }
        public string PackageLocation { get; set; }
    }
    public class Shipment
    {
        public Consignee Consignee { get; set; }
        public Shipper Shipper { get; set; }

        public Shipment()
        {
            Consignee = new Consignee();
            Shipper = new Shipper();
        }
    }

}