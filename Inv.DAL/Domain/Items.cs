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
    
    public partial class Items
    {
        public int ItemID { get; set; }
        public Nullable<int> CompCode { get; set; }
        public string codeType { get; set; }
        public string parentCode { get; set; }
        public string itemCode { get; set; }
        public string codeName { get; set; }
        public string codeNameAr { get; set; }
        public Nullable<System.DateTime> activeFrom { get; set; }
        public Nullable<System.DateTime> activeTo { get; set; }
        public string description { get; set; }
        public string UnitCode { get; set; }
        public Nullable<int> StatusCode { get; set; }
    }
}