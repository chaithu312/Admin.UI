using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel;

namespace Admin.UI.Areas.Shipment.Models
{
    public class Shipments
    {
        public long Id { get; set; }
        public string UserId { get; set; }
        public string ShipmentId { get; set; }
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
        public string CountryCode { get; set; }
        public string CountryName { get; set; }

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
        public string RCountryCode { get; set; }
        public string RCountryName { get; set; }

        public string Notifications { get; set; }
        public string Unit { get; set; }
        public string Currency { get; set; }
        public string Detail { get; set; }
        public decimal Declared { get; set; }
        public bool Insurance { get; set; }

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
        public long Depth { get; set; } = 45;//TODO:
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

    public class Billing
    {
        public enum PaymentTypes
        {
            [Description("S")]
            Shipper,

            [Description("R")]
            Recipient,

            [Description("T")]
            ThirdParty_Other
        }

        public PaymentTypes ShippingPaymentType { get; set; }

        public string ShippingPaymentAccount { get; set; }

        public PaymentTypes DutyTaxPaymentType { get; set; }

        public string DutyTaxPaymentAccount { get; set; }
    }

    public class Dutiable
    {
        public string DeclaredValue { get; set; }

        public string DeclaredCurrency { get; set; }

        public string TermsOfTrade { get; set; }

        public string FilingType { get; set; }

        public string FTSR { get; set; }
    }

    public class Shipment
    {
        public Consignee Consignee { get; set; }
        public Shipper Shipper { get; set; }
        public string ShipperID { get; set; }
        public string ShipmentId { get; set; }

        public string RequesterID { get; set; }
        public string AccountID { get; set; }
        public string PassPhrase { get; set; }
        public string MailClass { get; set; }
        public string PartnerTransactionID { get; set; }
        public string LabelType { get; set; }
        public string LabelSize { get; set; }
        public string ImageFormat { get; set; }
        public string Test { get; set; }
        public Billing Billing { get; set; }
        public Dutiable Dutiable { get; set; }
        public Admin.UI.Utility.Enumerations.RegionCode RegionCode { get; set; }

        public string LanguageCode { get; set; }

        public string PiecesEnabled { get; set; }

        public string WeightUnit { get; set; }
        public string GlobalProductCode { get; set; }
        public string DimensionUnit { get; set; }
        public string CurrencyCode { get; set; }

        public DateTime ShipTimestamp { get; set; }
        public List<Parcel> Parcels { get; set; }
        public Shipment()
        {
            Consignee = new Consignee();
            Shipper = new Shipper();
            Billing = new Billing();
            Dutiable = new Dutiable();
        }
    }


    public class LabelImage
    {
        public string OutputFormat { get; set; }
        public string OutputImage { get; set; }
    }

    public class LabelImageResponse
    {
        public object RegionCode { get; set; }
        public object AirwayBillNumber { get; set; }
        public object ErrorMessage { get; set; }
        public int Status { get; set; }
        public object BillingCode { get; set; }
        public object CurrencyCode { get; set; }
        public object CourierMessage { get; set; }
        public object PackageCharge { get; set; }
        public object Rated { get; set; }
        public object ShippingCharge { get; set; }
        public object NegotiatedRateCharges { get; set; }
        public object WeightUnit { get; set; }
        public object ChargeableWeight { get; set; }
        public object DimensionalWeight { get; set; }
        public object CountryCode { get; set; }
        public object Barcodes { get; set; }
        public object CustomerID { get; set; }
        public object ShipmentDate { get; set; }
        public object GlobalProductCode { get; set; }
        public object NewShipper { get; set; }
        public object DHLRoutingCode { get; set; }
        public object DHLRoutingDataId { get; set; }
        public object ProductContentCode { get; set; }
        public object ProductShortName { get; set; }
        public object InternalServiceCode { get; set; }
        public string DeliveryDateCode { get; set; }
        public object DeliveryTimeCode { get; set; }
        public double FinalPostage { get; set; }
        public double CostCenter { get; set; }
        public string TrackingNumber { get; set; }
        public int TransactionID { get; set; }
        public object Pieces { get; set; }
        public LabelImage LabelImage { get; set; }
        public object PostagePrice { get; set; }
    }
}