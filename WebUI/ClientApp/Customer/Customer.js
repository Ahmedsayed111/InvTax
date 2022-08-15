$(document).ready(function () {
    CustomerCompany.InitalizeComponent();
});
var CustomerCompany;
(function (CustomerCompany) {
    var sys = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession = GetSystemSession(Modules.Quotation);
    var InvoiceItemsDetailsModel = new Array();
    var invoiceItemSingleModel = new Sls_InvoiceDetail();
    var InvoiceModel = new Sls_Ivoice();
    var MasterDetailsModel = new SlsInvoiceMasterDetails();
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode;
    var btnsave;
    var txtNameComp;
    var txtmailComp;
    var txtAddressComp;
    var chkvat;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
    }
    CustomerCompany.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // ;     
        btnsave = document.getElementById("btnsave");
        // inputs
        txtmailComp = document.getElementById("txtmailComp");
        txtAddressComp = document.getElementById("txtAddressComp");
        chkvat = document.getElementById("chkvat");
        txtNameComp = document.getElementById("txtNameComp");
    }
    function InitalizeEvents() {
        btnsave.onclick = insert;
    }
    function Assign() {
        ////var StatusFlag: String;
        //InvoiceModel = new Sls_Ivoice();
        //InvoiceItemsDetailsModel = new Array<Sls_InvoiceDetail>();
        //InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        //InvoiceModel.Status = 1;
        //InvoiceModel.CompCode = Number(compcode);
        //InvoiceModel.BranchCode = Number(BranchCode);
        //var InvoiceNumber = Number(txtQutationNo.value);
        //InvoiceModel.TrNo = InvoiceNumber;
        //InvoiceModel.CreatedAt = sys.SysSession.CurrentEnvironment.UserCode;
        //InvoiceModel.CreatedBy = sys.SysSession.CurrentEnvironment.UserCode;
        //InvoiceModel.TrType = 0//0 invoice 1 return     
        //InvoiceModel.InvoiceID = 0;
        //InvoiceModel.TrDate = txtmailComp.value;
        //InvoiceModel.RefNO = txtAddressComp.value;
        //InvoiceModel.SalesmanId = Number(chkvat.value);                
        //InvoiceModel.Remark = txtRemark.value; 
        //InvoiceModel.TotalAmount = Number(txtNetBefore.value);
        //InvoiceModel.RoundingAmount = Number(txtAllDiscount.value);
        //InvoiceModel.NetAfterVat = Number(txtNetAfterVat.value);
        ////-------------------------(T E R M S & C O N D I T I O N S)-----------------------------------------------     
        //InvoiceModel.ContractNo = txtsalesVAT.value;       //----------------- include sales VAT.
        //InvoiceModel.ContractNo = txtfirstdays.value;      //----------------- days starting from the delivery date.
        //InvoiceModel.ContractNo = txtsecounddays.value;    //----------------- days from offer date.
        //InvoiceModel.ContractNo = txtlastdays.value;       //----------------- days from purchase order.
        //InvoiceModel.PrevInvoiceHash = txtPlacedeliv.value;//----------------- Place of delivery.
        //// Details
        //for (var i = 0; i < CountGrid; i++) {
        //    invoiceItemSingleModel = new Sls_InvoiceDetail();
        //    invoiceItemSingleModel.InvoiceItemID = 0;            
        //    invoiceItemSingleModel.Serial = Number($("#serial" + i).val());
        //    invoiceItemSingleModel.SoldQty = Number($('#QTY' + i).val());
        //    invoiceItemSingleModel.Itemdesc = $("#Description" + i).val();
        //    invoiceItemSingleModel.NetUnitPrice = Number($("#UnitPrice" + i).val());
        //    invoiceItemSingleModel.ItemTotal = Number($("#Totalprice" + i).val());
        //    invoiceItemSingleModel.DiscountAmount = Number($("#Discount" + i).val());
        //    invoiceItemSingleModel.NetAfterVat = Number($("#Net" + i).val()); 
        //        InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
        //    }
        //MasterDetailsModel.Sls_Ivoice = InvoiceModel;
        //MasterDetailsModel.Sls_InvoiceDetail = InvoiceItemsDetailsModel;   
    }
    function insert() {
        //Assign();
        //Ajax.Callsync({
        //    type: "POST",
        //    url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
        //    data: JSON.stringify(MasterDetailsModel),
        //    success: (d) => {
        //        let result = d as BaseResponse;
        //        if (result.IsSuccess == true) {
        //          let res = result.Response as Sls_Ivoice;
        //             invoiceID = res.InvoiceID;
        //            DisplayMassage(" تم اصدار  فاتورة رقم  " + res.TrNo + " ", "An invoice number has been issued " + res.TrNo + "", MessageType.Succeed);
        //             success_insert();
        //        } else {       
        //            DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري", "Please refresh the page and try again", MessageType.Error);
        //        }
        //    }
        //});
    }
    function success_insert() {
        txtmailComp.value = GetDate();
        txtAddressComp.value = "";
        chkvat.value = "";
        txtNameComp.value = "";
    }
})(CustomerCompany || (CustomerCompany = {}));
//# sourceMappingURL=Customer.js.map