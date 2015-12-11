using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Utility
{
    internal static class Global
    {
        public static string UserID { get; set; } = "4";

        public static string AccountID { get; set; } = "2504051";
        public static string VendorAccountID { get; set; } = "1";
        public static string RatePickupIndicator { get; set; } = "Y";
        public static string AccountNumber { get; set; } = "0412E6";
        public static string AccountType { get; set; } = "D";
        public static string PackageLocation { get; set; } = "Front Door";
        public static string LocationType { get; set; } = "B";
        public static string RequestID { get; set; } = "12345";
        public static string RequesterID { get; set; } = "2504051";
        public static string PassPhrase { get; set; } = "P@ssw0rd";
        public static string MailClass { get; set; } = "Priority";
        public static string PartnerTransactionID { get; set; } = "6789EFGH";
        public static string Test { get; set; } = "YES";
        public static string ImageFormat { get; set; } = "PDF";
        public static string LabelSize { get; set; } = "4X6";
        public static string LabelType { get; set; } = "Default";

        public static string ShippingPaymentAccount { get; set; } = "803921577";
        public static string DutyTaxPaymentAccount { get; set; } = "803921577";
        public static string LanguageCode { get; set; } = "en";
        public static string PiecesEnabled { get; set; } = "Y";
        public static string WeightUnit { get; set; } = "L";
        public static string GlobalProductCode { get; set; } = "P";
        public static string DimensionUnit { get; set; } = "I";
        public static string CurrencyCode { get; set; } = "USD";

        public static string ShipperID { get; set; } = "803921577";

        public static string UseAddressOnFile { get; set; } = "NO";

        public static int ExpressMailCount { get; set; } = 0;
        public static int PriorityMailCount { get; set; } = 0;
        public static int ReturnsCount { get; set; } = 0;
        public static int InternationalCount { get; set; } = 1;
        public static int OtherPackagesCount { get; set; } = 1;
        public static double EstimatedWeightLb { get; set; } = 2.3f;

        public static string RegionCode { get; set; } = "AM";
        public static string AWBNumber { get; set; } = "7520067111";

        public static string Weight { get; set; } = "35";

        public static string CompanyName { get; set; } = "Company Name";
        public static Admin.UI.Utility.Enumerations.ContainerCode ContainerCode { get; set; } = Admin.UI.Utility.Enumerations.ContainerCode.PACKAGE;
        public static string ServiceCode { get; set; } = "001";

        public static string AccessLicenseNumber { get; set; } = "DCF8389DE7FC9D06";
        public static string Username { get; set; } = "frank@k3pl.com";
        public static string Password { get; set; } = "Aa123456";

        public static string ShipmentChargeType { get; set; } = "01";
        public static string ShipmentServiceType { get; set; } = "01";
        public static string ShipmentPackageType { get; set; } = "02";
        public static string ShipmentrequestOption { get; set; } = "nonvalidate";
		public static string AccessToken { get; set; }

    }
}