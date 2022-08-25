$(document).ready(function () {
    InvoiceTax.InitalizeComponent();
});
var InvoiceTax;
(function (InvoiceTax) {
    var sys = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession = GetSystemSession(Modules.Quotation);
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
    var btnprint;
    var invoiceID = 0;
    var txtDate;
    var txtRFQ;
    var ddlTypeInv;
    var txtCompanysales;
    var txtCompanyname;
    var txtQutationNo;
    var txtsalesVAT;
    var txtfirstdays;
    var txtsecounddays;
    var txtlastdays;
    var txtPlacedeliv;
    var txtRemark;
    var txtNetBefore;
    var txtNetAfterVat;
    var txtTaxPrc;
    var txtItemCount;
    var txtPackageCount;
    var txtTotalDiscount;
    var txtTotalbefore;
    var txtTotal;
    var txtTax;
    var txtNet;
    var ddlCurreny;
    var ddlValueTax;
    var ddlTypeTax;
    var ddlDisTax;
    var ddlTypeDis;
    var include = "";
    var Tax;
    var TaxType;
    var include = "";
    function InitalizeComponent() {
        //alert(SysSession.CurrentEnvironment.issuer.buildingNumber)
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        FillddlUom();
        AddNewRow();
        FillddlCurreny();
        FillddlG_Codes();
        txtDate.value = GetDate();
        ddlCurreny.value = "EGP";
    }
    InvoiceTax.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails");
        btnCustSrch = document.getElementById("btnCustSrch");
        btnsave = document.getElementById("btnsave");
        btnClean = document.getElementById("btnClean");
        btnprint = document.getElementById("btnprint");
        // inputs
        ddlCurreny = document.getElementById("ddlCurreny");
        ddlValueTax = document.getElementById("ddlValueTax");
        ddlTypeTax = document.getElementById("ddlTypeTax");
        ddlDisTax = document.getElementById("ddlDisTax");
        ddlTypeDis = document.getElementById("ddlTypeDis");
        txtDate = document.getElementById("txtDate");
        txtRFQ = document.getElementById("txtRFQ");
        ddlTypeInv = document.getElementById("ddlTypeInv");
        txtCompanysales = document.getElementById("txtCompanysales");
        txtCompanyname = document.getElementById("txtCompanyname");
        txtQutationNo = document.getElementById("txtQutationNo");
        txtsalesVAT = document.getElementById("txtsalesVAT");
        txtfirstdays = document.getElementById("txtfirstdays");
        txtsecounddays = document.getElementById("txtsecounddays");
        txtlastdays = document.getElementById("txtlastdays");
        txtPlacedeliv = document.getElementById("txtPlacedeliv");
        txtRemark = document.getElementById("txtRemark");
        txtNetBefore = document.getElementById("txtNetBefore");
        txtNetAfterVat = document.getElementById("txtNetAfterVat");
        txtTaxPrc = document.getElementById("txtTaxPrc");
        txtItemCount = document.getElementById("txtItemCount");
        txtPackageCount = document.getElementById("txtPackageCount");
        txtTotalDiscount = document.getElementById("txtTotalDiscount");
        txtTotalbefore = document.getElementById("txtTotalbefore");
        txtTotal = document.getElementById("txtTotal");
        txtTax = document.getElementById("txtTax");
        txtNet = document.getElementById("txtNet");
    }
    function InitalizeEvents() {
        btnAddDetails.onclick = AddNewRow; //
        btnCustSrch.onclick = btnCustSrch_onClick;
        btnsave.onclick = btnsave_onclick;
        btnClean.onclick = btnClean_onclick;
        //btnprint.onclick = btnprint_onclick;
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
            $('#ddlTypeDis').append('<option value="null"> Choose Tax </option>');
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
                    DocumentActions.FillCombowithdefult(I_D_CURRENCYDetails, ddlCurreny, "CUR_CODE", "DESCA", "Choose Currency");
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
            txtCompanyname.value = String(CustomerDetail[2]);
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
            ' <input  id="txt_IDItem' + cnt + '" type="hidden" class="form-control"> ' +
            '</tr>';
        $("#Table_Data").append(html);
        debugger;
        for (var i = 0; i < I_D_UOMDetails.length; i++) {
            $('#ddlTypeUom' + cnt + '').append('<option  value="' + I_D_UOMDetails[i].UomID + '">' + I_D_UOMDetails[i].DescE + '</option>');
        }
        $('#btnItem' + cnt).click(function (e) {
            sys.FindKey(Modules.Quotation, "btnItem", "", function () {
                ItemDetail = SearchGrid.SearchDataGrid.SelectedKey;
                console.log(ItemDetail);
                var ItemID = Number(ItemDetail[0]);
                var description = String(ItemDetail[1]);
                var UnitCode = String(ItemDetail[2]);
                $('#btnItem' + cnt).html(description);
                $('#txt_IDItem' + cnt).val(ItemID);
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
    function validationgrid(rowcount) {
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
        if ($("#ddlTypeUom" + rowcount).val().trim() == "") {
            Errorinput($("#ddlTypeUom" + rowcount));
            DisplayMassage('The unit must be selected', 'The unit must be selected', MessageType.Error);
            return false;
        }
        //if ($("#UnitPrice" + rowcount).val().trim() == "" || Number($("#UnitPrice" + rowcount).val()) <= 0) {
        //    Errorinput($("#UnitPrice" + rowcount));
        //    DisplayMassage('Item Price must be entered', 'Item Price must be entered', MessageType.Error);
        //    return false;
        //}
        return true;
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
        //var StatusFlag: String;
        InvoiceModel = new Sls_Ivoice();
        InvoiceItemsDetailsModel = new Array();
        TaxableSinglModel = new TaxableItem();
        TaxableModel = new Array();
        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        InvoiceModel.Status = 1;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(txtQutationNo.value);
        InvoiceModel.TrNo = InvoiceNumber;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString());
        InvoiceModel.CreatedBy = sys.SysSession.CurrentEnvironment.UserCode;
        InvoiceModel.TrType = 1; //0 invoice 1 return     
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.TrDate = txtDate.value;
        InvoiceModel.RefNO = txtRFQ.value;
        InvoiceModel.SalesmanId = 1;
        InvoiceModel.IsCash = Number(ddlTypeInv.value) == 1 ? true : false;
        InvoiceModel.TaxCurrencyID = Number(ddlCurreny.value);
        InvoiceModel.ChargeReason = txtCompanysales.value;
        InvoiceModel.Remark = txtRemark.value;
        InvoiceModel.TotalAmount = Number(txtNetBefore.value);
        InvoiceModel.NetAfterVat = Number(txtNetAfterVat.value);
        //-------------------------(T E R M S & C O N D I T I O N S)-----------------------------------------------     
        InvoiceModel.ContractNo = txtsalesVAT.value; //----------------- include sales VAT.
        InvoiceModel.PurchaseorderNo = txtfirstdays.value; //----------------- days starting from the delivery date.
        InvoiceModel.ChargeVatPrc = Number(txtsecounddays.value); //----------------- days from offer date.
        InvoiceModel.ChargeAfterVat = Number(txtlastdays.value); //----------------- days from purchase order.
        InvoiceModel.PrevInvoiceHash = txtPlacedeliv.value; //----------------- Place of delivery.
        // Details
        for (var i = 0; i < CountGrid; i++) {
            var StatusFlag = $("#txt_StatusFlag" + i).val();
            if (StatusFlag == "i") {
                invoiceItemSingleModel = new Sls_InvoiceDetail();
                invoiceItemSingleModel.InvoiceItemID = 0;
                invoiceItemSingleModel.Serial = Number($("#serial" + i).val());
                invoiceItemSingleModel.SoldQty = Number($('#QTY' + i).val());
                invoiceItemSingleModel.Itemdesc = $("#Description" + i).val();
                invoiceItemSingleModel.NetUnitPrice = Number($("#UnitPrice" + i).val());
                invoiceItemSingleModel.ItemTotal = Number($("#Totalprice" + i).val());
                invoiceItemSingleModel.DiscountPrc = Number($("#DiscountPrc" + i).val());
                invoiceItemSingleModel.DiscountAmount = Number($("#DiscountAmount" + i).val());
                invoiceItemSingleModel.NetAfterVat = Number($("#Net" + i).val());
                invoiceItemSingleModel.UomID = Number($("#ddlTypeUom" + i).val());
                InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            }
        }
        TaxableSinglModel.InvoiceID = 0;
        TaxableSinglModel.subType = ddlTypeTax.value;
        TaxableSinglModel.taxType = ddlValueTax.value;
        TaxableModel.push(TaxableSinglModel);
        if (ddlDisTax.value != 'null' && ddlTypeDis.value != 'null') {
            TaxableSinglModel.InvoiceID = 0;
            TaxableSinglModel.subType = ddlTypeDis.value;
            TaxableSinglModel.taxType = ddlDisTax.value;
            TaxableModel.push(TaxableSinglModel);
        }
        MasterDetailsModel.Sls_Ivoice = InvoiceModel;
        MasterDetailsModel.Sls_InvoiceDetail = InvoiceItemsDetailsModel;
        MasterDetailsModel.TaxableItem = TaxableModel;
    }
    function insert() {
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
                    DisplayMassage("An invoice number has been issued " + res.TrNo + "", "An invoice number has been issued " + res.TrNo + "", MessageType.Succeed);
                    success_insert();
                }
                else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });
    }
    function success_insert() {
        txtDate.value = GetDate();
        CountGrid = 0;
        CustomerId = 0;
        invoiceID = 0;
        txtRFQ.value = "";
        txtCompanysales.value = "";
        txtCompanyname.value = "";
        txtQutationNo.value = "";
        txtsalesVAT.value = "";
        txtfirstdays.value = "";
        txtsecounddays.value = "";
        txtlastdays.value = "";
        txtPlacedeliv.value = "";
        txtRemark.value = "";
        txtNetBefore.value = "";
        txtNetAfterVat.value = "";
        $("#Table_Data").html("");
        AddNewRow();
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
        var CanAdd = true;
        if (CountGrid > 0) {
            for (var i = 0; i < CountGrid; i++) {
                CanAdd = validationgrid(i);
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
        CountGrid = 0;
        $("#Table_Data").html("");
        AddNewRow();
    }
})(InvoiceTax || (InvoiceTax = {}));
//# sourceMappingURL=InvoiceTax.js.map