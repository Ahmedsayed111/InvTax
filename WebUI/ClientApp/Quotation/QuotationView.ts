
$(document).ready(() => {
    QuotationView.InitalizeComponent();
})

namespace QuotationView {

    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.QuotationView);

    var InvItemsDetailsModel: Array<Sls_InvoiceDetail> = new Array<Sls_InvoiceDetail>();

    var Selected_Data: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var InvoiceDisplay: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var Selecteditem: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var Invoice: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var InvQuotation: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var I_D_UOMDetails: Array<I_D_UOM> = new Array<I_D_UOM>();

    var btnCustSrchFilter: HTMLButtonElement;
    var btnFilter: HTMLButtonElement;
    var btnRefrash: HTMLButtonElement;
    var FromDate: HTMLInputElement;
    var ToDate: HTMLInputElement;
    var txtCompanynameFilter: HTMLInputElement;
    var txtRFQFilter: HTMLInputElement;
    var ReportGrid: JsGrid = new JsGrid();
    var ReportGridInv: JsGrid = new JsGrid();
    var CustomerId = 0;
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.CompCode;
    var GlobalinvoiceID = 0;
    var RFQFilter;
    var FromDat;
    var ToDat;
    export function InitalizeComponent() {

        debugger
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        InitializeGridQuotation();
        InitializeGridInvoice();
        FromDate.value = DateStartMonth();
        ToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;


        Display();

        FillddlUom();

    }
    function InitalizeControls() {
        btnCustSrchFilter = document.getElementById("btnCustSrchFilter") as HTMLButtonElement;
        btnFilter = document.getElementById("btnFilter") as HTMLButtonElement;
        btnRefrash = document.getElementById("btnRefrash") as HTMLButtonElement;
        txtCompanynameFilter = document.getElementById("txtCompanynameFilter") as HTMLInputElement;
        txtRFQFilter = document.getElementById("txtRFQFilter") as HTMLInputElement;
        ToDate = document.getElementById("ToDate") as HTMLInputElement;
        FromDate = document.getElementById("FromDate") as HTMLInputElement;
    }
    function InitalizeEvents() {
        btnCustSrchFilter.onclick = btnCust_onClick;
        btnFilter.onclick = btnFilter_onclick;
        btnRefrash.onclick = btnRefrash_onclick;
        txtCompanynameFilter.onchange = txtCompanynameFilter_ochange;
    }
    function txtCompanynameFilter_ochange() {
        txtCompanynameFilter.value = "";
        CustomerId = 0;
    }
    function btnRefrash_onclick() {
        CustomerId = 0;
        txtCompanynameFilter.value = '';
        txtRFQFilter.value = '';
        FromDate.value = DateStartMonth();
        ToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;

        Display();
    }
    function btnFilter_onclick() {


        Display();

    }

    function FillddlUom() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUOM"), 
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    I_D_UOMDetails = result.Response as Array<I_D_UOM>;
                }
            }
        });
    }
    function Display() {

        RFQFilter = txtRFQFilter.value;
        FromDat = FromDate.value;
        ToDat = ToDate.value;

        $("#ReportGrid").jsGrid("option", "pageIndex", 1);
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsInvoice"),
            data: { CompCode: compcode, BranchCode: BranchCode, CustomerId: CustomerId, RFQFilter: RFQFilter, StartDate: FromDat, EndDate: ToDat },
            success: (d) => {
                debugger;
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    InvoiceDisplay = result.Response as Array<Sls_Ivoice>;
                    //InvQuotation = InvoiceDisplay.filter(x => x.TrType == 0);
                    Invoice = new Array<Sls_Ivoice>();
                    InvQuotation = new Array<Sls_Ivoice>();

                    InvQuotation = InvoiceDisplay;


                    Invoice = InvoiceDisplay.filter(x => x.TrType == 1 && x.CashBoxID != null).sort(function (a, b) { return b.CashBoxID - a.CashBoxID; });
                    ReportGrid.DataSource = InvQuotation;
                    ReportGrid.Bind();

                    ReportGridInv.DataSource = Invoice;
                    ReportGridInv.Bind();


                    let TotalAmount = 0;
                    let TotalQty = 0;
                    $('#txtTotalAmount').val("");
                    $('#txtTotalQty').val("");
                    for (var i = 0; i < Invoice.length; i++) {
                        TotalAmount += Invoice[i].TotalAmount;
                        $('#txtTotalAmount').val(TotalAmount);
                        TotalQty++;
                    }
                    $('#txtTotalQty').val(TotalQty);

                    $('#txtCreatedBy').prop("value", '');
                    $('#txtCreatedAt').prop("value", '');
                    $('#txtUpdatedBy').prop("value", '');
                    $('#txtUpdatedAt').prop("value", '');

                    //$('.Done').addClass("display_none");
                }
            }
        });


    }
    function InitializeGridQuotation() {
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);

        //let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
        ReportGrid.OnRowDoubleClicked = DoubleClickGridQuotation;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "InvoiceID";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 8;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.SwitchingLanguageEnabled = false;
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [
            { title: "الرقم", name: "InvoiceID", type: "text", width: "5%", visible: false },
            { title: "Quot.No", name: "TrNo", type: "text", width: "5%" },
            { title: "RFQ", name: "RefNO", type: "text", width: "7%" },
            { title: "Date", name: "TrDateH", type: "text", width: "7%" },
            { title: "TotalAmount", name: "NetAfterVat", type: "text", width: "5%" },
            {
                title: "PurNo",
                width: "8%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "text";
                     

                    txt.placeholder = ("PurNo");
                    txt.id = "PurNo" + item.InvoiceID;
                    txt.className = "form-control ";

                    if (item.TaxNotes != '' && item.TaxNotes != null) {
                        txt.disabled = true;
                        txt.value = item.TaxNotes;
                    }

                    txt.onchange = (e) => {
                        ComfirmPurNo(item.InvoiceID, txt.value);
                    };

                    return txt;
                }
            },


            {
                title: "Review",
                width: "4%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLButtonElement => {
                    let txt: HTMLButtonElement = document.createElement("button");
                    txt.type = "button";
                    txt.innerText = ("Review");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-danger Done";
                    //if (item.TaxNotes == '' || item.TaxNotes == null) {
                    //    txt.classList.add("display_none")
                    //}

                    txt.onclick = (e) => {
                        PrintQuotation(item.InvoiceID);
                    };
                    return txt;
                }
            },

            {
                title: "DelivNote",
                width: "5%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLButtonElement => {
                    let txt: HTMLButtonElement = document.createElement("button");
                    txt.type = "button";
                    txt.innerText = ("DelivNote");
                    txt.id = "butDelivNote" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-primary Done";

                    if (item.TaxNotes == '' || item.TaxNotes == null) {
                        txt.classList.add("display_none")
                    }


                    txt.onclick = (e) => {
                        DelivNoteQuotation(item.InvoiceID);
                    };
                    return txt;
                }
            },
            {
                title: "Eidt",
                width: "3%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLButtonElement => {
                    let txt: HTMLButtonElement = document.createElement("button");
                    txt.type = "button";
                    txt.innerText = ("Eidt");
                    txt.id = "butEidt" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-warning input-sm Inv Done";

                    //if (item.TaxNotes == '' || item.TaxNotes == null) {
                    //    txt.classList.add("display_none")
                    //}

                    if (item.TrType == 1) {
                        txt.classList.add("display_none")
                    }
                    txt.onclick = (e) => {

                        $('#title_Edit').html('Eidt Quotation');
                        EidtQuotation(item.InvoiceID);
                    };
                    return txt;
                }
            },

            {
                title: "Comfirm",
                width: "5%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLButtonElement => {
                    let txt: HTMLButtonElement = document.createElement("button");
                    txt.type = "button";
                    txt.innerText = ("comfirm");
                    txt.id = "butComfirm" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-success Inv Done";

                    if (item.TaxNotes == '' || item.TaxNotes == null) {
                        txt.classList.add("display_none")
                    }

                    if (item.TrType == 1) {
                        txt.classList.add("display_none")
                    }
                    txt.onclick = (e) => {
                        ComfirmQuotation(item.InvoiceID);


                    };
                    return txt;
                }
            },






        ];
        ReportGrid.Bind();

         
    }
    function InitializeGridInvoice() {



        //let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
        ReportGridInv.OnRowDoubleClicked = DoubleClickGridInvoice;
        ReportGridInv.ElementName = "ReportGridInv";
        ReportGridInv.PrimaryKey = "InvoiceID";
        ReportGridInv.Paging = true;
        ReportGridInv.PageSize = 6;
        ReportGridInv.Sorting = true;
        ReportGridInv.InsertionMode = JsGridInsertionMode.Binding;
        ReportGridInv.Editing = false;
        ReportGridInv.Inserting = false;
        ReportGridInv.SelectedIndex = 1;
        ReportGridInv.SwitchingLanguageEnabled = false;
        ReportGridInv.OnItemEditing = () => { };
        ReportGridInv.Columns = [
            { title: "الرقم", name: "InvoiceID", type: "text", width: "5%", visible: false },
            { title: "INV.No", name: "CashBoxID", type: "text", width: "5%" },
            { title: "RFQ", name: "RefNO", type: "text", width: "8%" },
            { title: "PurNo", name: "TaxNotes", type: "text", width: "8%" },
            { title: "Date", name: "CustomerMobileNo", type: "text", width: "7%" },
            { title: "TotalAmount", name: "NetAfterVat", type: "text", width: "10%" },
            {
                title: "Review",
                width: "5%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("Review");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-warning input-sm";

                    txt.onclick = (e) => {
                        PrintInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },

            {
                title: "Eidt",
                width: "3%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("Eidt");
                    txt.id = "butEidt" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-success input-sm Inv Done";

                    txt.onclick = (e) => {
                        $('#title_Edit').html('Eidt Invoice');

                        EidtQuotation(item.InvoiceID);
                    };
                    return txt;
                }
            },


            {
                title: "Delete",
                width: "5%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("Delete");
                    txt.id = "butDelete" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-danger ";

                    txt.onclick = (e) => {
                        DeleteInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },




        ];
        ReportGridInv.Bind();
    }

    function DoubleClickGridQuotation() {

        Selecteditem = new Array<Sls_Ivoice>();
        Selecteditem = InvoiceDisplay.filter(x => x.InvoiceID == Number(ReportGrid.SelectedKey));

        $('#txtCreatedBy').prop("value", Selecteditem[0].CreatedBy);
        $('#txtCreatedAt').prop("value", Selecteditem[0].CreatedAt);

        $('#txtUpdatedBy').prop("value", Selecteditem[0].UpdatedBy);
        $('#txtUpdatedAt').prop("value", Selecteditem[0].UpdatedAt);
    }


    function DoubleClickGridInvoice() {

        Selecteditem = new Array<Sls_Ivoice>();
        Selecteditem = InvoiceDisplay.filter(x => x.InvoiceID == Number(ReportGridInv.SelectedKey));

        $('#txtCreatedBy').prop("value", Selecteditem[0].CreatedBy);
        $('#txtCreatedAt').prop("value", Selecteditem[0].CreatedAt);

        $('#txtUpdatedBy').prop("value", Selecteditem[0].UpdatedBy);
        $('#txtUpdatedAt').prop("value", Selecteditem[0].UpdatedAt);
    }

    function ComfirmPurNo(btnId: number, PurNo: string) {



        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "UpdatePurNo"),
            data: { InvoiceID: btnId, PurNo: PurNo },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    Display();


                } else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });

    }
    function ComfirmQuotation(btnId: number) {
        var InvDate = GetDate();
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "UpdateInvoice"),
            data: { InvoiceID: btnId, InvDate: InvDate },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    Display();
                    $('#viewmail').removeClass('active in');
                    $('#sendmail').addClass('active in');

                    $('#btnQuotations').removeClass('active');
                    $('#btnInvoice').addClass('active');

                } else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });

    }
    function DelivNoteQuotation(btnId: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


        let rp: ReportParameters = new ReportParameters();

        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.Type = 4;
        rp.Repdesign = 2;
        rp.TRId = btnId;
        rp.slip = 0;
        rp.stat = 1

        debugger
        Ajax.CallAsync({
            url: Url.Action("PrintQuotation", "GeneralRep"),
            data: rp,
            success: (d) => {
                let result = d as BaseResponse;
                localStorage.setItem("result", "" + result + "");
                window.open(Url.Action("ReportsPopup", "Home"), "blank");

                //let result = d.result as string;    
                //window.open(result, "_blank");
            }
        })
    }
    function PrintQuotation(btnId: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


        let rp: ReportParameters = new ReportParameters();

        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.Type = 4;
        rp.Repdesign = 1;
        rp.TRId = btnId;
        rp.slip = 0;
        rp.stat = 1

        debugger
        Ajax.CallAsync({
            url: Url.Action("PrintQuotation", "GeneralRep"),
            data: rp,
            success: (d) => {
                let result = d as BaseResponse;
                localStorage.setItem("result", "" + result + "");
                window.open(Url.Action("ReportsPopup", "Home"), "blank");

                //let result = d.result as string;    
                //window.open(result, "_blank");
            }
        })
    }
    function EidtQuotation(btnId: number) {

        debugger
        $('#viewmail').removeClass('active in');
        $('#sendmail').removeClass('active in');
        $('#composemail').addClass('active in');

        $('#btnQuotations').removeClass('active');
        $('#btnInvoice').removeClass('active');



        InitalizeComponentInvoice();


        Selected_Data = new Array<Sls_Ivoice>();

        Selected_Data = InvoiceDisplay.filter(x => x.InvoiceID == Number(btnId));

        DisplayData(Selected_Data);

    }
    function DisplayData(Selected_Data: Array<Sls_Ivoice>) {
        debugger

        DocumentActions.RenderFromModel(Selected_Data[0]);

        if (Selected_Data[0].TrType == 1) {
            txtDate.value = DateFormat(Selected_Data[0].DeliveryEndDate);
        }
        else {
            txtDate.value = DateFormat(Selected_Data[0].TrDate);
        }


        GlobalinvoiceID = Selected_Data[0].InvoiceID;
        CustomerId = Selected_Data[0].CustomerId;
        txtQutationNo.value = Selected_Data[0].TrNo.toString();
        txtRFQ.value = Selected_Data[0].RefNO;
        txtCompanysales.value = Selected_Data[0].ChargeReason;
        txtRemark.value = Selected_Data[0].Remark;
        GetCustomer();
        txtNetBefore.value = Selected_Data[0].TotalAmount.toString();
        txtAllDiscount.value = Selected_Data[0].RoundingAmount.toString();
        txtNetAfterVat.value = Selected_Data[0].NetAfterVat.toString();
        //-------------------------(T E R M S & C O N D I T I O N S)-----------------------------------------------     
        txtsalesVAT.value = Selected_Data[0].ContractNo.toString(); //----------------- include sales VAT.
        txtfirstdays.value = Selected_Data[0].PurchaseorderNo.toString(); //----------------- days starting from the delivery date.
        txtsecounddays.value = Selected_Data[0].ChargeVatPrc.toString(); //----------------- days from offer date.
        txtlastdays.value = Selected_Data[0].ChargeAfterVat.toString(); //----------------- days from purchase order.
        txtPlacedeliv.value = Selected_Data[0].PrevInvoiceHash.toString(); //----------------- Place of delivery.

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    InvItemsDetailsModel = result.Response as Array<Sls_InvoiceDetail>;
                    CountGrid = 0;
                    $("#Table_Data").html("");
                    for (let i = 0; i < InvItemsDetailsModel.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);
                    }
                    CountGrid = InvItemsDetailsModel.length;
                }
            }
        });

    }
    function GetCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetCustomer"),
            data: { ID: Selected_Data[0].CustomerId },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CustomerDetailnew = result.Response as Array<Customer>;
                    txtCompanyname.value = CustomerDetailnew[0].NAMEE;
                    $('#btnCustSrch').attr('disabled', 'disabled');
                    $('#txtCompanyname').attr('disabled', 'disabled');
                }
            }
        });
    }
    function Display_GridConrtol(cnt) {


        $("#txt_StatusFlag" + cnt).val("");

        $("#InvoiceItemID" + cnt).prop("value", InvItemsDetailsModel[cnt].InvoiceItemID);
        $("#txt_ItemID" + cnt).prop("value", InvItemsDetailsModel[cnt].ItemID);
        $("#serial" + cnt).prop("value", InvItemsDetailsModel[cnt].Serial);
        $("#QTY" + cnt).prop("value", InvItemsDetailsModel[cnt].SoldQty);
        $("#Description" + cnt).prop("value", InvItemsDetailsModel[cnt].Itemdesc);
        $("#ddlTypeUom" + cnt).prop("value", InvItemsDetailsModel[cnt].UomID);
        $("#UnitPrice" + cnt).prop("value", InvItemsDetailsModel[cnt].NetUnitPrice);
        $("#Totalprice" + cnt).prop("value", InvItemsDetailsModel[cnt].ItemTotal);
        $("#DiscountPrc" + cnt).prop("value", InvItemsDetailsModel[cnt].DiscountPrc);
        $("#DiscountAmount" + cnt).prop("value", InvItemsDetailsModel[cnt].DiscountAmount);
        $("#Net" + cnt).prop("value", InvItemsDetailsModel[cnt].NetAfterVat);

    }
    function PrintInvoice(btnId: number) {
        if (!SysSession.CurrentPrivileges.PrintOut) return;

        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');


        let rp: ReportParameters = new ReportParameters();

        rp.CompCode = SysSession.CurrentEnvironment.CompCode;
        rp.BranchCode = SysSession.CurrentEnvironment.BranchCode;
        rp.CompNameA = SysSession.CurrentEnvironment.CompanyNameAr;
        rp.CompNameE = SysSession.CurrentEnvironment.CompanyName;
        rp.UserCode = SysSession.CurrentEnvironment.UserCode;
        rp.Tokenid = SysSession.CurrentEnvironment.Token;
        rp.ScreenLanguage = SysSession.CurrentEnvironment.ScreenLanguage;
        rp.SystemCode = SysSession.CurrentEnvironment.SystemCode;
        rp.SubSystemCode = SysSession.CurrentEnvironment.SubSystemCode;
        rp.BraNameA = SysSession.CurrentEnvironment.BranchName;
        rp.BraNameE = SysSession.CurrentEnvironment.BranchName;
        if (rp.BraNameA == null || rp.BraNameE == null) {

            rp.BraNameA = " ";
            rp.BraNameE = " ";
        }
        rp.Type = 4;
        rp.Repdesign = 3;
        rp.TRId = btnId;
        rp.slip = 0;
        rp.stat = 1

        debugger
        Ajax.CallAsync({
            url: Url.Action("PrintQuotation", "GeneralRep"),
            data: rp,
            success: (d) => {
                let result = d as BaseResponse;
                localStorage.setItem("result", "" + result + "");
                window.open(Url.Action("ReportsPopup", "Home"), "blank");

                //let result = d.result as string;    
                //window.open(result, "_blank");
            }
        })
    }
    function DeleteInvoice(btnId: number) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "DeleteInvoice"),
            data: { InvoiceID: btnId },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    Display();
                    $('#viewmail').removeClass('active in');
                    $('#sendmail').addClass('active in');

                    $('#btnQuotations').removeClass('active');
                    $('#btnInvoice').addClass('active');

                } else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });
    }
    function btnCust_onClick() {
        sys.FindKey(Modules.Quotation, "btnCustSrch", "", () => {
            CustomerDetail = SearchGrid.SearchDataGrid.SelectedKey;
            console.log(CustomerDetail);
            CustomerId = Number(CustomerDetail[0]);
            txtCompanynameFilter.value = String(CustomerDetail[2]);
            include = String(CustomerDetail[3]);
        });
    }

    /*@* ---------------------------------------Eidt Invoice------------------------------------------*@*/

    var InvoiceItemsDetailsModel: Array<Sls_InvoiceDetail> = new Array<Sls_InvoiceDetail>();
    var invoiceItemSingleModel: Sls_InvoiceDetail = new Sls_InvoiceDetail();
    var InvoiceModel: Sls_Ivoice = new Sls_Ivoice();
    var MasterDetailsModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var CustomerDetail: Array<Customer> = new Array<Customer>();
    var CustomerDetailnew: Array<Customer> = new Array<Customer>();

    var CountGrid = 0;
    var btnAddDetails: HTMLButtonElement;
    var btnsave: HTMLButtonElement;
    var btnClean: HTMLButtonElement;
    var CustomerId: number = 0;
    var btnCustSrch: HTMLButtonElement;
    var invoiceID: number = 0;
    var txtDate: HTMLInputElement;
    var txtRFQ: HTMLInputElement;
    var txtCompanysales: HTMLInputElement;
    var txtCompanyname: HTMLInputElement;
    var txtQutationNo: HTMLInputElement;
    var txtsalesVAT: HTMLInputElement;
    var txtfirstdays: HTMLInputElement;
    var txtsecounddays: HTMLInputElement;
    var txtlastdays: HTMLInputElement;
    var txtPlacedeliv: HTMLInputElement;
    var txtRemark: HTMLInputElement;
    var txtNetBefore: HTMLInputElement;
    var txtAllDiscount: HTMLInputElement;
    var txtNetAfterVat: HTMLInputElement;
    var include = "";

    export function InitalizeComponentInvoice() {


        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControlsInvoice();
        InitalizeEventsInvoice();

    }
    function InitalizeControlsInvoice() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnCustSrch = document.getElementById("btnCustSrch") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnClean = document.getElementById("btnClean") as HTMLButtonElement;
        // inputs
        txtDate = document.getElementById("txtDate") as HTMLInputElement;
        txtRFQ = document.getElementById("txtRFQ") as HTMLInputElement;
        txtCompanysales = document.getElementById("txtCompanysales") as HTMLInputElement;
        txtCompanyname = document.getElementById("txtCompanyname") as HTMLInputElement;
        txtQutationNo = document.getElementById("txtQutationNo") as HTMLInputElement;
        txtsalesVAT = document.getElementById("txtsalesVAT") as HTMLInputElement;
        txtfirstdays = document.getElementById("txtfirstdays") as HTMLInputElement;
        txtsecounddays = document.getElementById("txtsecounddays") as HTMLInputElement;
        txtlastdays = document.getElementById("txtlastdays") as HTMLInputElement;
        txtPlacedeliv = document.getElementById("txtPlacedeliv") as HTMLInputElement;
        txtRemark = document.getElementById("txtRemark") as HTMLInputElement;
        txtNetBefore = document.getElementById("txtNetBefore") as HTMLInputElement;
        txtAllDiscount = document.getElementById("txtAllDiscount") as HTMLInputElement;
        txtNetAfterVat = document.getElementById("txtNetAfterVat") as HTMLInputElement;
    }
    function InitalizeEventsInvoice() {

        btnAddDetails.onclick = AddNewRow;//
        btnCustSrch.onclick = btnCustSrch_onClick;
        btnsave.onclick = btnsave_onclick;
        btnClean.onclick = success_insert;
        txtAllDiscount.onkeyup = computeTotal;
    }
    function btnCustSrch_onClick() {
        sys.FindKey(Modules.Quotation, "btnCustSrch", "", () => {

            CustomerDetail = SearchGrid.SearchDataGrid.SelectedKey;
            console.log(CustomerDetail);
            CustomerId = Number(CustomerDetail[0]);
            alert(String(CustomerDetail[2]));
            txtCompanyname.value = String(CustomerDetail[2]);
            include = String(CustomerDetail[3]);
            if (include == "true") {
                txtsalesVAT.value = "include";
            } else {
                txtsalesVAT.value = "not include";
            }
            computeTotal();
        });
    }
    function BuildControls(cnt: number) {
        var html;

        html = '<tr id= "No_Row' + cnt + '" class="  animated zoomIn ">' +

            '<td><button id="btn_minus' + cnt + '" type="button" class="btn btn-custon-four btn-danger"><i class="fa fa-minus-circle"></i></button></td>' +
            '<td><input  id="serial' + cnt + '" disabled="disabled"  type="text" class="form-control" placeholder="SR"></td>' +
            '<td><input  id="QTY' + cnt + '" type="number" class="form-control" placeholder="QTY"></td>' +
            '<td> <textarea id="Description' + cnt + '" name="Description" type="text" class="form-control" style="height:34px" placeholder="Description" spellcheck="false"></textarea></td>' +


            '<td><select id="ddlTypeUom' + cnt + '" class="form-control"> <option value="null"> Choose Uom </option></select></td>' +


            '<td><input  id="UnitPrice' + cnt + '" value="0" type="number" class="form-control" placeholder="Unit Price"></td>' +
            '<td><input  id="Totalprice' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="Total price"></td>' +
            '<td><input  id="DiscountPrc' + cnt + '" value="0" type="number" class="form-control" placeholder="DiscountPrc%"></td>' +
            '<td><input  id="DiscountAmount' + cnt + '" value="0"  disabled type="number" class="form-control" placeholder="DiscountAmount"></td>' +
            '<td><input  id="Net' + cnt + '" type="number" disabled="disabled" value="0" class="form-control" placeholder="Net"></td>' +
            ' <input  id="txt_StatusFlag' + cnt + '" type="hidden" class="form-control"> ' +
            ' <input  id="InvoiceItemID' + cnt + '" type="hidden" class="form-control"> ' +
            ' <input  id="txt_ItemID' + cnt + '" type="hidden" class="form-control"> ' +
            '</tr>';
        $("#Table_Data").append(html);


        for (var i = 0; i < I_D_UOMDetails.length; i++) {

            $('#ddlTypeUom' + cnt + '').append('<option  value="' + I_D_UOMDetails[i].UomID + '">' + I_D_UOMDetails[i].DescE + '</option>');

        }


        $("#Description" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

        });
        $("#ddlTypeUom" + cnt).on('change', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

        });
        $("#UnitPrice" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            computeRows(cnt);
        });
        $("#QTY" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            computeRows(cnt);
        });
        $("#DiscountAmount" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            computeRows(cnt);
        });
        $("#DiscountPrc" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            if (Number($("#DiscountPrc" + cnt).val()) < 0 || $("#DiscountPrc" + cnt).val().trim() == "") {
                $("#DiscountPrc" + cnt).val("0");
            }
            if (Number($("#DiscountPrc" + cnt).val()) > 100) {
                $("#DiscountPrc" + cnt).val("100");
            }
            computeRows(cnt);

        });
        $("#btn_minus" + cnt).click(function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");
            DeleteRow(cnt);
        });

        return;
    }
    function computeRows(cnt: number) {

        $("#Totalprice" + cnt).val(Number($("#UnitPrice" + cnt).val()) * (Number($("#QTY" + cnt).val())));
        $("#DiscountAmount" + cnt).val(Number($("#DiscountPrc" + cnt).val()) * Number($("#Totalprice" + cnt).val()) / 100);
        $("#Net" + cnt).val(Number($("#Totalprice" + cnt).val()) - (Number($("#DiscountAmount" + cnt).val())));
        computeTotal();
    }
    function computeTotal() {
        let NetCount = 0;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                NetCount += Number($("#Net" + i).val());
                NetCount = Number(NetCount.toFixed(2).toString());
            }
        }
        if (include == "true") {
            NetCount = NetCount + ((NetCount * 14) / 100);
        }
        txtNetBefore.value = NetCount.toString();


        let Net = (Number(txtNetBefore.value) - Number(txtAllDiscount.value)).toFixed(2);
        txtNetAfterVat.value = Net.toString();
    }
    function AddNewRow() {
        $('paginationSwitch').addClass("display_none");
        $('.no-records-found').addClass("display_none");

        let CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = validationgrid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {

            BuildControls(CountGrid);
            $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
            CountGrid++;
            Insert_Serial();
        }

    }
    function validationgrid(rowcount: number) {

        if ($("#QTY" + rowcount).val().trim() == "" || Number($("#QTY" + rowcount).val()) <= 0) {
            Errorinput($("#QTY" + rowcount));
            DisplayMassage('Item quantity must be entered', 'Item quantity must be entered', MessageType.Error);
            return false;
        }
        if ($("#Description" + rowcount).val().trim() == "") {
            Errorinput($("#Description" + rowcount));
            DisplayMassage('Item Describtion must be entered', 'Item Describtion must be entered', MessageType.Error);
            return false;
        }

        if ($("#ddlTypeUom" + rowcount).val().trim() == "null") {
            Errorinput($("#ddlTypeUom" + rowcount));
            DisplayMassage('Item Describtion must be entered', 'Item Describtion must be entered', MessageType.Error);
            return false;
        }
        //if ($("#UnitPrice" + rowcount).val().trim() == "" || Number($("#UnitPrice" + rowcount).val()) <= 0) {
        //    Errorinput($("#UnitPrice" + rowcount));
        //    DisplayMassage('Item Price must be entered', 'Item Price must be entered', MessageType.Error);
        //    return false;
        //}

        return true;
    }
    function DeleteRow(RecNo: number) {

        WorningMessage("Do you want to delete?", "Do you want to delete?", "warning", "warning", () => {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');
            computeRows(RecNo);
            computeTotal();
            $("#serial" + RecNo).val("99");
            $("#QTY" + RecNo).val("99");
            $("#Description" + RecNo).val("99");
            $("#UnitPrice" + RecNo).val("99");
            $("#Totalprice" + RecNo).val("199");
            $("#DiscountPrc" + RecNo).val("199");
            $("#DiscountAmount" + RecNo).val("199");
            $("#No_Row" + RecNo).attr("hidden", "true");

            Insert_Serial();

        });
    }
    function Insert_Serial() {


        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            if ($("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                $("#serial" + i).val(Ser);
                Ser++;
            }
            if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                $("#txt_StatusFlag" + i).val('u');
            }
        }

    }
    function Assign() {
        //var StatusFlag: String;
        InvoiceModel = new Sls_Ivoice();
        InvoiceItemsDetailsModel = new Array<Sls_InvoiceDetail>();


        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        InvoiceModel.InvoiceID = GlobalinvoiceID;
        InvoiceModel.Status = 1;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(txtQutationNo.value);
        InvoiceModel.TrNo = Selected_Data[0].TrNo;
        InvoiceModel.CreatedAt = Selected_Data[0].CreatedAt;
        InvoiceModel.CreatedBy = Selected_Data[0].CreatedBy;
        InvoiceModel.TaxNotes = Selected_Data[0].TaxNotes;
        InvoiceModel.TrType = Selected_Data[0].TrType == null ? 0 : Selected_Data[0].TrType //0 invoice 1 return    
        InvoiceModel.CashBoxID = Selected_Data[0].CashBoxID == null ? 0 : Selected_Data[0].CashBoxID //0 TrNo invoice 1 return  


        if (Selected_Data[0].TrType == 1) {

            InvoiceModel.DeliveryEndDate = txtDate.value;
            InvoiceModel.TrDate = Selected_Data[0].TrDate == null ? '' : Selected_Data[0].TrDate // DeliveryEndDate  return
        }
        else {
            InvoiceModel.DeliveryEndDate = Selected_Data[0].DeliveryEndDate == null ? '' : Selected_Data[0].DeliveryEndDate // DeliveryDate  return
            InvoiceModel.TrDate = txtDate.value;
        }
        //InvoiceModel.DeliveryDate = Selected_Data[0].DeliveryDate == null ? '' : Selected_Data[0].DeliveryDate // DeliveryDate  return

        InvoiceModel.RefNO = txtRFQ.value;
        InvoiceModel.SalesmanId = 1;
        InvoiceModel.ChargeReason = txtCompanysales.value;
        InvoiceModel.Remark = txtRemark.value;
        InvoiceModel.TotalAmount = Number(txtNetBefore.value);
        InvoiceModel.RoundingAmount = Number(txtAllDiscount.value);
        InvoiceModel.NetAfterVat = Number(txtNetAfterVat.value);
        //-------------------------(T E R M S & C O N D I T I O N S)-----------------------------------------------     
        InvoiceModel.ContractNo = txtsalesVAT.value;       //----------------- include sales VAT.
        InvoiceModel.PurchaseorderNo = txtfirstdays.value;      //----------------- days starting from the delivery date.
        InvoiceModel.ChargeVatPrc = Number(txtsecounddays.value);    //----------------- days from offer date.
        InvoiceModel.ChargeAfterVat = Number(txtlastdays.value);       //----------------- days from purchase order.
        InvoiceModel.PrevInvoiceHash = txtPlacedeliv.value;//----------------- Place of delivery.

        InvoiceModel.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.UpdatedAt = DateTimeFormat(Date().toString());

        // Details
        for (var i = 0; i < CountGrid; i++) {
            let StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                invoiceItemSingleModel = new Sls_InvoiceDetail();

                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = Number($("#InvoiceItemID" + i).val());
                invoiceItemSingleModel.Serial = Number($("#serial" + i).val());
                invoiceItemSingleModel.SoldQty = Number($('#QTY' + i).val());
                invoiceItemSingleModel.Itemdesc = $("#Description" + i).val();
                invoiceItemSingleModel.UomID = Number($("#ddlTypeUom" + i).val());
                invoiceItemSingleModel.NetUnitPrice = Number($("#UnitPrice" + i).val());
                invoiceItemSingleModel.ItemTotal = Number($("#Totalprice" + i).val());
                invoiceItemSingleModel.DiscountPrc = Number($("#DiscountPrc" + i).val());
                invoiceItemSingleModel.DiscountAmount = Number($("#DiscountAmount" + i).val());
                invoiceItemSingleModel.NetAfterVat = Number($("#Net" + i).val());
                invoiceItemSingleModel.StatusFlag = StatusFlag;
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }

            if (StatusFlag == "u") {
                invoiceItemSingleModel = new Sls_InvoiceDetail();

                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = Number($("#InvoiceItemID" + i).val());
                invoiceItemSingleModel.Serial = Number($("#serial" + i).val());
                invoiceItemSingleModel.SoldQty = Number($('#QTY' + i).val());
                invoiceItemSingleModel.Itemdesc = $("#Description" + i).val();
                invoiceItemSingleModel.UomID = Number($("#ddlTypeUom" + i).val());
                invoiceItemSingleModel.NetUnitPrice = Number($("#UnitPrice" + i).val());
                invoiceItemSingleModel.ItemTotal = Number($("#Totalprice" + i).val());
                invoiceItemSingleModel.DiscountPrc = Number($("#DiscountPrc" + i).val());
                invoiceItemSingleModel.DiscountAmount = Number($("#DiscountAmount" + i).val());
                invoiceItemSingleModel.NetAfterVat = Number($("#Net" + i).val());
                invoiceItemSingleModel.StatusFlag = StatusFlag;

                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }

            if (StatusFlag == "d") {
                invoiceItemSingleModel = new Sls_InvoiceDetail();
                invoiceItemSingleModel.InvoiceItemID = Number($("#InvoiceItemID" + i).val());
                invoiceItemSingleModel.StatusFlag = StatusFlag;
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
        }
        MasterDetailsModel.Sls_Ivoice = InvoiceModel;
        MasterDetailsModel.Sls_InvoiceDetail = InvoiceItemsDetailsModel;
    }
    function Update() {
        if (!validation()) return;
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                    let res = result.Response as Sls_Ivoice;
                    invoiceID = res.InvoiceID;
                    DisplayMassage("An invoice number has been issued " + res.TrNo + "", "An invoice number has been issued " + res.TrNo + "", MessageType.Succeed);

                    success_insert();


                } else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });

    }
    function success_insert() {
        //InitializeGridQuotation();

        CustomerId = 0;
        Display();
        $('#viewmail').addClass('active in');
        $('#sendmail').removeClass('active in');
        $('#composemail').removeClass('active in');

        $('#btnQuotations').addClass('active');
        $('#btnInvoice').removeClass('active');


        $('#txtCreatedBy').prop("value", Selected_Data[0].CreatedBy);
        $('#txtCreatedAt').prop("value", Selected_Data[0].CreatedAt);

        $('#txtUpdatedBy').prop("value", SysSession.CurrentEnvironment.UserCode);
        $('#txtUpdatedAt').prop("value", DateTimeFormat(Date().toString()));
    }
    function validation() {

        if (txtDate.value.trim() == "") {
            Errorinput(txtDate);
            DisplayMassage('Date must be entered', 'Date must be entered', MessageType.Error);
            return false;
        }
        if (txtCompanyname.value.trim() == "") {
            Errorinput(txtCompanyname);
            DisplayMassage('Company must be choosed', 'Company must be choosed', MessageType.Error);
            return false;
        }
        if (txtCompanysales.value.trim() == "") {
            Errorinput(txtCompanysales);
            DisplayMassage('Company sales man must be choosed', 'Company sales man must be choosed', MessageType.Error);
            return false;
        }
        if (txtRFQ.value.trim() == "") {
            Errorinput(txtRFQ);
            DisplayMassage(' RFQ must be entered', ' RFQ must be entered', MessageType.Error);
            return false;
        }
        if (txtsalesVAT.value.trim() == "") {
            Errorinput(txtsalesVAT);
            DisplayMassage('Vat include or not must be entered', ' Vat include or not must be entered', MessageType.Error);
            return false;
        }
        if (txtfirstdays.value.trim() == "") {
            Errorinput(txtfirstdays);
            DisplayMassage('days starting from the delivery date must be entered', 'days starting from the delivery date must be entered', MessageType.Error);
            return false;
        }
        if (txtsecounddays.value.trim() == "") {
            Errorinput(txtsecounddays);
            DisplayMassage('Offer validity days from offer date must be entered', ' Offer validity days from offer date must be entered', MessageType.Error);
            return false;
        }
        if (txtlastdays.value.trim() == "") {
            Errorinput(txtlastdays);
            DisplayMassage('Place of delivery must be entered', ' Place of delivery must be entered', MessageType.Error);
            return false;
        }
        return true;
    }
    function btnsave_onclick() {
        Update();
    }

    //----------------------------------------------------------------------------------------------------





}












