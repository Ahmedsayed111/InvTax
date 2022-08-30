using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APIETAX.CustomModel
{
    class IQ_EGTaxInvItems
    {
        public string DescA { get; set; }
        public string RefItemCode { get; set; }
        public string OldItemCode { get; set; }
        public string UomCode { get; set; }
        public Nullable<decimal> SoldQty { get; set; }
        public string ItemCode { get; set; }
        public Nullable<decimal> ItemTotal { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> SalesTotal { get; set; }
        public Nullable<decimal> diff { get; set; }
        public Nullable<decimal> TaxableFees { get; set; }
        public Nullable<decimal> NetTotal { get; set; }
        public Nullable<decimal> Unitprice { get; set; }
        public string CurrencyCode { get; set; }
        public Nullable<decimal> DiscountPrc { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public string TaxType { get; set; }
        public string TaxSubType { get; set; }
        public Nullable<decimal> VatPrc { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public int InvoiceItemID { get; set; }
        public Nullable<int> InvoiceID { get; set; }
        public Nullable<int> Serial { get; set; }

    }
}
