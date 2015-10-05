using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.User.Models
{
    public class Address
    {
        public long Id { get; set; }

        public long AccountId { get; set; }

        public AddressTypes AddressType { get; set; }

        public string ShortName { get; set; }

        public string Company { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Phone1 { get; set; }

        public string Phone2 { get; set; }

        public string Fax { get; set; }

        public string EMail { get; set; }

        public string CountryId { get; set; }

        public string PostalCode { get; set; }

        public string Division { get; set; }

        public string City { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string Detail { get; set; }

        public DateTime Created { get; set; }

        public sbyte Status { get; set; }

        public enum AddressTypes
        {
            Sender = 1,
            Recipient = -1
        }
    }
}
