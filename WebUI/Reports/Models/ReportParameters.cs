using System;
using System.Collections.Generic;
//eslam 1 dec 2020
namespace Inv.WebUI.Reports.Models
{
    public class StdParamters
    {
        public string SystemCode { get; set; }
        public string SubSystemCode { get; set; }
        public string Modulecode { get; set; }
        public string UserCode { get; set; }
        public string CompCode { get; set; }
        public string BranchCode { get; set; }
        public string Language { get; set; }
        public string CurrentYear { get; set; }
        public string ScreenLanguage { get; set; }
        public string SystemName { get; set; }
        public string SubSystemName { get; set; }
        public string CompNameE { get; set; }
        public string CompNameA { get; set; }
        public string BranchName { get; set; }
        public string Tokenid { get; set; }
    }
    public class ReportParameters : StdParamters // eslam Adding base class 
    {

        public int DepartmentID { get; set; }
        public string UserCode { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
    public class RepAttend : StdParamters // mahroos Adding base class 
    {

        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string FromDt { get; set; }
        public string ToDt { get; set; }
        public int? SrvId { get; set; }
        public int? ShiftId { get; set; }
        public int Sex { get; set; }
        public int? PeriodId { get; set; }
        public int Type { get; set; }

        public int Shift { get; set; }
    }


    public class RepAttendAndResev : StdParamters // eslam Adding base class 
    {
        public int id1 { get; set; }
        public int id2 { get; set; }
        public int id3 { get; set; }
        public int id4 { get; set; }
        public int typ { get; set; }
        public bool ISQR { get; set; }
    }
    public class Reportparam : StdParamters // eslam Adding base class 
    {

        public bool ISQR { get; set; }
        public int TRId { get; set; }
        public int usr { get; set; }


    }
    public class Reporttransactionparam : StdParamters // eslam Adding base class 
    {

        public bool ISQR { get; set; }
        public int id { get; set; }
        public int id1 { get; set; }
        public int id2 { get; set; }
        public int id3 { get; set; }
        public int id4 { get; set; }
        public int Type { get; set; }
        public int ExpenseStatementID { get; set; }
        public string User_Code { get; set; }


    }

    public class RepExpensesDetails : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int CatId { get; set; }
        public int ExpID { get; set; }
        public int PeriodId { get; set; }
        public int PurchId { get; set; }
        public int Type { get; set; }

    }

    public class RepCollInPer : StdParamters // eslam Adding base class 
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int PeriodId { get; set; }
        public int Shift { get; set; }
        public string User { get; set; }
        public int cashType { get; set; }
        public int stat { get; set; }
        public string CompNameA { get; set; }
        public string CompNameE { get; set; }
        public int Type { get; set; }
    }

    public class RepStatement : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }

        public int MemId { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int PeriodId { get; set; }
        public int Type { get; set; }
        public int Shift { get; set; }

    }

    public class RepFinancialSituation : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int stat { get; set; }
        public int Shift { get; set; }
        public int PeriodId { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int Type { get; set; }
        // public string User { get; set; }
    }

    public class RepCurrentSubscribers : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int PeriodDays { get; set; }
        public int SrvId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int Shift { get; set; }
        public int PeriodId { get; set; }
        public int Type { get; set; }
    }

    public class RepAttendanceReport : StdParamters // mahroos Adding base class 
    {
        public int TRId { get; set; }
        public int CatId { get; set; }
        public int JobID { get; set; }
        public int NatId { get; set; }
        public int Empid { get; set; }
        public int EmpStat1 { get; set; }
        public int EmpStat2 { get; set; }
        public int EmpStat3 { get; set; }
        public int EmpStat5 { get; set; }
        public int Type { get; set; }

    }

    public class RepEmployeeReport : StdParamters // eslam Adding base class 
    {
        public int CatId { get; set; }
        public int JobID { get; set; }
        public int NatId { get; set; }
        public int EmpStat1 { get; set; }
        public int EmpStat2 { get; set; }
        public int EmpStat3 { get; set; }
        public int EmpStat5 { get; set; }
        public int Type { get; set; }

    }

    public class RepVatList : StdParamters // eslam Adding base class 
    {
        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int Type { get; set; }
        public int stat { get; set; }

    }
    public class RepFinServiceIncome : StdParamters // eslam Adding base class 
    {

        public DateTime FromDt { get; set; }
        public DateTime ToDt { get; set; }
        public int SrvCatId { get; set; }
        public int ShiftId { get; set; }
        public int Sex { get; set; }
        public int PeriodId { get; set; }
        public int Type { get; set; }

        public int Shift { get; set; }
    }
    public class Repcome : StdParamters // eslam Adding base class 
    {
        public int Type { get; set; }
        public int TRId { get; set; }
        public int Repdesign { get; set; }
        public int Typ { get; set; }
        public int slip { get; set; }
        public int stat { get; set; }
    }

    public class RepFinancials : StdParamters // Mona Adding  class 
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int BoxId { get; set; }
        public int RepType { get; set; }
        public int TrType { get; set; }
        public int RecType { get; set; }
        public string BnfID { get; set; }
        public string BnfDesc { get; set; }
        public int Status { get; set; }
        public int Repdesign { get; set; }
        public int TRId { get; set; }
        public int AdjDebit { get; set; }
        public int AdjId { get; set; }
        public int CustomerID { get; set; }
        public int VendorId { get; set; }
        public int SalesmanID { get; set; }
        public int CashType { get; set; }
        public int PaymentType { get; set; }
        public int CashBoxID { get; set; }
        public string MobileNo { get; set; }
        public int Typ { get; set; }
        public int Type { get; set; }
        public int CatId { get; set; }
        public int Groupid { get; set; }
        public int IsCredit { get; set; }
        public int BalStatus { get; set; }
        public int slip { get; set; }
        public int VendType { get; set; }
        public int check { get; set; }
        public int BalType { get; set; }
        public int ItemFamId { get; set; }
        public int ItemID { get; set; }
        public string cc_code { get; set; }
        public int exzero { get; set; }
        public int IsAuthVchr { get; set; }
        public int IsNewVchr { get; set; }
        public int Level { get; set; }
        public int AccCode { get; set; }
        public int OpenType { get; set; }
        public int PrdType { get; set; }
        public int EndType { get; set; }
        public int fromacc { get; set; }
        public int toacc { get; set; }
        public int @VchrSource { get; set; }
        public int VchrType { get; set; }
        public int storeID { get; set; }
        public int TfType { get; set; }
        public int FromstoreID { get; set; }
        public int ToStoreID { get; set; }
        public int FromBra { get; set; }
        public int ToBra { get; set; }
        public int src { get; set; }
        public int OperationId { get; set; }
        public int FromSls { get; set; }
        public int ToSls { get; set; }
        public int stat { get; set; }
        public int ISimport { get; set; }
        public bool checkedprint { get; set; }
        public int CustomercatID { get; set; }
        public int CustomerGrpID { get; set; }

        public string TransCode { get; set; }

        public int Vattype { get; set; }
        public string SysCode { get; set; }

        public int cusCatID { get; set; }
        public int cusGroupid { get; set; }
        public int cusid { get; set; }
        public int SLStype { get; set; }
        public string dtccCode { get; set; }
        public int VatBraCode { get; set; }
        public int vatyear { get; set; }
        public int prdcode { get; set; }
        public int SalesInvoiceNature { get; set; }
        public int Ispersonal { get; set; }
        public string DocPDFFolder { get; set; }

    }


    public class ServSlsInvoiceMasterDetailsprnt
    {
        public AVAT_TR_SlsInvoiceprnt AVAT_TR_SlsInvoiceprnt { get; set; }
        public List<AVAT_TR_SlsInvoiceItemprnt> AVAT_TR_SlsInvoiceItemprnt { get; set; }

    }
    public partial class AVAT_TR_SlsInvoiceprnt
    {
        public int InvoiceID { get; set; }
        public Nullable<int> TrNo { get; set; }
        public string RefNO { get; set; }
        public Nullable<int> RefTrID { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public string TrDateH { get; set; }
        public Nullable<int> TrType { get; set; }
        public Nullable<bool> IsCash { get; set; }
        public Nullable<int> SlsInvType { get; set; }
        public Nullable<int> SlsInvSrc { get; set; }
        public Nullable<int> CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerMobileNo { get; set; }
        public Nullable<int> SalesmanId { get; set; }
        public Nullable<decimal> TotalAmount { get; set; }
        public Nullable<decimal> VatAmount { get; set; }
        public Nullable<int> VatType { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public Nullable<decimal> DiscountPrc { get; set; }
        public Nullable<decimal> NetAfterVat { get; set; }
        public Nullable<decimal> CashAmount { get; set; }
        public Nullable<decimal> CardAmount { get; set; }
        public Nullable<decimal> BankTfAmount { get; set; }
        public string BankAccount { get; set; }
        public Nullable<decimal> TotalPaidAmount { get; set; }
        public Nullable<decimal> RemainAmount { get; set; }
        public string Remark { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<bool> IsPosted { get; set; }
        public Nullable<int> VoucherNo { get; set; }
        public Nullable<byte> VoucherType { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<int> CompCode { get; set; }
        public Nullable<int> BranchCode { get; set; }
        public string DocNo { get; set; }
        public string DocUUID { get; set; }
        public Nullable<System.TimeSpan> TrTime { get; set; }
        public Nullable<int> InvoiceTypeCode { get; set; }
        public Nullable<int> InvoiceTransCode { get; set; }
        public string TaxNotes { get; set; }
        public Nullable<int> TaxCurrencyID { get; set; }
        public Nullable<int> InvoiceCurrenyID { get; set; }
        public string ContractNo { get; set; }
        public string PurchaseorderNo { get; set; }
        public Nullable<int> GlobalInvoiceCounter { get; set; }
        public string PrevInvoiceHash { get; set; }
        public string QRCode { get; set; }
        public string CryptographicStamp { get; set; }
        public Nullable<System.DateTime> DeliveryDate { get; set; }
        public Nullable<System.DateTime> DeliveryEndDate { get; set; }
        public Nullable<int> PaymentMeansTypeCode { get; set; }
        public Nullable<int> CRDBReasoncode { get; set; }
        public string PaymentTerms { get; set; }
        public Nullable<int> PaymentTermsID { get; set; }
        public Nullable<decimal> AllowAmount { get; set; }
        public Nullable<decimal> AllowPrc { get; set; }
        public Nullable<decimal> AllowBase { get; set; }
        public Nullable<int> AllowVatNatID { get; set; }
        public Nullable<decimal> AllowVatPrc { get; set; }
        public Nullable<decimal> AllowAfterVat { get; set; }
        public string AllowReason { get; set; }
        public Nullable<int> AllowCode { get; set; }
        public Nullable<decimal> ChargeAmount { get; set; }
        public Nullable<decimal> ChargePrc { get; set; }
        public Nullable<decimal> ChargeBase { get; set; }
        public Nullable<int> ChargeVatNatID { get; set; }
        public Nullable<decimal> ChargeVatPrc { get; set; }
        public Nullable<decimal> ChargeAfterVat { get; set; }
        public string ChargeReason { get; set; }
        public Nullable<int> ChargeCode { get; set; }
        public Nullable<decimal> ItemTotal { get; set; }
        public Nullable<decimal> ItemAllowTotal { get; set; }
        public Nullable<decimal> ItemDiscountTotal { get; set; }
        public Nullable<decimal> ItemVatTotal { get; set; }
        public Nullable<decimal> RoundingAmount { get; set; }
        public string WorkOrderNo { get; set; }
        public string WorkOrderType { get; set; }
        public string CompNameA { get; set; }
        public string CompNameE { get; set; }
        public string BraNameA { get; set; }
        public string BraNameE { get; set; }
        public string Address_BuildingNo { get; set; }
        public string Address_District { get; set; }
        public string Address_City { get; set; }
        public string Address_Street { get; set; }
        public string Address_Str_Additional { get; set; }
        public string Address_postal { get; set; }
        public string Address_Province { get; set; }
        public string VatNo { get; set; }
        public string Address_Build_Additional { get; set; }
        public string AddIDAr { get; set; }
        public string Cus_RefCode { get; set; }
        public string Cus_VndCode { get; set; }
        public string it_itemCode { get; set; }
        public string it_DescA { get; set; }
        public string NAMEA { get; set; }
        public string NAMEE { get; set; }
        public string BRA_DESC { get; set; }
        public string BRA_DESCL { get; set; }
        public string BR_Address_BuildingNo { get; set; }
        public string Br_Address_Street { get; set; }
        public string br_Address_Str_Additional { get; set; }
        public string br_Address_Build_Additional { get; set; }
        public string br_Address_City { get; set; }
        public string br_Address_Postal { get; set; }
        public string br_Address_Province { get; set; }
        public string br_Address_District { get; set; }
        public string br_VatNo { get; set; }
        public string Remarks { get; set; }
        public Nullable<decimal> AllowancePrc { get; set; }













    }
    public partial class AVAT_TR_SlsInvoiceItemprnt
    {
        public int InvoiceItemID { get; set; }
        public Nullable<int> InvoiceID { get; set; }
        public Nullable<int> ItemID { get; set; }
        public Nullable<int> UomID { get; set; }
        public Nullable<decimal> InvoiceSoldQty { get; set; }
        public Nullable<decimal> SoldQty { get; set; }
        public Nullable<decimal> Unitprice { get; set; }
        public Nullable<decimal> DiscountPrc { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public Nullable<decimal> NetUnitPrice { get; set; }
        public Nullable<decimal> ItemTotaldet { get; set; }
        public Nullable<decimal> VatPrc { get; set; }
        public Nullable<decimal> VatAmountdet { get; set; }
        public Nullable<decimal> NetAfterVat { get; set; }
        public Nullable<int> VatApplied { get; set; }
        public Nullable<decimal> TotRetQty { get; set; }
        public Nullable<int> Serial { get; set; }
        public Nullable<decimal> AllowAmount { get; set; }
        public Nullable<decimal> AllowancePrc { get; set; }
        public Nullable<decimal> AllowanceBase { get; set; }
        public string AllowReason { get; set; }
        public Nullable<int> AllowCode { get; set; }
        public Nullable<decimal> BaseQty { get; set; }
        public Nullable<int> BaseQtyUomid { get; set; }
        public Nullable<decimal> BaseQtyPrice { get; set; }
        public Nullable<decimal> BaseQtyDiscount { get; set; }
        public Nullable<decimal> DiscountPrcBase { get; set; }
        public Nullable<int> DiscountVatNatID { get; set; }
        public string Discountreason { get; set; }
        public Nullable<int> DiscountCode { get; set; }
        public Nullable<decimal> ItemNetAmount { get; set; }
        public Nullable<decimal> ChargeAmount { get; set; }
        public Nullable<decimal> ChargePrc { get; set; }
        public Nullable<decimal> ChargeBase { get; set; }
        public Nullable<int> ChargeVatNatID { get; set; }
        public Nullable<decimal> ChargeVatPrc { get; set; }
        public Nullable<decimal> ChargeAfterVat { get; set; }
        public string ChargeReason { get; set; }
        public Nullable<int> ChargeCode { get; set; }
        public Nullable<int> VatNatID { get; set; }
        public string CC_CODE { get; set; }
        public string Remarks { get; set; }
        public string ServiceCode { get; set; }
        public string ServiceName { get; set; }
        public string CostCntrName { get; set; }

    }

}