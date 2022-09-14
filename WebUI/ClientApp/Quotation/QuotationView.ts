
$(document).ready(() => {
    QuotationView.InitalizeComponent();
})

namespace QuotationView {

    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.QuotationView);

    var InvItemsDetailsModel: Array<IQ_Sls_InvoiceDetail_Tax> = new Array<IQ_Sls_InvoiceDetail_Tax>();

    var Selected_Data: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var InvoiceDisplay: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var Selecteditem: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var Invoice: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var InvQuotation: Array<Sls_Ivoice> = new Array<Sls_Ivoice>();
    var I_D_UOMDetails: Array<I_D_UOM> = new Array<I_D_UOM>();
    var CustomerDetailnew: Array<receiver> = new Array<receiver>();

    var DisplayDetailsAndTaxabl: DetailsAndTaxabl = new DetailsAndTaxabl();
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

    function Display() {


        $('#viewmail').removeClass('active in');
        $('#sendmail').addClass('active in');

        $('#btnQuotations').removeClass('active');
        $('#btnInvoice').addClass('active');


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

                    Invoice = InvoiceDisplay;


                    //Invoice = InvoiceDisplay.filter(x => x.TrType == 1 && x.CashBoxID != null).sort(function (a, b) { return b.CashBoxID - a.CashBoxID; });
                    //ReportGrid.DataSource = InvQuotation;
                    //ReportGrid.Bind();

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
            { title: "INV.No", name: "TrNo", type: "text", width: "5%" },
            {
                title: "Date",
                width: "5%",
                itemTemplate: (s: string, item: Sls_Ivoice): HTMLLabelElement => {
                    let txt: HTMLLabelElement = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);

                    return txt;
                }
            },
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

        $('#Div_Fillter').addClass('display_none');
        $('#Div_Views').attr('style', 'width: 100% !important;');


        InitalizeComponentInvoice();


        Selected_Data = new Array<Sls_Ivoice>();

        Selected_Data = InvoiceDisplay.filter(x => x.InvoiceID == Number(btnId));

        DisplayData(Selected_Data);

    }
    function DisplayData(Selected_Data: Array<Sls_Ivoice>) {
        debugger

        DocumentActions.RenderFromModel(Selected_Data[0]);


        txtDate.value = DateFormat(Selected_Data[0].TrDate);


        GlobalinvoiceID = Selected_Data[0].InvoiceID;
        CustomerId = Selected_Data[0].CustomerId;
        $('#TrNo').html('رقم الفاتوره ( ' + Selected_Data[0].TrNo.toString() + ' )')
        txtRFQ.value = Selected_Data[0].RefNO;
        txtCompanysales.value = Selected_Data[0].CustomerName;
        txtRemark.value = Selected_Data[0].Remark;
        GetCustomer();
        ddlCurreny.value = setVal(Selected_Data[0].InvoiceCurrenyID.toString());
        ddlTypePay.value = Selected_Data[0].IsCash == false ? '0' : '1';
        ddlStatas.value = setVal(Selected_Data[0].Status);
        ddlTypeInv.value = setVal(Selected_Data[0].DocType);
        txtTaxPrc.value = setVal(Selected_Data[0].RoundingAmount);
  
         
        txtTotal.value = setVal(Selected_Data[0].TotalAmount);
        txtNet.value = setVal(Selected_Data[0].NetAfterVat);
        txtTax.value = setVal(Selected_Data[0].VatAmount);
        txtTotalDiscount.value = setVal(Selected_Data[0].ItemDiscountTotal);

         
        ////-------------------------(T E R M S & C O N D I T I O N S)-----------------------------------------------     

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetSlsInvoiceItem"),
            data: { invoiceID: GlobalinvoiceID },
            success: (d) => {//(int CompCode, string StartDate, string EndDate, int Status, int? CustId, string SalesUser, string UserCode, string Token)
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    DisplayDetailsAndTaxabl = result.Response as DetailsAndTaxabl;

                    InvItemsDetailsModel = DisplayDetailsAndTaxabl.IQ_Sls_InvoiceDetail_Tax;
                    CountGrid = 0;
                    $("#Table_Data").html("");
                    for (let i = 0; i < InvItemsDetailsModel.length; i++) {
                        BuildControls(i);
                        Display_GridConrtol(i);
                        CountGrid++;
                    }

                    let tax = DisplayDetailsAndTaxabl.taxableItem;



                    ddlValueTax.value = tax[0].taxType;

                    let ValueTax = ddlValueTax.value;
                    let TaxT1 = TaxType.filter(x => x.StdCode == ValueTax)

                    $('#ddlTypeTax').html('')
                    for (var i = 0; i < TaxT1.length; i++) {
                        $('#ddlTypeTax').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
                    }

                    ddlTypeTax.value = tax[0].subType;

                 

                    if (tax.length > 1) {
                        ddlDisTax.value = tax[1].taxType;


                        let DisTax = ddlDisTax.value;
                        let TaxT2 = TaxType.filter(x => x.StdCode == DisTax)

                        $('#ddlTypeDis').html('')
                        for (var i = 0; i < TaxT2.length; i++) {
                            $('#ddlTypeDis').append('<option   value="' + TaxT2[i].SubCode + '">' + TaxT2[i].DescA + '</option>');
                        }

                        if (ddlDisTax.value == 'null') {
                            $('#ddlTypeDis').append('<option value="null"> Choose Tax </option>');
                        }


                        ddlTypeDis.value = tax[1].subType;
                    }




                    ComputeTotals();

                }
            }
        });

    }
    function Display_GridConrtol(cnt) {


        $("#txt_StatusFlag" + cnt).val("");
        $("#InvoiceItemID" + cnt).prop("value", InvItemsDetailsModel[cnt].InvoiceItemID);
        $("#txt_ItemID" + cnt).prop("value", InvItemsDetailsModel[cnt].ItemID);
        $("#txtSerial" + cnt).prop("value", InvItemsDetailsModel[cnt].Serial);
        $("#btnItem" + cnt).html(InvItemsDetailsModel[cnt].description);
        $("#ddlTypeUom" + cnt).prop("value", InvItemsDetailsModel[cnt].UomID);
        $("#txtQuantity" + cnt).prop("value", InvItemsDetailsModel[cnt].SoldQty);
        $("#txtPrice" + cnt).prop("value", InvItemsDetailsModel[cnt].Unitprice);
        $("#txtNetUnitPrice" + cnt).prop("value", InvItemsDetailsModel[cnt].NetUnitPrice); 
        $("#txtDiscountPrc" + cnt).prop("value", InvItemsDetailsModel[cnt].DiscountPrc);
        $("#txtDiscountAmount" + cnt).prop("value", InvItemsDetailsModel[cnt].DiscountAmount);
        $("#txtTax_Rate" + cnt).prop("value", InvItemsDetailsModel[cnt].VatPrc);
        $("#txtTax_Rate" + cnt).prop("value", InvItemsDetailsModel[cnt].VatPrc);
        $("#txtTax" + cnt).prop("value", InvItemsDetailsModel[cnt].VatAmount);
        totalRow(cnt, true);
    }

    function GetCustomer() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetCustomer"),
            data: { ID: Selected_Data[0].CustomerId },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CustomerDetailnew = result.Response as Array<receiver>;
                    txtCompanyname.value = CustomerDetailnew[0].name;
                    $('#btnCustSrch').attr('disabled', 'disabled');
                    $('#txtCompanyname').attr('disabled', 'disabled');
                }
            }
        });
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
    var ItemDetail: Array<Items> = new Array<Items>();
    var I_D_UOMDetails: Array<I_D_UOM> = new Array<I_D_UOM>();
    var I_D_CURRENCYDetails: Array<G_Currency> = new Array<G_Currency>();
    var G_CodesDetails: Array<G_Codes> = new Array<G_Codes>();
    var TaxableModel: Array<TaxableItem> = new Array<TaxableItem>();
    var TaxableSinglModel: TaxableItem = new TaxableItem();

    var CountGrid = 0;
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.CompCode;
    var btnAddDetails: HTMLButtonElement;
    var btnsave: HTMLButtonElement;
    var btnClean: HTMLButtonElement;
    var CustomerId: number = 0;
    var btnCustSrch: HTMLButtonElement;
    var btnprint: HTMLButtonElement;
    var invoiceID: number = 0;
    var txtDate: HTMLInputElement;
    var txtRFQ: HTMLInputElement;
    var ddlTypeInv: HTMLInputElement;
    var ddlTypePay: HTMLInputElement;
    var txtCompanysales: HTMLInputElement;
    var txtCompanyname: HTMLInputElement;

    var txtRemark: HTMLInputElement;  

    var txtTaxPrc: HTMLInputElement;
    var txtItemCount: HTMLInputElement;
    var txtPackageCount: HTMLInputElement;
    var txtTotalDiscount: HTMLInputElement;
    var txtTotalbefore: HTMLInputElement;
    var txtTotal: HTMLInputElement;
    var txtTax: HTMLInputElement;
    var txtNet: HTMLInputElement;



    var ddlStatas: HTMLSelectElement;
    var ddlCurreny: HTMLSelectElement;
    var ddlValueTax: HTMLSelectElement;
    var ddlTypeTax: HTMLSelectElement;
    var ddlDisTax: HTMLSelectElement;
    var ddlTypeDis: HTMLSelectElement;

    var include = "";
    var Tax;
    var TaxType;
    var include = "";

    export function InitalizeComponentInvoice() {

        //alert(SysSession.CurrentEnvironment.issuer.buildingNumber)

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControlsInvoice();
        InitalizeEventsInvoice();
        FillddlUom();
        AddNewRow();
        FillddlCurreny();
        FillddlG_Codes();
        txtDate.value = GetDate();

        ddlCurreny.value = "4";
    }
    function InitalizeControlsInvoice() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnCustSrch = document.getElementById("btnCustSrch") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnClean = document.getElementById("btnClean") as HTMLButtonElement;
        btnprint = document.getElementById("btnprint") as HTMLButtonElement;
        // inputs
        ddlStatas = document.getElementById("ddlStatas") as HTMLSelectElement;
        ddlCurreny = document.getElementById("ddlCurreny") as HTMLSelectElement;
        ddlValueTax = document.getElementById("ddlValueTax") as HTMLSelectElement;
        ddlTypeTax = document.getElementById("ddlTypeTax") as HTMLSelectElement;
        ddlDisTax = document.getElementById("ddlDisTax") as HTMLSelectElement;
        ddlTypeDis = document.getElementById("ddlTypeDis") as HTMLSelectElement;

        txtDate = document.getElementById("txtDate") as HTMLInputElement;
        txtRFQ = document.getElementById("txtRFQ") as HTMLInputElement;
        ddlTypeInv = document.getElementById("ddlTypeInv") as HTMLInputElement;
        ddlTypePay = document.getElementById("ddlTypePay") as HTMLInputElement;
        txtCompanysales = document.getElementById("txtCompanysales") as HTMLInputElement;
        txtCompanyname = document.getElementById("txtCompanyname") as HTMLInputElement;

        txtRemark = document.getElementById("txtRemark") as HTMLInputElement;  

        txtTaxPrc = document.getElementById("txtTaxPrc") as HTMLInputElement;
        txtItemCount = document.getElementById("txtItemCount") as HTMLInputElement;
        txtPackageCount = document.getElementById("txtPackageCount") as HTMLInputElement;
        txtTotalDiscount = document.getElementById("txtTotalDiscount") as HTMLInputElement;
        txtTotalbefore = document.getElementById("txtTotalbefore") as HTMLInputElement;
        txtTotal = document.getElementById("txtTotal") as HTMLInputElement;
        txtTax = document.getElementById("txtTax") as HTMLInputElement;
        txtNet = document.getElementById("txtNet") as HTMLInputElement;



    }
    function InitalizeEventsInvoice() {

        btnAddDetails.onclick = AddNewRow;//
        btnCustSrch.onclick = btnCustSrch_onClick;
        btnsave.onclick = btnsave_onclick;
        btnClean.onclick = btnClean_onclick;
        //btnprint.onclick = btnprint_onclick;
        ddlValueTax.onchange = ddlValueTax_onchange;
        ddlDisTax.onchange = ddlDisTax_onchange;
        txtTaxPrc.onkeyup = txtTaxPrc_onchange;
    }
    function txtTaxPrc_onchange() {

        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                totalRow(i, true);
            }
        }

    }
    function ddlDisTax_onchange() {

        let DisTax = ddlDisTax.value;
        let TaxT1 = TaxType.filter(x => x.StdCode == DisTax)

        $('#ddlTypeDis').html('')
        for (var i = 0; i < TaxT1.length; i++) {
            $('#ddlTypeDis').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
        }

        if (ddlDisTax.value == 'null') {
            $('#ddlTypeDis').append('<option value="null"> Choose Tax </option>');
        }
    }
    function ddlValueTax_onchange() {
        let ValueTax = ddlValueTax.value;
        let TaxT1 = TaxType.filter(x => x.StdCode == ValueTax)

        $('#ddlTypeTax').html('')
        for (var i = 0; i < TaxT1.length; i++) {
            $('#ddlTypeTax').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
        }


    }
    function FillddlCurreny() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllCurreny"),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    I_D_CURRENCYDetails = result.Response as Array<G_Currency>;
                    DocumentActions.FillCombowithdefult(I_D_CURRENCYDetails, ddlCurreny, "CurrencyID", "DescA", "اختار العمله");
                }
            }
        });
    }

    function FillddlG_Codes() {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllG_Codes"),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    G_CodesDetails = result.Response as Array<G_Codes>;

                    Tax = G_CodesDetails.filter(x => x.CodeType == 'Taxtypes')
                    TaxType = G_CodesDetails.filter(x => x.CodeType == 'TaxSubtypes')
                    let TaxT1 = TaxType.filter(x => x.StdCode == 'T1')

                    $('#ddlValueTax').html('')
                    $('#ddlTypeTax').html('')

                    for (var i = 0; i < Tax.length; i++) {
                        $('#ddlValueTax').append('<option  value="' + Tax[i].StdCode + '">' + Tax[i].DescA + '</option>');
                        $('#ddlDisTax').append('<option  value="' + Tax[i].StdCode + '">' + Tax[i].DescA + '</option>');
                    }

                    for (var i = 0; i < TaxType.length; i++) {

                        $('#ddlTypeDis').append('<option   value="' + TaxType[i].SubCode + '">' + TaxType[i].DescA + '</option>');

                    }

                    for (var i = 0; i < TaxT1.length; i++) {
                        $('#ddlTypeTax').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
                    }



                    $('#ddlValueTax').val('T1')
                    $('#ddlTypeTax').val('V009')

                }
            }
        });
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

    function btnCustSrch_onClick() {
        sys.FindKey(Modules.Quotation, "btnCustSrch", "", () => {

            CustomerDetail = SearchGrid.SearchDataGrid.SelectedKey;
            console.log(CustomerDetail);
            CustomerId = Number(CustomerDetail[0]);
            txtCompanyname.value = String(CustomerDetail[2]);

        });
    }
    function BuildControls(cnt: number) {
        var html;

        html = '<tr id= "No_Row' + cnt + '" class="  animated zoomIn ">' +

            '<td><button id="btn_minus' + cnt + '" type="button" class="btn btn-custon-four btn-danger"><i class="fa fa-minus-circle"></i></button></td>' +
            '<td><input  id="txtSerial' + cnt + '" disabled="disabled"  type="text" class="form-control" placeholder="SR"></td>' +
            '<td><button id="btnItem' + cnt + '" class="btn btn-custon-four btn-success oo"  style="height:34px;width: 235px;background-color: #3bafda;font-weight: bold;font-size: 18px;"  > بحـث الصنــف </button></td>' +
            //'<td> <textarea id="Description' + cnt + '" name="Description" type="text" class="form-control" style="height:34px" placeholder="Description" spellcheck="false"></textarea></td>' +
            '<td><select id="ddlTypeUom' + cnt + '" class="form-control"> <option value="null"> أختر الوحده  </option></select></td>' +
            '<td><input  id="txtQuantity' + cnt + '" type="number" class="form-control" placeholder="الكميه"></td>' +
            '<td><input  id="txtPrice' + cnt + '" value="0" type="number" class="form-control" placeholder="السعر  "></td>' +
            '<td><input  id="txtDiscountPrc' + cnt + '" value="0" type="number" class="form-control" placeholder="الخصم%"></td>' +
            '<td><input  id="txtDiscountAmount' + cnt + '" value="0" type="number" class="form-control" placeholder="مبلغ الخصم"></td>' +
            '<td><input  id="txtNetUnitPrice' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="السعر بعد الخصم "></td>' +
            '<td><input  id="txtTotal' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="الاجمالي  "></td>' +
            '<td><input  id="txtTax_Rate' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="   نسبة الضريبه  "></td>' +
            '<td><input  id="txtTax' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="الضريبه "></td>' +
            '<td><input  id="txtTotAfterTax' + cnt + '" type="number" disabled="disabled" value="0" class="form-control" placeholder="الصافي"></td>' +
            ' <input  id="txt_StatusFlag' + cnt + '" type="hidden" class="form-control"> ' +
            ' <input  id="txt_ItemID' + cnt + '" type="hidden" class="form-control"> ' +
            ' <input  id="InvoiceItemID' + cnt + '" type="hidden" class="form-control"> ' +
            '</tr>';
        $("#Table_Data").append(html);

        for (var i = 0; i < I_D_UOMDetails.length; i++) {


            $('#ddlTypeUom' + cnt + '').append('<option  value="' + I_D_UOMDetails[i].UomID + '">' + I_D_UOMDetails[i].DescA + '</option>');

        }

        $('#btnItem' + cnt).click(function (e) {

            sys.FindKey(Modules.Quotation, "btnItem", "", () => {

                ItemDetail = SearchGrid.SearchDataGrid.SelectedKey;
                console.log(ItemDetail);


                let ItemID = Number(ItemDetail[0]);
                let description = String(ItemDetail[1]);
                let UnitCode = String(ItemDetail[2]);

                $('#btnItem' + cnt).html(description)
                $('#txt_ItemID' + cnt).val(ItemID)
                $('#ddlTypeUom' + cnt).val(UnitCode)
                $('#ddlTypeUom' + cnt).val(UnitCode)
                $('#QTY' + cnt).val('1')


                totalRow(cnt, true);
            });
        });

        $("#txtPrice" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            totalRow(cnt, true);
        });
        $("#txtQuantity" + cnt).on('keyup', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            totalRow(cnt, true);
        });


        $("#txtDiscountPrc" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            if (Number($("#txtDiscountPrc" + cnt).val()) < 0 || $("#txtDiscountPrc" + cnt).val().trim() == "") {
                $("#txtDiscountPrc" + cnt).val("0");
            }
            if (Number($("#DiscountPrc" + cnt).val()) > 100) {
                $("#txtDiscountPrc" + cnt).val("100");
            }

            totalRow(cnt, true);
        });
        $("#txtDiscountAmount" + cnt).on('keyup', function () {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            let txtPrice = Number($("#txtPrice" + cnt).val());
            let txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());

            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));

            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));


            totalRow(cnt, false);

        });




        $("#btn_minus" + cnt).click(function (e) {

            DeleteRow(cnt);
        });

        return;
    }
    function totalRow(cnt: number, flagDiscountAmount: boolean) {
        debugger



        $('#txtTax_Rate' + cnt).val($('#txtTaxPrc').val());


        //$("#txtUnitpriceWithVat" + cnt).val((Number($("#txtPrice" + cnt).val()) * (Tax_Rate + 100) / 100).RoundToNum(2))
        //$("#txtPrice" + cnt).val((Number($("#txtUnitpriceWithVat" + cnt).val()) * 100 / (Tax_Rate + 100)).RoundToSt(2))

        //-------------------------


        let txtPrice = Number($("#txtPrice" + cnt).val());
        let txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());

        if (flagDiscountAmount) {
            $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)).RoundToSt(2));
        }
        else {

            let txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));
        }




        var txtQuantityValue = $("#txtQuantity" + cnt).val();
        var txtPriceValue = $("#txtNetUnitPrice" + cnt).val();



        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        var VatPrc = $("#txtTax_Rate" + cnt).val();
        var vatAmount = Number(total) * VatPrc / 100;
        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
        var total = Number(txtQuantityValue) * Number(txtPriceValue);
        $("#txtTotal" + cnt).val(total.RoundToSt(2));

        var totalAfterVat = Number(vatAmount.RoundToSt(2)) + Number(total.RoundToSt(2));
        $("#txtTotAfterTax" + cnt).val(totalAfterVat.RoundToSt(2));



        ComputeTotals();


    }

    function ComputeTotals() {
        debugger
        let PackageCount = 0;
        let CountTotal = 0;
        let TotalDiscount = 0;
        let Totalbefore = 0;
        let TaxCount = 0;
        let NetCount = 0;
        let CountItems = 0;
        for (let i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                PackageCount += Number($("#txtQuantity" + i).val());
                PackageCount = Number(PackageCount.RoundToSt(2).toString());

                Totalbefore += (Number($("#txtQuantity" + i).val()) * Number($("#txtPrice" + i).val()));
                Totalbefore = Number(Totalbefore.RoundToSt(2).toString());

                TotalDiscount += (Number($("#txtQuantity" + i).val()) * Number($("#txtDiscountAmount" + i).val()));
                TotalDiscount = Number(TotalDiscount.RoundToSt(2).toString());

                CountTotal += Number($("#txtTotal" + i).val());
                CountTotal = Number(CountTotal.RoundToSt(2).toString());

                TaxCount += Number($("#txtTax" + i).val());
                TaxCount = Number(TaxCount.RoundToSt(2).toString());

                NetCount += Number($("#txtTotAfterTax" + i).val());

                CountItems++;
            }
        }
        txtItemCount.value = CountItems.toString();
        txtPackageCount.value = PackageCount.toString();
        txtTotalDiscount.value = TotalDiscount.toString();
        txtTotalbefore.value = Totalbefore.toString();
        txtTotal.value = CountTotal.toString();
        txtTax.value = TaxCount.toString();
        txtNet.value = (Number(NetCount.RoundToSt(2))).RoundToSt(2);
    }
    function AddNewRow() {
        $('paginationSwitch').addClass("display_none");
        $('.no-records-found').addClass("display_none");



        BuildControls(CountGrid);
        $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
        CountGrid++;
        Insert_Serial();


    }
    function Validation_Grid(rowcount: number) {

        var Qty: number = Number($("#txtQuantity" + rowcount).val());
        var Price: number = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        } else {

            if ($("#txt_ItemID" + rowcount).val() == "" || $("#txt_ItemID" + rowcount).val() == "0" || $("#txt_ItemID" + rowcount).val() == null) {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the type", MessageType.Error);
                Errorinput($("#btnItem" + rowcount));
                return false
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false
            }
            return true;
        }
    }
    function DeleteRow(RecNo: number) {

        WorningMessage("Do you want to delete?", "Do you want to delete?", "warning", "warning", () => {
            $("#txt_StatusFlag" + RecNo).val() == 'i' ? $("#txt_StatusFlag" + RecNo).val('m') : $("#txt_StatusFlag" + RecNo).val('d');

            ComputeTotals();
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

        let Chack_Flag = false;
        let flagval = "";
        let Ser = 1;
        for (let i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
            }
        }

    }

    function Assign() {
        var StatusFlag: String;
        InvoiceModel = new Sls_Ivoice();
        InvoiceItemsDetailsModel = new Array<Sls_InvoiceDetail>();
        MasterDetailsModel = new SlsInvoiceMasterDetails();
        TaxableModel = new Array<TaxableItem>();



        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;

        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;

        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);

        InvoiceModel.TrType = 0//0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1   // 1 from store 2 from van  
        InvoiceModel.StoreId = $('#ddlStore').val();//main store
        InvoiceModel.PaymentMeansTypeCode = ddlTypePay.value == '0' ? 2 : 1; //  Cash or   Credit
        if (ddlTypePay.value == "0") {
            InvoiceModel.IsCash = false;
        } else {
            InvoiceModel.IsCash = true;
        }

        InvoiceModel.DocType = ddlTypeInv.value;
        ///////////////
        debugger
        InvoiceModel.TrNo = Number(Selected_Data[0].TrNo);
        InvoiceModel.InvoiceID = Selected_Data[0].InvoiceID;
        InvoiceModel.StoreId = 1;
        InvoiceModel.TrDate = txtDate.value;
        InvoiceModel.CommitionAmount = 0;
        InvoiceModel.Remark = txtRemark.value;
        InvoiceModel.CardAmount = 0;
        InvoiceModel.CashAmount = Number(txtNet.value);
        InvoiceModel.CustomerName = txtCompanysales.value;
        InvoiceModel.TaxCurrencyID = Number(ddlCurreny.value);
        InvoiceModel.InvoiceCurrenyID = Number(ddlCurreny.value);
        InvoiceModel.RoundingAmount = Number($('#txtTaxPrc').val());
        //InvoiceModel.CardAmount = $('#txtCardMoney').val().trim() == '' ? 0 : $('#txtCardMoney').val();
        //InvoiceModel.CashAmount = $('#txtCashMoney').val().trim() == '' ? 0 : $('#txtCashMoney').val();
        //InvoiceModel.TaxCurrencyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        //InvoiceModel.InvoiceCurrenyID = Number(SysSession.CurrentEnvironment.I_Control[0].Currencyid);
        InvoiceModel.InvoiceTypeCode = Number(SysSession.CurrentEnvironment.InvoiceTypeCode);


        InvoiceModel.TotalAmount = Number(txtTotal.value);
        InvoiceModel.NetAfterVat = Number(txtNet.value);
        InvoiceModel.VatAmount = Number(txtTax.value);
        InvoiceModel.ItemDiscountTotal = Number(txtTotalDiscount.value);




        InvoiceModel.Status = 0;


        // Details
        for (var i = 0; i < CountGrid; i++) {
            invoiceItemSingleModel = new Sls_InvoiceDetail();
            StatusFlag = $("#txt_StatusFlag" + i).val();

            invoiceItemSingleModel.Name_Item = $("#txtServiceName" + i).val();
            invoiceItemSingleModel.MinUnitPrice = Number($('option:selected', $("#ddlTypeUom" + i)).attr('data-minprice'));



            if (StatusFlag == "i") {
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                //invoiceItemSingleModel.StockSoldQty = Number($('option:selected', $("#ddlTypeUom" + i)).attr('data-onhandqty'));//
                invoiceItemSingleModel.StockSoldQty = Number($('#txtQuantity' + i).val());//
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                //----------------------------------------------------- 
                invoiceItemSingleModel.UomID = Number($("#ddlTypeUom" + i).val());
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = Number($("#ddlTypeUom" + i).val());
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------

                invoiceItemSingleModel.VatPrc = $("#txtTax_Rate" + i).val();
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);

            }
            if (StatusFlag == "u") {
                var invoiceItemId = $("#InvoiceItemID" + i).val()
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = Number($('#txtQuantity' + i).val());//
                invoiceItemSingleModel.NetUnitPrice = $("#txtNetUnitPrice" + i).val();
                invoiceItemSingleModel.Unitprice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.UnitpriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.DiscountPrc = $("#txtDiscountPrc" + i).val();
                invoiceItemSingleModel.DiscountAmount = $("#txtDiscountAmount" + i).val();
                //-----------------------------------------------------
                invoiceItemSingleModel.UomID = Number($("#ddlTypeUom" + i).val());
                invoiceItemSingleModel.NetUnitPriceWithVat = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQty = 1;
                invoiceItemSingleModel.BaseQtyPrice = $("#txtPrice" + i).val();
                invoiceItemSingleModel.BaseQtyUomid = Number($("#ddlTypeUom" + i).val());
                invoiceItemSingleModel.ChargeVatNatID = null;
                invoiceItemSingleModel.DiscountVatNatID = null;
                invoiceItemSingleModel.ChargeCode = null;
                //-----------------------------------------------------

                let VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
                invoiceItemSingleModel.VatPrc = $("#txtTax_Rate" + i).val();
                invoiceItemSingleModel.VatAmount = $("#txtTax" + i).val();
                invoiceItemSingleModel.ItemTotal = invoiceItemSingleModel.Unitprice * invoiceItemSingleModel.SoldQty;
                invoiceItemSingleModel.TotRetQty = $("#txtReturnQuantity" + i).val();
                invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
            if (StatusFlag == "d") {
                if ($("#InvoiceItemID" + i).val() != "") {
                    var deletedID = $("#InvoiceItemID" + i).val();
                    invoiceItemSingleModel.StatusFlag = StatusFlag.toString();
                    invoiceItemSingleModel.InvoiceItemID = deletedID;
                    InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
                }
            }
        }


        TaxableSinglModel.InvoiceID = 0
        TaxableSinglModel.subType = ddlTypeTax.value
        TaxableSinglModel.taxType = ddlValueTax.value
        TaxableModel.push(TaxableSinglModel);


        if (ddlDisTax.value != 'null' && ddlTypeDis.value != 'null') {

            TaxableSinglModel.InvoiceID = 0
            TaxableSinglModel.subType = ddlTypeDis.value
            TaxableSinglModel.taxType = ddlDisTax.value
            TaxableModel.push(TaxableSinglModel);
        }


        MasterDetailsModel.Sls_Ivoice = InvoiceModel;
        MasterDetailsModel.Sls_InvoiceDetail = InvoiceItemsDetailsModel;
        MasterDetailsModel.TaxableItem = TaxableModel;

    }

    function insert() {
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
        btnClean_onclick();
        txtDate.value = GetDate();
        CountGrid = 0;
        CustomerId = 0;
        invoiceID = 0;
        txtRFQ.value = "";
        txtCompanysales.value = "";
        txtCompanyname.value = "";
        txtRemark.value = "";  

        txtItemCount.value = "";
        txtPackageCount.value = "";
        txtTotalDiscount.value = "";
        txtTotalbefore.value = "";
        txtTotal.value = "";
        txtTax.value = "";
        txtNet.value = "";


        $("#Table_Data").html("");
        AddNewRow();
         
        Display();

        btnClean_onclick();

    }
    function validation() {

        let count = 0;
        for (var i = 0; i < CountGrid; i++) {
            let StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag != "m" && StatusFlag != "d") {
                count++;
            }
        }

        if (txtDate.value.trim() == "") {
            Errorinput(txtDate);
            DisplayMassage('برجاء ادخال التاريخ', 'Date must be entered', MessageType.Error);
            return false;
        }
        if (txtCompanyname.value.trim() == "") {
            Errorinput(txtCompanyname);
            DisplayMassage('برجاء ادخال العميل', 'Company must be choosed', MessageType.Error);
            return false;
        }
        if (txtCompanysales.value.trim() == "") {
            Errorinput(txtCompanysales);
            DisplayMassage('  برجاء ادخال اسم البائع', ' RFQ must be entered', MessageType.Error);
            return false;
        }

        if (count == 0) {
            Errorinput(btnAddDetails);
            DisplayMassage('يجب ادخال  بينات الفاتوره', 'يجب ادخال  بينات الفاتوره', MessageType.Error);
            return false;
        }
        //if (txtsalesVAT.value.trim() == "") {
        //    Errorinput(txtsalesVAT);
        //    DisplayMassage('Vat include or not must be entered', ' Vat include or not must be entered', MessageType.Error);
        //    return false;
        //}
        //if (txtfirstdays.value.trim() == "") {
        //    Errorinput(txtfirstdays);
        //    DisplayMassage('days starting from the delivery date must be entered', 'days starting from the delivery date must be entered', MessageType.Error);
        //    return false;
        //}
        //if (txtsecounddays.value.trim() == "") {
        //    Errorinput(txtsecounddays);
        //    DisplayMassage('Offer validity days from offer date must be entered', ' Offer validity days from offer date must be entered', MessageType.Error);
        //    return false;
        //}
        //if (txtlastdays.value.trim() == "") {
        //    Errorinput(txtlastdays);
        //    DisplayMassage('Place of delivery must be entered', ' Place of delivery must be entered', MessageType.Error);
        //    return false;
        //}
        return true;
    }
    function btnsave_onclick() {

        if (!validation()) return

        let CanAdd: boolean = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            insert();
        }

    }
    function btnClean_onclick() {

        $('#viewmail').removeClass('active in');
        $('#sendmail').addClass('active in');
        $('#composemail').removeClass('active in');

        $('#btnQuotations').addClass('active');
        $('#btnInvoice').removeClass('active');

        $('#Div_Fillter').removeClass('display_none');
        $('#Div_Views').attr('style', '');

        CountGrid = 0;
        $("#Table_Data").html("");
        AddNewRow();
    }

    //----------------------------------------------------------------------------------------------------





}












