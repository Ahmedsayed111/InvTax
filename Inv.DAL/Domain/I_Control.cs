//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Inv.DAL.Domain
{
    using System;
    using System.Collections.Generic;
    
    public partial class I_Control
    {
        public int CompCode { get; set; }
        public Nullable<int> DefSlsVatType { get; set; }
        public Nullable<int> DefPurVatType { get; set; }
        public Nullable<bool> IsVat { get; set; }
        public Nullable<int> MobileLength { get; set; }
        public Nullable<int> IDLength { get; set; }
        public Nullable<bool> SendSMS { get; set; }
        public Nullable<bool> SendPublicSMS { get; set; }
        public Nullable<int> NotePeriodinSec { get; set; }
        public Nullable<int> DashBoardPeriodinSec { get; set; }
        public Nullable<int> MaxYearlyMSGs { get; set; }
        public Nullable<int> UsedMSGs { get; set; }
        public Nullable<int> UserTimeZoneUTCDiff { get; set; }
        public Nullable<int> ServerTimeZoneUTCDiff { get; set; }
        public Nullable<int> SaudiNationID { get; set; }
        public Nullable<bool> WebCustomerWebsite { get; set; }
        public Nullable<System.DateTime> MembeshiptStartDate { get; set; }
        public Nullable<System.DateTime> MembeshipEndDate { get; set; }
        public Nullable<int> MembershipAllanceDays { get; set; }
        public Nullable<int> MembershipreadOnlyDays { get; set; }
        public Nullable<bool> IsFreePurchaseReturn { get; set; }
        public Nullable<bool> IsFreeSalesReturn { get; set; }
        public string ExceedMinPricePassword { get; set; }
        public Nullable<int> SysTimeOut { get; set; }
        public Nullable<int> NationalityID { get; set; }
        public Nullable<int> Currencyid { get; set; }
        public string DocPDFFolder { get; set; }
        public string ClientID { get; set; }
        public string ClientSecret { get; set; }
    }
}
