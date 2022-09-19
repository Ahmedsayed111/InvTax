$(document).ready(function () {
    QuotationView.InitalizeComponent();
});
var QuotationView;
(function (QuotationView) {
    var sys = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession = GetSystemSession(Modules.QuotationView);
    var InvItemsDetailsModel = new Array();
    var Selected_Data = new Array();
    var InvoiceDisplay = new Array();
    var SearchDetails = new Array();
    var Selecteditem = new Array();
    var Invoice = new Array();
    var InvQuotation = new Array();
    var I_D_UOMDetails = new Array();
    var CustomerDetailnew = new Array();
    var DisplayDetailsAndTaxabl = new DetailsAndTaxabl();
    var btnCustSrchFilter;
    var btnFilter;
    var btnRefrash;
    var btnReturn;
    var btnPur;
    var btnAdd;
    var btnInvoice;
    var FromDate;
    var ToDate;
    var Txt_Search;
    var txtCompanynameFilter;
    var txtRFQFilter;
    var ddlStatasFilter;
    var txtTypeInv;
    var ReportGridPur = new JsGrid();
    var ReportGridRet = new JsGrid();
    var ReportGridInv = new JsGrid();
    var CustomerId = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode;
    var GlobalinvoiceID = 0;
    var RFQFilter;
    var FromDat;
    var ToDat;
    var Return_Falg = false;
    function InitalizeComponent() {
        debugger;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        InitializeGridInvoice();
        InitializeGridReturnAndAdd();
        InitializeGridPur();
        FromDate.value = DateStartMonth();
        ToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        txtTypeInv.value = "I";
        Display("I");
        FillddlUom();
    }
    QuotationView.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnCustSrchFilter = document.getElementById("btnCustSrchFilter");
        btnFilter = document.getElementById("btnFilter");
        btnRefrash = document.getElementById("btnRefrash");
        btnInvoice = document.getElementById("btnInvoice");
        btnReturn = document.getElementById("btnReturn");
        btnPur = document.getElementById("btnPur");
        btnAdd = document.getElementById("btnAdd");
        Txt_Search = document.getElementById("Txt_Search");
        txtCompanynameFilter = document.getElementById("txtCompanynameFilter");
        ddlStatasFilter = document.getElementById("ddlStatasFilter");
        txtRFQFilter = document.getElementById("txtRFQFilter");
        txtTypeInv = document.getElementById("txtTypeInv");
        ToDate = document.getElementById("ToDate");
        FromDate = document.getElementById("FromDate");
    }
    function InitalizeEvents() {
        btnCustSrchFilter.onclick = btnCust_onClick;
        btnFilter.onclick = btnFilter_onclick;
        btnRefrash.onclick = btnRefrash_onclick;
        txtCompanynameFilter.onchange = txtCompanynameFilter_ochange;
        Txt_Search.onkeyup = _SearchBox_Change;
        btnInvoice.onclick = function () { Display('I'); txtTypeInv.value = "I"; };
        btnReturn.onclick = function () { Display('C'); txtTypeInv.value = "C"; };
        btnAdd.onclick = function () { Display('D'); txtTypeInv.value = "D"; };
        btnPur.onclick = function () { Display('P'); txtTypeInv.value = "P"; };
    }
    function txtCompanynameFilter_ochange() {
        txtCompanynameFilter.value = "";
        CustomerId = 0;
    }
    function btnRefrash_onclick() {
        CustomerId = 0;
        txtCompanynameFilter.value = '';
        txtRFQFilter.value = '';
        ddlStatasFilter.value = 'null';
        FromDate.value = DateStartMonth();
        ToDate.value = ConvertToDateDash(GetDate()) <= ConvertToDateDash(SysSession.CurrentEnvironment.EndDate) ? GetDate() : SysSession.CurrentEnvironment.EndDate;
        Display(txtTypeInv.value);
    }
    function btnFilter_onclick() {
        Display(txtTypeInv.value);
    }
    function Display(TypeInv) {
        Txt_Search.value = '';
        $('#sendmail').addClass('active in');
        RFQFilter = txtRFQFilter.value;
        FromDat = FromDate.value;
        ToDat = ToDate.value;
        var Status = ddlStatasFilter.value == 'null' ? '' : ddlStatasFilter.value;
        $("#ReportGrid").jsGrid("option", "pageIndex", 1);
        $('#sendmail').attr('class', '');
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SlsTrSales", "GetAllSlsInvoice"),
            data: { CompCode: compcode, BranchCode: BranchCode, TypeInv: TypeInv, Status: Status, CustomerId: CustomerId, RFQFilter: RFQFilter, StartDate: FromDat, EndDate: ToDat },
            success: function (d) {
                debugger;
                var result = d;
                if (result.IsSuccess) {
                    Invoice = result.Response;
                    InvoiceDisplay = Invoice;
                    if (TypeInv == 'I') {
                        ReportGridInv.DataSource = Invoice;
                        ReportGridInv.Bind();
                        $('#Title_Inv').html('عـرض فواتير المبيعات');
                        $('#btnAdd').removeClass('active');
                        $('#btnReturn').removeClass('active');
                        $('#btnInvoice').addClass('active');
                        $('#btnPur').removeClass('active');
                    }
                    if (TypeInv == 'C') {
                        ReportGridRet.DataSource = Invoice;
                        ReportGridRet.Bind();
                        $('#Title_Inv').html('عـرض فواتير المرتجعات');
                        $('#btnAdd').removeClass('active');
                        $('#btnReturn').addClass('active');
                        $('#btnInvoice').removeClass('active');
                        $('#btnPur').removeClass('active');
                    }
                    if (TypeInv == 'D') {
                        ReportGridRet.DataSource = Invoice;
                        ReportGridRet.Bind();
                        $('#Title_Inv').html('عـرض فواتير أضافه');
                        $('#btnAdd').addClass('active');
                        $('#btnReturn').removeClass('active');
                        $('#btnInvoice').removeClass('active');
                        $('#btnPur').removeClass('active');
                    }
                    if (TypeInv == 'P') {
                        ReportGridPur.DataSource = Invoice;
                        ReportGridPur.Bind();
                        $('#Title_Inv').html('عـرض فواتير المشتريات');
                        $('#btnAdd').removeClass('active');
                        $('#btnReturn').removeClass('active');
                        $('#btnInvoice').removeClass('active');
                        $('#btnPur').addClass('active');
                    }
                    $('.jsgrid-header-scrollbar').removeClass("jsgrid-grid-header");
                    var TotalAmount = 0;
                    var TotalQty = 0;
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
                    $('#sendmail').attr('class', 'tab-pane animated zoomInDown zoomInDown  fade shadow-reset custom-inbox-message shadow-reset active in');
                }
            }
        });
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
        ReportGridInv.OnItemEditing = function () { };
        ReportGridInv.Columns = [
            { title: "الرقم", name: "InvoiceID", type: "text", width: "5%", visible: false },
            { title: "رقم الفاتوره", name: "TrNo", type: "text", width: "5%" },
            { title: "رقم المرجع", name: "RefNO", type: "text", width: "5%" },
            {
                title: "التاريخ",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: "الصافــي  ", name: "NetAfterVat", type: "text", width: "10%" },
            {
                title: "الحاله",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    if (item.Status == 0) {
                        txt.innerHTML = 'جديد';
                    }
                    if (item.Status == 1) {
                        txt.innerHTML = 'صحيحه';
                    }
                    if (item.Status == 2) {
                        txt.innerHTML = 'غير صحيحه';
                    }
                    if (item.Status == 3) {
                        txt.innerHTML = 'ملغي';
                    }
                    return txt;
                }
            },
            {
                title: "رفـع الفاتوره",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("رفـع");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-primary input-sm style_but_Grid";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        alert('تحت الانشاء');
                    };
                    return txt;
                }
            },
            {
                title: "عـرض",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("عـرض");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-warning input-sm style_but_Grid";
                    txt.onclick = function (e) {
                        PrintInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
            {
                title: "تعديــل",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("تعديــل");
                    txt.id = "butEidt" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-success input-sm Inv Done style_but_Grid";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        $('#title_Edit').html('Eidt Invoice');
                        EidtInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
            {
                title: "الغـاء",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("الغـاء");
                    txt.id = "butDelete" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-danger style_but_Grid ";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        DeleteInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
            {
                title: "مرتجع",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("مرتجـع");
                    txt.id = "butDelete" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-danger style_but_Grid ret ";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        ReturnORAddInvoice(item.InvoiceID, 'C');
                    };
                    return txt;
                }
            },
            {
                title: "أضافه",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("أضافــه");
                    txt.id = "butDelete" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-danger style_but_Grid Add ";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        ReturnORAddInvoice(item.InvoiceID, 'D');
                    };
                    return txt;
                }
            },
        ];
        ReportGridInv.Bind();
    }
    function InitializeGridReturnAndAdd() {
        //let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
        ReportGridRet.OnRowDoubleClicked = DoubleClickGridInvoice;
        ReportGridRet.ElementName = "ReportGridInv";
        ReportGridRet.PrimaryKey = "InvoiceID";
        ReportGridRet.Paging = true;
        ReportGridRet.PageSize = 6;
        ReportGridRet.Sorting = true;
        ReportGridRet.InsertionMode = JsGridInsertionMode.Binding;
        ReportGridRet.Editing = false;
        ReportGridRet.Inserting = false;
        ReportGridRet.SelectedIndex = 1;
        ReportGridRet.SwitchingLanguageEnabled = false;
        ReportGridRet.OnItemEditing = function () { };
        ReportGridRet.Columns = [
            { title: "الرقم", name: "InvoiceID", type: "text", width: "5%", visible: false },
            { title: "رقم الفاتوره", name: "TrNo", type: "text", width: "5%" },
            { title: "رقم المرجع", name: "RefNO", type: "text", width: "5%" },
            {
                title: "التاريخ",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: "الصافــي  ", name: "NetAfterVat", type: "text", width: "10%" },
            {
                title: "الحاله",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    if (item.Status == 0) {
                        txt.innerHTML = 'جديد';
                    }
                    if (item.Status == 1) {
                        txt.innerHTML = 'صحيحه';
                    }
                    if (item.Status == 2) {
                        txt.innerHTML = 'غير صحيحه';
                    }
                    if (item.Status == 3) {
                        txt.innerHTML = 'ملغي';
                    }
                    return txt;
                }
            },
            {
                title: "رفـع الفاتوره",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("رفـع");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-primary input-sm style_but_Grid";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        alert('تحت الانشاء');
                    };
                    return txt;
                }
            },
            {
                title: "عـرض",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("عـرض");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-warning input-sm style_but_Grid";
                    txt.onclick = function (e) {
                        PrintInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
            {
                title: "تعديــل",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("تعديــل");
                    txt.id = "butEidt" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-success input-sm Inv Done style_but_Grid";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        $('#title_Edit').html('Eidt Invoice');
                        EidtInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
            {
                title: "الغـاء",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("الغـاء");
                    txt.id = "butDelete" + item.InvoiceID;
                    txt.className = "btn btn-custon-four btn-danger style_but_Grid ";
                    if (item.Status != 0) {
                        txt.disabled = true;
                    }
                    txt.onclick = function (e) {
                        DeleteInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
        ];
        ReportGridRet.Bind();
    }
    function InitializeGridPur() {
        //let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
        ReportGridPur.OnRowDoubleClicked = DoubleClickGridInvoice;
        ReportGridPur.ElementName = "ReportGridInv";
        ReportGridPur.PrimaryKey = "InvoiceID";
        ReportGridPur.Paging = true;
        ReportGridPur.PageSize = 6;
        ReportGridPur.Sorting = true;
        ReportGridPur.InsertionMode = JsGridInsertionMode.Binding;
        ReportGridPur.Editing = false;
        ReportGridPur.Inserting = false;
        ReportGridPur.SelectedIndex = 1;
        ReportGridPur.SwitchingLanguageEnabled = false;
        ReportGridPur.OnItemEditing = function () { };
        ReportGridPur.Columns = [
            { title: "الرقم", name: "InvoiceID", type: "text", width: "5%", visible: false },
            { title: "رقم الفاتوره", name: "TrNo", type: "text", width: "5%" },
            { title: "رقم المرجع", name: "RefNO", type: "text", width: "5%" },
            {
                title: "التاريخ",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    txt.innerHTML = DateFormat(item.TrDate);
                    return txt;
                }
            },
            { title: "الصافــي  ", name: "NetAfterVat", type: "text", width: "10%" },
            {
                title: "الحاله",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("label");
                    if (item.Status == 0) {
                        txt.innerHTML = 'جديد';
                    }
                    if (item.Status == 1) {
                        txt.innerHTML = 'صحيحه';
                    }
                    if (item.Status == 2) {
                        txt.innerHTML = 'غير صحيحه';
                    }
                    if (item.Status == 3) {
                        txt.innerHTML = 'ملغي';
                    }
                    return txt;
                }
            },
            {
                title: "عـرض",
                width: "5%",
                itemTemplate: function (s, item) {
                    var txt = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("عـرض");
                    txt.id = "butPrint" + item.InvoiceID;
                    txt.className = "dis src-btn btn btn-warning input-sm style_but_Grid";
                    txt.onclick = function (e) {
                        PrintInvoice(item.InvoiceID);
                    };
                    return txt;
                }
            },
        ];
        ReportGridPur.Bind();
    }
    function DoubleClickGridInvoice() {
        Selecteditem = new Array();
        Selecteditem = InvoiceDisplay.filter(function (x) { return x.InvoiceID == Number(ReportGridInv.SelectedKey); });
        $('#txtCreatedBy').prop("value", Selecteditem[0].CreatedBy);
        $('#txtCreatedAt').prop("value", Selecteditem[0].CreatedAt);
        $('#txtUpdatedBy').prop("value", Selecteditem[0].UpdatedBy);
        $('#txtUpdatedAt').prop("value", Selecteditem[0].UpdatedAt);
    }
    function DisplayData(Selected_Data) {
        debugger;
        DocumentActions.RenderFromModel(Selected_Data[0]);
        txtDate.value = DateFormat(Selected_Data[0].TrDate);
        GlobalinvoiceID = Selected_Data[0].InvoiceID;
        CustomerId = Selected_Data[0].CustomerId;
        $('#TrNo').html('رقم الفاتوره ( ' + Selected_Data[0].TrNo.toString() + ' )');
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    DisplayDetailsAndTaxabl = result.Response;
                    InvItemsDetailsModel = DisplayDetailsAndTaxabl.IQ_Sls_InvoiceDetail_Tax;
                    CountGrid = 0;
                    $("#Table_Data").html("");
                    for (var i_1 = 0; i_1 < InvItemsDetailsModel.length; i_1++) {
                        BuildControls(i_1);
                        Display_GridConrtol(i_1);
                        CountGrid++;
                    }
                    debugger;
                    var tax = DisplayDetailsAndTaxabl.taxableItem;
                    ddlValueTax.value = tax[0].taxType;
                    var ValueTax_1 = ddlValueTax.value;
                    var TaxT1 = TaxType.filter(function (x) { return x.StdCode == ValueTax_1; });
                    $('#ddlTypeTax').html('');
                    for (var i = 0; i < TaxT1.length; i++) {
                        $('#ddlTypeTax').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
                    }
                    ddlTypeTax.value = tax[0].subType;
                    if (tax.length > 1) {
                        ddlDisTax.value = tax[1].taxType;
                        var DisTax_1 = ddlDisTax.value;
                        var TaxT2 = TaxType.filter(function (x) { return x.StdCode == DisTax_1; });
                        $('#ddlTypeDis').html('');
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
        if (Return_Falg == true) {
            $("#txt_StatusFlag" + cnt).val("i");
        }
        else {
            $("#txt_StatusFlag" + cnt).val("");
        }
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
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    CustomerDetailnew = result.Response;
                    txtCompanyname.value = CustomerDetailnew[0].name;
                    $('#btnCustSrch').attr('disabled', 'disabled');
                    $('#txtCompanyname').attr('disabled', 'disabled');
                }
            }
        });
    }
    function ReturnORAddInvoice(btnId, Typ) {
        debugger;
        $('#viewmail').removeClass('active in');
        $('#sendmail').removeClass('active in');
        $('#composemail').addClass('active in');
        $('#btnReturn').removeClass('active');
        $('#btnInvoice').removeClass('active');
        $('#Div_Fillter').addClass('display_none');
        $('#Div_Views').attr('style', 'width: 100% !important;');
        InitalizeComponentInvoice();
        Return_Falg = true;
        Selected_Data = new Array();
        Selected_Data = InvoiceDisplay.filter(function (x) { return x.InvoiceID == Number(btnId); });
        DisplayData(Selected_Data);
        ddlTypeInv.value = Typ;
        ddlStatas.value = "0";
    }
    function EidtInvoice(btnId) {
        debugger;
        $('#viewmail').removeClass('active in');
        $('#sendmail').removeClass('active in');
        $('#composemail').addClass('active in');
        $('#btnReturn').removeClass('active');
        $('#btnInvoice').removeClass('active');
        $('#Div_Fillter').addClass('display_none');
        $('#Div_Views').attr('style', 'width: 100% !important;');
        InitalizeComponentInvoice();
        Selected_Data = new Array();
        Selected_Data = InvoiceDisplay.filter(function (x) { return x.InvoiceID == Number(btnId); });
        DisplayData(Selected_Data);
    }
    function PrintInvoice(btnId) {
        if (!SysSession.CurrentPrivileges.PrintOut)
            return;
        window.open(Url.Action("ReportsPopup", "Home"), "blank");
        localStorage.setItem("result", '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
        var rp = new ReportParameters();
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
        rp.stat = 1;
        debugger;
        Ajax.CallAsync({
            url: Url.Action("PrintQuotation", "GeneralRep"),
            data: rp,
            success: function (d) {
                var result = d;
                localStorage.setItem("result", "" + result + "");
                window.open(Url.Action("ReportsPopup", "Home"), "blank");
                //let result = d.result as string;    
                //window.open(result, "_blank");
            }
        });
    }
    function DeleteInvoice(btnId) {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "DeleteInvoice"),
            data: { InvoiceID: btnId },
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    Display(txtTypeInv.value);
                    //$('#viewmail').removeClass('active in');
                    //$('#sendmail').addClass('active in');
                    //$('#btnReturn').removeClass('active');
                    //$('#btnInvoice').addClass('active');
                }
                else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
    function _SearchBox_Change() {
        //  k//////
        if (Txt_Search.value != "") {
            var search_1 = Txt_Search.value.toLowerCase();
            SearchDetails = InvoiceDisplay.filter(function (x) { return x.TrNo.toString().search(search_1) >= 0 || x.RefNO.toString().search(search_1) >= 0; }
            /*|| x.PortName.toLowerCase().search(search) >= 0*/
            /*  || x.CustomerCODE.toString().search(search) >= 0  || x.CreditLimit.toString().search(search) >= 0 || x.Emp_NameA.toString().search(search) >= 0
              || x.ContactMobile.toString().search(search) >= 0 /*|| x.DueAmount.toString().search(search) >= 0 */ /*|| x.DaysDiff.toString().search(search) >= 0*/ );
        }
        else {
            SearchDetails = InvoiceDisplay;
        }
        if (txtTypeInv.value == 'I') {
            ReportGridInv.DataSource = SearchDetails;
            ReportGridInv.Bind();
            $('#Title_Inv').html('عـرض فواتير المبيعات');
            $('#btnAdd').removeClass('active');
            $('#btnReturn').removeClass('active');
            $('#btnInvoice').addClass('active');
        }
        if (txtTypeInv.value == 'C') {
            ReportGridRet.DataSource = SearchDetails;
            ReportGridRet.Bind();
            $('#Title_Inv').html('عـرض فواتير المرتجعات');
            $('#btnAdd').removeClass('active');
            $('#btnReturn').addClass('active');
            $('#btnInvoice').removeClass('active');
        }
        if (txtTypeInv.value == 'D') {
            ReportGridRet.DataSource = SearchDetails;
            ReportGridRet.Bind();
            $('#Title_Inv').html('عـرض فواتير أضافه');
            $('#btnAdd').addClass('active');
            $('#btnReturn').removeClass('active');
            $('#btnInvoice').removeClass('active');
        }
    }
    function btnCust_onClick() {
        sys.FindKey(Modules.Quotation, "btnCustSrch", "", function () {
            CustomerDetail = SearchGrid.SearchDataGrid.SelectedKey;
            console.log(CustomerDetail);
            CustomerId = Number(CustomerDetail[0]);
            txtCompanynameFilter.value = String(CustomerDetail[2]);
            include = String(CustomerDetail[3]);
        });
    }
    /*@* ---------------------------------------Eidt Invoice------------------------------------------*@*/
    var InvoiceItemsDetailsModel = new Array();
    var invoiceItemSingleModel = new Sls_InvoiceDetail();
    var InvoiceModel = new Sls_Ivoice();
    var MasterDetailsModel = new SlsInvoiceMasterDetails();
    var CustomerDetail = new Array();
    var ItemDetail = new Array();
    var I_D_UOMDetails = new Array();
    var I_D_CURRENCYDetails = new Array();
    var G_CodesDetails = new Array();
    var TaxableModel = new Array();
    var TaxableSinglModel = new TaxableItem();
    var CountGrid = 0;
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode;
    var btnAddDetails;
    var btnsave;
    var btnClean;
    var CustomerId = 0;
    var btnCustSrch;
    var invoiceID = 0;
    var txtDate;
    var txtRFQ;
    var ddlTypeInv;
    var ddlTypePay;
    var txtCompanysales;
    var txtCompanyname;
    var txtRemark;
    var txtTaxPrc;
    var txtItemCount;
    var txtPackageCount;
    var txtTotalDiscount;
    var txtTotalbefore;
    var txtTotal;
    var txtTax;
    var txtNet;
    var ddlStatas;
    var ddlCurreny;
    var ddlValueTax;
    var ddlTypeTax;
    var ddlDisTax;
    var ddlTypeDis;
    var include = "";
    var Tax;
    var TaxType;
    var include = "";
    function InitalizeComponentInvoice() {
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
    QuotationView.InitalizeComponentInvoice = InitalizeComponentInvoice;
    function InitalizeControlsInvoice() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails");
        btnCustSrch = document.getElementById("btnCustSrch");
        btnsave = document.getElementById("btnsave");
        btnClean = document.getElementById("btnClean");
        // inputs
        ddlStatas = document.getElementById("ddlStatas");
        ddlCurreny = document.getElementById("ddlCurreny");
        ddlValueTax = document.getElementById("ddlValueTax");
        ddlTypeTax = document.getElementById("ddlTypeTax");
        ddlDisTax = document.getElementById("ddlDisTax");
        ddlTypeDis = document.getElementById("ddlTypeDis");
        txtDate = document.getElementById("txtDate");
        txtRFQ = document.getElementById("txtRFQ");
        ddlTypeInv = document.getElementById("ddlTypeInv");
        ddlTypePay = document.getElementById("ddlTypePay");
        txtCompanysales = document.getElementById("txtCompanysales");
        txtCompanyname = document.getElementById("txtCompanyname");
        txtRemark = document.getElementById("txtRemark");
        txtTaxPrc = document.getElementById("txtTaxPrc");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotalDiscount = document.getElementById("txtTotalDiscount");
        txtTotalbefore = document.getElementById("txtTotalbefore");
        txtTotal = document.getElementById("txtTotal");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
    }
    function InitalizeEventsInvoice() {
        btnAddDetails.onclick = AddNewRow; //
        btnCustSrch.onclick = btnCustSrch_onClick;
        btnsave.onclick = btnsave_onclick;
        btnClean.onclick = btnClean_onclick;
        ddlValueTax.onchange = ddlValueTax_onchange;
        ddlDisTax.onchange = ddlDisTax_onchange;
        txtTaxPrc.onkeyup = txtTaxPrc_onchange;
    }
    function txtTaxPrc_onchange() {
        for (var i = 0; i < CountGrid; i++) {
            var flagvalue = $("#txt_StatusFlag" + i).val();
            if (flagvalue != "d" && flagvalue != "m") {
                totalRow(i, true);
            }
        }
    }
    function ddlDisTax_onchange() {
        var DisTax = ddlDisTax.value;
        var TaxT1 = TaxType.filter(function (x) { return x.StdCode == DisTax; });
        $('#ddlTypeDis').html('');
        for (var i = 0; i < TaxT1.length; i++) {
            $('#ddlTypeDis').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
        }
        if (ddlDisTax.value == 'null') {
            $('#ddlTypeDis').append('<option value="null"> اختار </option>');
        }
    }
    function ddlValueTax_onchange() {
        var ValueTax = ddlValueTax.value;
        var TaxT1 = TaxType.filter(function (x) { return x.StdCode == ValueTax; });
        $('#ddlTypeTax').html('');
        for (var i = 0; i < TaxT1.length; i++) {
            $('#ddlTypeTax').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
        }
    }
    function FillddlCurreny() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllCurreny"),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    I_D_CURRENCYDetails = result.Response;
                    DocumentActions.FillCombowithdefult(I_D_CURRENCYDetails, ddlCurreny, "CurrencyID", "DescA", "اختار العمله");
                }
            }
        });
    }
    function FillddlG_Codes() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllG_Codes"),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    G_CodesDetails = result.Response;
                    Tax = G_CodesDetails.filter(function (x) { return x.CodeType == 'Taxtypes'; });
                    TaxType = G_CodesDetails.filter(function (x) { return x.CodeType == 'TaxSubtypes'; });
                    var TaxT1 = TaxType.filter(function (x) { return x.StdCode == 'T1'; });
                    $('#ddlValueTax').html('');
                    $('#ddlTypeTax').html('');
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
                    $('#ddlValueTax').val('T1');
                    $('#ddlTypeTax').val('V009');
                }
            }
        });
    }
    function FillddlUom() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUOM"),
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    I_D_UOMDetails = result.Response;
                }
            }
        });
    }
    function btnCustSrch_onClick() {
        sys.FindKey(Modules.Quotation, "btnCustSrch", "", function () {
            CustomerDetail = SearchGrid.SearchDataGrid.SelectedKey;
            console.log(CustomerDetail);
            CustomerId = Number(CustomerDetail[0]);
            txtCompanyname.value = String(CustomerDetail[1]);
        });
    }
    function BuildControls(cnt) {
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
            sys.FindKey(Modules.Quotation, "btnItem", "", function () {
                ItemDetail = SearchGrid.SearchDataGrid.SelectedKey;
                console.log(ItemDetail);
                var ItemID = Number(ItemDetail[0]);
                var description = String(ItemDetail[1]);
                var UnitCode = String(ItemDetail[2]);
                $('#btnItem' + cnt).html(description);
                $('#txt_ItemID' + cnt).val(ItemID);
                $('#ddlTypeUom' + cnt).val(UnitCode);
                $('#ddlTypeUom' + cnt).val(UnitCode);
                $('#QTY' + cnt).val('1');
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
            var txtPrice = Number($("#txtPrice" + cnt).val());
            var txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
            $("#txtDiscountPrc" + cnt).val(((txtDiscountAmount / txtPrice) * 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - txtDiscountAmount).RoundToSt(2));
            totalRow(cnt, false);
        });
        $("#btn_minus" + cnt).click(function (e) {
            DeleteRow(cnt);
        });
        return;
    }
    function totalRow(cnt, flagDiscountAmount) {
        debugger;
        $('#txtTax_Rate' + cnt).val($('#txtTaxPrc').val());
        //$("#txtUnitpriceWithVat" + cnt).val((Number($("#txtPrice" + cnt).val()) * (Tax_Rate + 100) / 100).RoundToNum(2))
        //$("#txtPrice" + cnt).val((Number($("#txtUnitpriceWithVat" + cnt).val()) * 100 / (Tax_Rate + 100)).RoundToSt(2))
        //-------------------------
        var txtPrice = Number($("#txtPrice" + cnt).val());
        var txtDiscountPrc = Number($("#txtDiscountPrc" + cnt).val());
        if (flagDiscountAmount) {
            $("#txtDiscountAmount" + cnt).val(((txtDiscountPrc * txtPrice) / 100).RoundToSt(2));
            $("#txtNetUnitPrice" + cnt).val((txtPrice - ((txtDiscountPrc * txtPrice) / 100)).RoundToSt(2));
        }
        else {
            var txtDiscountAmount = Number($("#txtDiscountAmount" + cnt).val());
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
        debugger;
        var PackageCount = 0;
        var CountTotal = 0;
        var TotalDiscount = 0;
        var Totalbefore = 0;
        var TaxCount = 0;
        var NetCount = 0;
        var CountItems = 0;
        for (var i = 0; i < CountGrid; i++) {
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
    function Validation_Grid(rowcount) {
        var Qty = Number($("#txtQuantity" + rowcount).val());
        var Price = Number($("#txtPrice" + rowcount).val());
        if ($("#txt_StatusFlag" + rowcount).val() == "d" || $("#txt_StatusFlag" + rowcount).val() == "m") {
            return true;
        }
        else {
            if ($("#txt_ItemID" + rowcount).val() == "" || $("#txt_ItemID" + rowcount).val() == "0" || $("#txt_ItemID" + rowcount).val() == null) {
                DisplayMassage(" برجاء ادخال الصنف", "Please enter the type", MessageType.Error);
                Errorinput($("#btnItem" + rowcount));
                return false;
            }
            else if (Qty == 0) {
                DisplayMassage(" برجاء ادخال الكمية المباعة", "Please enter the Quantity sold", MessageType.Error);
                Errorinput($("#txtQuantity" + rowcount));
                return false;
            }
            else if (Price == 0) {
                DisplayMassage(" برجاء ادخال السعر", "Please enter the Price", MessageType.Error);
                Errorinput($("#txtPrice" + rowcount));
                Errorinput($("#txtUnitpriceWithVat" + rowcount));
                return false;
            }
            return true;
        }
    }
    function DeleteRow(RecNo) {
        WorningMessage("Do you want to delete?", "Do you want to delete?", "warning", "warning", function () {
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
        var Chack_Flag = false;
        var flagval = "";
        var Ser = 1;
        for (var i = 0; i < CountGrid; i++) {
            flagval = $("#txt_StatusFlag" + i).val();
            if (flagval != "d" && flagval != "m") {
                $("#txtSerial" + i).val(Ser);
                Ser++;
            }
            if (flagval == 'd' || flagval == 'm' || flagval == 'i') {
                Chack_Flag = true;
            }
            if (Chack_Flag) {
                if ($("#txt_StatusFlag" + i).val() != 'i' && $("#txt_StatusFlag" + i).val() != 'm' && $("#txt_StatusFlag" + i).val() != 'd') {
                    $("#txt_StatusFlag" + i).val('u');
                }
            }
        }
    }
    function Assign() {
        var StatusFlag;
        InvoiceModel = new Sls_Ivoice();
        InvoiceItemsDetailsModel = new Array();
        MasterDetailsModel = new SlsInvoiceMasterDetails();
        TaxableModel = new Array();
        MasterDetailsModel.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        MasterDetailsModel.UserCode = SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        InvoiceModel.TrType = 0; //0 invoice 1 return
        InvoiceModel.SlsInvSrc = 1; // 1 from store 2 from van  
        InvoiceModel.StoreId = $('#ddlStore').val(); //main store
        InvoiceModel.PaymentMeansTypeCode = ddlTypePay.value == '0' ? 2 : 1; //  Cash or   Credit
        if (ddlTypePay.value == "0") {
            InvoiceModel.IsCash = false;
        }
        else {
            InvoiceModel.IsCash = true;
        }
        InvoiceModel.DocType = ddlTypeInv.value;
        ///////////////
        debugger;
        Return_Falg == false ? InvoiceModel.TrNo = Number(Selected_Data[0].TrNo) : InvoiceModel.TrNo = 0;
        InvoiceModel.InvoiceID = Selected_Data[0].InvoiceID;
        InvoiceModel.StoreId = 1;
        InvoiceModel.TrDate = txtDate.value;
        InvoiceModel.CommitionAmount = 0;
        InvoiceModel.Remark = txtRemark.value;
        InvoiceModel.RefNO = txtRFQ.value;
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
                invoiceItemSingleModel.StockSoldQty = Number($('#txtQuantity' + i).val()); //
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
                var invoiceItemId = $("#InvoiceItemID" + i).val();
                invoiceItemSingleModel.InvoiceItemID = invoiceItemId;
                invoiceItemSingleModel.ItemID = $("#txt_ItemID" + i).val();
                invoiceItemSingleModel.Serial = $("#txtSerial" + i).val();
                invoiceItemSingleModel.SoldQty = $('#txtQuantity' + i).val();
                invoiceItemSingleModel.StockSoldQty = Number($('#txtQuantity' + i).val()); //
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
                var VatNatID = Number($("#txtTax_Rate" + i).attr('data-VatNatID'));
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
        TaxableSinglModel = new TaxableItem();
        TaxableSinglModel.InvoiceID = 0;
        TaxableSinglModel.subType = ddlTypeTax.value;
        TaxableSinglModel.taxType = ddlValueTax.value;
        TaxableModel.push(TaxableSinglModel);
        if (ddlDisTax.value != 'null' && ddlTypeDis.value != 'null') {
            TaxableSinglModel = new TaxableItem();
            TaxableSinglModel.InvoiceID = 0;
            TaxableSinglModel.subType = ddlTypeDis.value;
            TaxableSinglModel.taxType = ddlDisTax.value;
            TaxableModel.push(TaxableSinglModel);
        }
        MasterDetailsModel.Sls_Ivoice = InvoiceModel;
        MasterDetailsModel.Sls_InvoiceDetail = InvoiceItemsDetailsModel;
        MasterDetailsModel.TaxableItem = TaxableModel;
    }
    function Update() {
        if (!validation())
            return;
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "updateInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    invoiceID = res.InvoiceID;
                    DisplayMassage("تم تعديل فاتوره رقم  ( " + res.TrNo + " )", "تم تعديل فاتوره رقم  ( " + res.TrNo + " )", MessageType.Succeed);
                    success_insert();
                }
                else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
    function Insert() {
        if (!validation())
            return;
        Assign();
        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
            data: JSON.stringify(MasterDetailsModel),
            success: function (d) {
                var result = d;
                if (result.IsSuccess == true) {
                    var res = result.Response;
                    invoiceID = res.InvoiceID;
                    DisplayMassage("تم اصدار فاتوره رقم  ( " + res.TrNo + " )", "تم اصدار فاتوره رقم  ( " + res.TrNo + " )", MessageType.Succeed);
                    success_insert();
                }
                else {
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
        Tax = G_CodesDetails.filter(function (x) { return x.CodeType == 'Taxtypes'; });
        TaxType = G_CodesDetails.filter(function (x) { return x.CodeType == 'TaxSubtypes'; });
        var TaxT1 = TaxType.filter(function (x) { return x.StdCode == 'T1'; });
        $('#ddlValueTax').html('');
        $('#ddlTypeTax').html('');
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
        $('#ddlValueTax').val('T1');
        $('#ddlTypeTax').val('V009');
        ddlDisTax.value = 'null';
        $('#ddlTypeDis').html('');
        $('#ddlTypeDis').append('<option value="null"> اختار </option>');
        $("#Table_Data").html("");
        AddNewRow();
        Display(txtTypeInv.value);
        Return_Falg = false;
    }
    function validation() {
        var count = 0;
        for (var i = 0; i < CountGrid; i++) {
            var StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag != "m" && StatusFlag != "d") {
                count++;
            }
        }
        if (txtDate.value.trim() == "") {
            Errorinput(txtDate);
            DisplayMassage('برجاء ادخال التاريخ', 'Date must be entered', MessageType.Error);
            return false;
        }
        if (txtRFQ.value.trim() == "") {
            Errorinput(txtRFQ);
            DisplayMassage('برجاء ادخال رقم الرجع', 'Company must be choosed', MessageType.Error);
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
        if (!validation())
            return;
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = Validation_Grid(i);
                if (CanAdd == false) {
                    break;
                }
            }
        }
        if (CanAdd) {
            if (Return_Falg == false) {
                Update();
            }
            else {
                Insert();
            }
        }
    }
    function btnClean_onclick() {
        $('#viewmail').removeClass('active in');
        $('#sendmail').addClass('active in');
        $('#composemail').removeClass('active in');
        //$('#btnReturn').addClass('active');
        //$('#btnInvoice').removeClass('active');
        if (txtTypeInv.value == 'I') {
            ReportGridInv.DataSource = Invoice;
            ReportGridInv.Bind();
            $('#Title_Inv').html('عـرض فواتير المبيعات');
            $('#btnAdd').removeClass('active');
            $('#btnReturn').removeClass('active');
            $('#btnInvoice').addClass('active');
        }
        if (txtTypeInv.value == 'C') {
            ReportGridRet.DataSource = Invoice;
            ReportGridRet.Bind();
            $('#Title_Inv').html('عـرض فواتير المرتجعات');
            $('#btnAdd').removeClass('active');
            $('#btnReturn').addClass('active');
            $('#btnInvoice').removeClass('active');
        }
        if (txtTypeInv.value == 'D') {
            ReportGridRet.DataSource = Invoice;
            ReportGridRet.Bind();
            $('#Title_Inv').html('عـرض فواتير أضافه');
            $('#btnAdd').addClass('active');
            $('#btnReturn').removeClass('active');
            $('#btnInvoice').removeClass('active');
        }
        $('#Div_Fillter').removeClass('display_none');
        $('#Div_Views').attr('style', '');
        Return_Falg = false;
        CountGrid = 0;
        $("#Table_Data").html("");
        AddNewRow();
    }
    //----------------------------------------------------------------------------------------------------
})(QuotationView || (QuotationView = {}));
//# sourceMappingURL=QuotationView.js.map