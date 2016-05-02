using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Utility.Enumerations
{
    public enum RegionCode
    {
        /// <remarks/>
        AP,

        /// <remarks/>
        EU,

        /// <remarks/>
        AM,
    }

    public enum AddressTypes : byte
    { Sender = 1, Recipient = 0 }

    public enum ContainerCode
    {
        PACKAGE = 01,
        UPSLETTER = 02,
        PALLET = 03
    }

    public enum Carrier
    {
        DHL = 1,
        Endicia,
        UPS
    }

    public enum Status : byte
    { Active = 1, DeActive = 0 }
}