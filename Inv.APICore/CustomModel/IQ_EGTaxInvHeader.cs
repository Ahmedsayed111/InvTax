using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inv.APICore
{
    class IQ_EGTaxInvHeader
    {
        public int sub_Bra_code { get; set; }
        public string sub_Bra_Name { get; set; }
        public string Sub_Country { get; set; }
        public string sub_governate { get; set; }
        public string Sub_City { get; set; }
        public string Sub_Street { get; set; }
        public string sub_BuildingNo { get; set; }
        public string sub_PostalCode { get; set; }
        public string sub_Floor { get; set; }
        public string sub__Room { get; set; }
        public string sub_LandMarks { get; set; }
        public string sub_AdditionalInfo { get; set; }
        public string sub_Type { get; set; }
        public string sub_VatNo { get; set; }
        public string sub_Name { get; set; }
        public string Cus_Country { get; set; }
        public string Cus_governate { get; set; }
        public string Cus_City { get; set; }
        public string Cus_Street { get; set; }
        public string Cus_BuildingNo { get; set; }
        public string Cus_PostalCode { get; set; }
        public string Cus_Floor { get; set; }
        public string Cus__Room { get; set; }
        public string Cus_LandMarks { get; set; }
        public string Cus_AdditionalInfo { get; set; }
        public string Cus_VatNo { get; set; }
        public string Cus_Name { get; set; }
        public string Cus_Type { get; set; }
        public string Sub_ActivityCode { get; set; }
        public Nullable<decimal> AllowAfterVat { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public string PurchaseorderNo { get; set; }
        public string purchaseorderDesc { get; set; }
        public int SalesOrderRef { get; set; }
        public string SalesORderDesc { get; set; }
        public string perofrmainvoiceno { get; set; }
        public Nullable<decimal> ItemDiscountTotal { get; set; }
        public Nullable<decimal> ItemTotal { get; set; }
        public Nullable<decimal> hd_NetAmount { get; set; }
        public Nullable<decimal> hd_TaxTotal { get; set; }
        public string TaxType { get; set; }
        public Nullable<decimal> hd_TotalAmount { get; set; }
        public Nullable<decimal> RoundingAmount { get; set; }
        public int InvoiceID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public string inv_Type { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public Nullable<System.TimeSpan> TrTime { get; set; }
        public string cus_IDNo { get; set; }
        public string cus_passportNo { get; set; }
        public string DocUUID { get; set; }
        public int Status { get; set; }
        public string ClientIDProd { get; set; }
        public string SecretIDProd { get; set; }


        
        
    }
}
