using Admin.UI.Areas.User.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.Shipment.Models
{

	public class PickupData
	{
		public int Id { get; set; }
		public object DomainKey { get; set; }
		public object SessionKey { get; set; }
		public string UserId { get; set; }
		public string AccountId { get; set; }
		public string VendorSettingId { get; set; }
		public string Name { get; set; }
		public string Phone { get; set; }
		public object EMail { get; set; }
		public string Address1 { get; set; }
		public object Address2 { get; set; }
		public string Address3 { get; set; }
		public string City { get; set; }
		public string Division { get; set; }
		public string PostalCode { get; set; }
		public string CountryId { get; set; }
		public string PickupFrom { get; set; }
		public string ReadyTime { get; set; }
		public string AvailableUntil { get; set; }
		public int ParcelType { get; set; }
		public string TotalPieces { get; set; }
		public string Destination { get; set; }
		public object Instructions { get; set; }
		public string Notifications { get; set; }
		public string Confirmation { get; set; }
		public string Detail { get; set; }
		public RootObject ResponseDetail { get; set; }
		public PickupDetail PickupDetail { get; set; }
		public string Created { get; set; }
		public int Status { get; set; }
	}


	public class RootObject
	{
		public int Status { get; set; }
		public object ErrorMessage { get; set; }
		public string RequesterID { get; set; }
		public string RequestID { get; set; }
		public string ConfirmationNumber { get; set; }
		public PackagePickup PackagePickup { get; set; }
		public string PickupDetail { get; set; }
	}

	public class PickupDetail
	{
		public object AdditionalNotes { get; set; }
		public bool IsResidential { get; set; }
		public string Carrier { get; set; }
		public string PickupDate { get; set; }
	}


}