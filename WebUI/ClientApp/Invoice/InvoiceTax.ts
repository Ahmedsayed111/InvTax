
$(document).ready(() => {
    InvoiceTax.InitalizeComponent();
})

namespace InvoiceTax {

    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.Quotation);

    var InvoiceItemsDetailsModel: Array<Sls_InvoiceDetail> = new Array<Sls_InvoiceDetail>();
    var invoiceItemSingleModel: Sls_InvoiceDetail = new Sls_InvoiceDetail();
    var InvoiceModel: Sls_Ivoice = new Sls_Ivoice();
    var MasterDetailsModel: SlsInvoiceMasterDetails = new SlsInvoiceMasterDetails();
    var CustomerDetail: Array<Customer> = new Array<Customer>();
    var ItemDetail: Array<Items> = new Array<Items>();
    var I_D_UOMDetails: Array<I_D_UOM> = new Array<I_D_UOM>();
    var I_D_CURRENCYDetails: Array<I_D_CURRENCY> = new Array<I_D_CURRENCY>();
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

    var ddlCurreny: HTMLSelectElement;
    var ddlValueTax: HTMLSelectElement;
    var ddlTypeTax: HTMLSelectElement;
    var ddlDisTax: HTMLSelectElement;
    var ddlTypeDis: HTMLSelectElement;

    var include = "";
    var Tax;
    var TaxType;
    var include = "";

    export function InitalizeComponent() {

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
    function InitalizeControls() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnCustSrch = document.getElementById("btnCustSrch") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnClean = document.getElementById("btnClean") as HTMLButtonElement;
        btnprint = document.getElementById("btnprint") as HTMLButtonElement;
        // inputs
        ddlCurreny = document.getElementById("ddlCurreny") as HTMLSelectElement;
        ddlValueTax = document.getElementById("ddlValueTax") as HTMLSelectElement;
        ddlTypeTax = document.getElementById("ddlTypeTax") as HTMLSelectElement;
        ddlDisTax = document.getElementById("ddlDisTax") as HTMLSelectElement;
        ddlTypeDis = document.getElementById("ddlTypeDis") as HTMLSelectElement;

        txtDate = document.getElementById("txtDate") as HTMLInputElement;
        txtRFQ = document.getElementById("txtRFQ") as HTMLInputElement;
        ddlTypeInv = document.getElementById("ddlTypeInv") as HTMLInputElement;
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
    function InitalizeEvents() {

        btnAddDetails.onclick = AddNewRow;//
        btnCustSrch.onclick = btnCustSrch_onClick;
        btnsave.onclick = btnsave_onclick;
        btnClean.onclick = success_insert;
        txtAllDiscount.onkeyup = ComputeTotals;
        //btnprint.onclick = btnprint_onclick;
        ddlValueTax.onchange = ddlValueTax_onchange;
        ddlDisTax.onchange = ddlDisTax_onchange;
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
                    I_D_CURRENCYDetails = result.Response as Array<I_D_CURRENCY>;
                    DocumentActions.FillCombowithdefult(I_D_CURRENCYDetails, ddlCurreny, "CUR_CODE", "DESCA", "Choose Currency");
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
            include = String(CustomerDetail[3]);
            if (include == "true") {
                txtsalesVAT.value = "not include";
            }
            else {
                txtsalesVAT.value = "not include";
            }
            ComputeTotals();
        });
    }
    function BuildControls(cnt: number) {
        var html;

        html = '<tr id= "No_Row' + cnt + '" class="  animated zoomIn ">' +

            '<td><button id="btn_minus' + cnt + '" type="button" class="btn btn-custon-four btn-danger"><i class="fa fa-minus-circle"></i></button></td>' +
            '<td><input  id="txtSerial' + cnt + '" disabled="disabled"  type="text" class="form-control" placeholder="SR"></td>' +
            '<td><button id="btnItem' + cnt + '" class="btn btn-custon-four btn-success oo"  style="height:34px;width: 235px;background-color: #3bafda;"  > Seach Item </button></td>' +
            //'<td> <textarea id="Description' + cnt + '" name="Description" type="text" class="form-control" style="height:34px" placeholder="Description" spellcheck="false"></textarea></td>' +
            '<td><select id="ddlTypeUom' + cnt + '" class="form-control"> <option value="null"> Choose Uom </option></select></td>' +
            '<td><input  id="txtQuantity' + cnt + '" type="number" class="form-control" placeholder="QTY"></td>' +
            '<td><input  id="txtPrice' + cnt + '" value="0" type="number" class="form-control" placeholder="Unit Price"></td>' +
            '<td><input  id="txtDiscountPrc' + cnt + '" value="0" type="number" class="form-control" placeholder="DiscountPrc%"></td>' +
            '<td><input  id="txtDiscountAmount' + cnt + '" value="0" type="number" class="form-control" placeholder="DiscountAmount"></td>' +
            '<td><input  id="txtNetUnitPrice' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder=" Price After Discount "></td>' +
            '<td><input  id="txtTotal' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="Total price"></td>' +
            '<td><input  id="txtTax_Rate' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="   Tax %  "></td>' +
            '<td><input  id="txtTax' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder=" Amount Tax  "></td>' +
            '<td><input  id="txtTotAfterTax' + cnt + '" type="number" disabled="disabled" value="0" class="form-control" placeholder="Net"></td>' +
            ' <input  id="txt_StatusFlag' + cnt + '" type="hidden" class="form-control"> ' +
            ' <input  id="txt_IDItem' + cnt + '" type="hidden" class="form-control"> ' +
            '</tr>';
        $("#Table_Data").append(html);

        debugger
        for (var i = 0; i < I_D_UOMDetails.length; i++) {


            $('#ddlTypeUom' + cnt + '').append('<option  value="' + I_D_UOMDetails[i].UomID + '">' + I_D_UOMDetails[i].DescE + '</option>');

        }

        $('#btnItem' + cnt).click(function (e) {

            sys.FindKey(Modules.Quotation, "btnItem", "", () => {

                ItemDetail = SearchGrid.SearchDataGrid.SelectedKey;
                console.log(ItemDetail);


                let ItemID = Number(ItemDetail[0]);
                let description = String(ItemDetail[1]);
                let UnitCode = String(ItemDetail[2]);

                $('#btnItem' + cnt).html(description)
                $('#txt_IDItem' + cnt).val(ItemID)
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


 
        $('#txtTax_Rate' + cnt).val('15');

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

            }
        }
        //txtItemCount.value = CountItems.toString();
        //txtPackageCount.value = PackageCount.toString();
        //txtTotalDiscount.value = TotalDiscount.toString();
        //txtTotalbefore.value = Totalbefore.toString();
        //txtTotal.value = CountTotal.toString();
        //txtTax.value = TaxCount.toString();
        //txtNet.value = (Number(NetCount.RoundToSt(2))).RoundToSt(2);
    }
    function AddNewRow() {
        $('paginationSwitch').addClass("display_none");
        $('.no-records-found').addClass("display_none");



        BuildControls(CountGrid);
        $("#txt_StatusFlag" + CountGrid).val("i"); //In Insert mode 
        CountGrid++;
        Insert_Serial();


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
        //var StatusFlag: String;
        InvoiceModel = new Sls_Ivoice();
        InvoiceItemsDetailsModel = new Array<Sls_InvoiceDetail>();
        TaxableSinglModel = new TaxableItem();
        TaxableModel = new Array<TaxableItem>();



        InvoiceModel.CustomerId = CustomerId == 0 ? null : CustomerId;
        InvoiceModel.Status = 1;
        InvoiceModel.CompCode = Number(compcode);
        InvoiceModel.BranchCode = Number(BranchCode);
        var InvoiceNumber = Number(txtQutationNo.value);
        InvoiceModel.TrNo = InvoiceNumber;
        InvoiceModel.CreatedAt = DateTimeFormat(Date().toString())
        InvoiceModel.CreatedBy = sys.SysSession.CurrentEnvironment.UserCode;

        InvoiceModel.TrType = 1//0 invoice 1 return     
        InvoiceModel.InvoiceID = 0;
        InvoiceModel.TrDate = txtDate.value;
        InvoiceModel.RefNO = txtRFQ.value;
        InvoiceModel.SalesmanId = 1;
        InvoiceModel.IsCash = Number(ddlTypeInv.value) == 1 ? true : false;
        InvoiceModel.TaxCurrencyID = Number(ddlCurreny.value);
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

        // Details
        for (var i = 0; i < CountGrid; i++) {
            let StatusFlag = $("#txt_StatusFlag" + i).val();
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
            url: sys.apiUrl("SlsTrSales", "InsertInvoiceMasterDetail"),
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
        txtAllDiscount.value = "";
        txtNetAfterVat.value = "";
        $("#Table_Data").html("");
        AddNewRow();
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
            insert();
        }

    }

}












