using System;

namespace Inv.API.CustomModel
{
    [Serializable]
    public class items
    {
        public string codeType { get; set; }
        public string parentCode { get; set; }
        public string itemCode { get; set; }
        public string codeName { get; set; }
        public string codeNameAr { get; set; }
        public Nullable<System.DateTime> activeFrom { get; set; }
        public Nullable<System.DateTime> activeTo { get; set; }
        public string description { get; set; }
     }
}
