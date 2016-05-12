using ShipOS.Utility.Common.Enumerations;

using System.Collections.Generic;

namespace Admin.UI.CP.Pickup.Models
{
    public class PickupResponseModel
    {
        public string ConfirmationNumber { get; set; }
        public List<ErrorModel> ErrorMessage { get; set; }
        public string SuccessMessage { get; set; }
        public decimal TotalPrice { get; set; }
        public Status.APIRequestStatus Status { get; set; }
    }

    public class ErrorModel
    {
        public string Code { get; set; }
        public string Description { get; set; }
    }
}