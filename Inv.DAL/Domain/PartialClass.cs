using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inv.DAL.Domain
{
    public class UpdateFlagClass
    {
        public char StatusFlag { get; set; }
    }
    public class SecurityClass
    {
        public string UserCode { get; set; }
        public string Token { get; set; }
    }

  
    public class SecurityandUpdateFlagClass
    {
        public char StatusFlag { get; set; }
        public string UserCode { get; set; }
        public string Token { get; set; }
    }
    public class SecurityandUpdateFlagClass_FIN_YEAR
    {
        public char StatusFlag { get; set; }
        public string UserCode { get; set; }
        public string Token { get; set; }
        public int FIN_YEAR { get; set; }
    }

    public class SecurityClass_G_USERS
    {
        public string UserCode { get; set; }
        public string Token { get; set; }
        public string Flag_Mastr { get; set; }

    }
    public class SecurityandUpdateFlagClass_serial
    {
        public char StatusFlag { get; set; }
        public string UserCode { get; set; }
        public string Token { get; set; }
        public string serial_num{ get; set; }

    }
    public class VoucherStatusClass
    {

        public char StatusFlag { get; set; }
        public string UserCode { get; set; }
        public string Token { get; set; }
        public int OpCode { get; set; }
       
    }
  
    public partial class Sls_InvoiceDetail : SecurityandUpdateFlagClass
    {

    } 
    public partial class G_Nationality : SecurityandUpdateFlagClass
    {

    }
    public partial class I_D_UnitGroup : SecurityandUpdateFlagClass
    {

    }
    public partial class I_D_UnitGroupUom : SecurityandUpdateFlagClass
    {

    }

   
    public partial class G_USERS : SecurityClass_G_USERS
    {

    }
    public partial class G_RoleUsers : SecurityandUpdateFlagClass
    {

    }
    public partial class I_D_Category : SecurityandUpdateFlagClass
    {

    }

    public partial class A_RecPay_D_Category : SecurityandUpdateFlagClass
    {

    }
    public partial class A_RecPay_D_Group : SecurityandUpdateFlagClass
    {

    }
    public partial class I_ItemFamily : SecurityandUpdateFlagClass
    {

    }

    public partial class I_Item : SecurityandUpdateFlagClass
    {

    }

    public partial class A_ACCOUNT : SecurityandUpdateFlagClass_FIN_YEAR
    {

    }
    public partial class AQ_GetAccount : SecurityandUpdateFlagClass_FIN_YEAR
    {

    }
    public partial class A_RecPay_D_AjustmentType : SecurityandUpdateFlagClass
    {

    }
    public partial class A_RecPay_D_Accounts : SecurityandUpdateFlagClass
    {

    }
    public partial class A_Pay_D_Vendor : SecurityandUpdateFlagClass
    {

    }
    public partial class A_Rec_D_Customer : SecurityClass
    {

    }
    public partial class I_Sls_D_Salesman : SecurityandUpdateFlagClass
    {
    }
    public partial class A_RecPay_D_CashBox : SecurityandUpdateFlagClass
    {
    }
    public partial class I_Sls_TR_InvoiceItems : SecurityandUpdateFlagClass
    {
    }
    public partial class A_RecPay_Tr_ReceiptNote : SecurityClass
    {
    }
    public partial class I_Pur_TR_Receive : SecurityandUpdateFlagClass
    {
    }

    public partial class I_Pur_TR_ReceiveItems : SecurityandUpdateFlagClass
    {
    }

    public partial class I_Pur_Tr_ReceiveCharges : SecurityandUpdateFlagClass
    {
    }
    public partial class A_RecPay_Tr_Adjustment : SecurityandUpdateFlagClass
    {
    }
    public partial class I_Sls_TR_Invoice : SecurityClass
    {
    }
    public partial class I_TR_Operation : SecurityClass
    {
    }
    public partial class I_TR_OperationItems : SecurityandUpdateFlagClass
    {
    }
    public partial class I_TR_OperationCharges : SecurityandUpdateFlagClass
    {
    }
    public partial class I_TR_OperationDeposit : SecurityandUpdateFlagClass
    {
    }
    public partial class A_TmpVoucherProcess : VoucherStatusClass 
    {
    }
    public partial class A_JOURNAL_DETAIL : SecurityandUpdateFlagClass
    {
    }
    public partial class A_TR_VchrTemplateDetail : SecurityandUpdateFlagClass
    {
    }
    public partial class G_COST_CENTER : SecurityandUpdateFlagClass
    {
    }
      public partial class G_CONTROL : SecurityandUpdateFlagClass
    {
    }
    public partial class I_ItemYear : SecurityandUpdateFlagClass
    {
    }
    public partial class G_LnkVarBranch : SecurityandUpdateFlagClass
    {
    }
    public partial class G_SUB_SYSTEMS : SecurityandUpdateFlagClass
    {
    }public partial class G_LnkTrans : SecurityandUpdateFlagClass
    {
    }
    public partial class G_LnkTransVoucher : SecurityandUpdateFlagClass_serial
    {
    }
    public partial class G_LnkTransVariable : SecurityandUpdateFlagClass
    {
    }
    public partial class G_LnkVar : SecurityandUpdateFlagClass
    {
    }
    public partial class I_Stk_TR_TransferDetails : SecurityandUpdateFlagClass
    {
    }
    public partial class G_USER_BRANCH : UpdateFlagClass
    {
    }
    public partial class I_Stk_Tr_AdjustDetails : SecurityandUpdateFlagClass
    {
    }
    public partial class I_Pur_D_Charges : SecurityandUpdateFlagClass
    {
    }
    public partial class I_Pur_Tr_PurchaseOrderDetail : SecurityandUpdateFlagClass
    {
    }
    public partial class G_STORE : SecurityandUpdateFlagClass
    {
    }
    public partial class I_TR_OperationTFDetail : SecurityandUpdateFlagClass
    {
    }
    public partial class A_Pay_D_VendorDoc : SecurityandUpdateFlagClass
    {
    }
    public partial class A_Rec_D_CustomerDoc : SecurityandUpdateFlagClass
    {
    }
    public partial class AVAT_D_SrvCategory : SecurityClass
    {
    } 
    public partial class AVAT_TR_PurInvoice : SecurityClass
    {
    }

    public partial class AVAT_TR_PurInvoiceDetail : SecurityandUpdateFlagClass
    {
    }
    public partial class AVAT_TR_PurInvoiceHeader : SecurityandUpdateFlagClass
    {
    }

    public partial class AVAT_TR_SlsInvoiceItem : SecurityandUpdateFlagClass
    {
    }
    public partial class AVAT_TR_PurInvoiceRet : SecurityClass
    {
    }
    public partial class G_COMPANY : SecurityandUpdateFlagClass
    {
    }
    public partial class G_AlertControl : SecurityClass
    {
    }
    public partial class A_CCDT_Types : SecurityClass
    {
    }
    public partial class A_CCDT_COSTCENTERS : SecurityandUpdateFlagClass
    {
    }
    public partial class AVAT_CONTROL : SecurityClass
    {
    }
    public partial class AVAT_PERIOD : SecurityClass
    {
    }
    public partial class AVAT_TRANS : SecurityClass
    {
    }
    public partial class A_CashVoucher_Detail : SecurityandUpdateFlagClass
    {
    }
        public partial class A_CashVoucher_Header : SecurityandUpdateFlagClass
    {
    }
    public partial class AVAT_D_Service : SecurityandUpdateFlagClass
    {
    }


}
