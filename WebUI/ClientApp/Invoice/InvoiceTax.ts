
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



    var ddlCurreny: HTMLSelectElement;
    var ddlValueTax: HTMLSelectElement;
    var ddlTypeTax: HTMLSelectElement;  

    var include = "";
    var Tax;
    var TaxType;
    var include = "";


    //------------------------------New_Ver------------------------
    var modal = document.getElementById("myModal");


    export function InitalizeComponent() {

        //alert(SysSession.CurrentEnvironment.issuer.buildingNumber)

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        FillddlUom();
        FillddlCurreny();
        FillddlG_Codes();
        txtDate.value = GetDate();
        ddlCurreny.value = "4";

        AddNewRow();
    }
    function InitalizeControls() {
        // ;
        btnAddDetails = document.getElementById("btnAddDetails") as HTMLButtonElement;
        btnCustSrch = document.getElementById("btnCustSrch") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;
        btnClean = document.getElementById("btnClean") as HTMLButtonElement;
        // inputs
        ddlCurreny = document.getElementById("ddlCurreny") as HTMLSelectElement;
        ddlValueTax = document.getElementById("ddlValueTax") as HTMLSelectElement;
        ddlTypeTax = document.getElementById("ddlTypeTax") as HTMLSelectElement; 

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
    function InitalizeEvents() {

        btnAddDetails.onclick = AddNewRow;//
        btnCustSrch.onclick = btnCustSrch_onClick;
        btnsave.onclick = btnsave_onclick;
        btnClean.onclick = btnClean_onclick;
        ddlValueTax.onchange = ddlValueTax_onchange; 
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
                    debugger
                    $('#ddlValueTax').html('')
                    $('#ddlTypeTax').html('')

                    for (var i = 0; i < Tax.length; i++) {
                        $('#ddlValueTax').append('<option  value="' + Tax[i].StdCode + '">' + Tax[i].DescA + '</option>'); 
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
            debugger
            CustomerDetail = SearchGrid.SearchDataGrid.SelectedKey;
            console.log(CustomerDetail);
            CustomerId = Number(CustomerDetail[0]);
            txtCompanyname.value = String(CustomerDetail[1]);

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
            //------------------------------------------------------------New_Ver-----------------------------------------------------------------------
            '<td><button id="btnTaxDis' + cnt + '" class="btn btn-custon-four btn-success oo"  style="width: 90%;height:34px;background-color: #da453b;font-weight: bold;font-size: 18px;"  > ضريبة خصم </button></td>' +
            '<td><input  id="txtTotal' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="الاجمالي  "></td>' +
            '<td><input  id="txtTax_Rate' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="   نسبة الضريبه  "></td>' +
            '<td><input  id="txtTax' + cnt + '" value="0" type="number" disabled="disabled" class="form-control" placeholder="الضريبه "></td>' +
            '<td><input  id="txtTotAfterTax' + cnt + '" type="number" disabled="disabled" value="0" class="form-control" placeholder="الصافي" style="width: 107px;"></td>' +
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

        $('#btnTaxDis' + cnt).click(function (e) {
            $('.Rows_Tax').addClass('display_none')
            modal.style.display = "block";
            $('#No_Row_Tax' + cnt).removeClass('display_none');
        });

        BuildTaxDis(cnt)
        return;
    }
    function BuildTaxDis(cnt: number) {
        var html;

        html = '<tr id= "No_Row_Tax' + cnt + '" class="Rows_Tax">' +

            '<td><select id="ddlDisTax' + cnt + '" class="ddlDisTax form-control"> <option value="null"> أختر خصم الضريبه  </option></select></td>' +
            '<td><select id="ddlTypeDis' + cnt + '" class="ddlTypeDis form-control"> <option value="null"> أختر نوع الخصم  </option></select></td>' +
            '<td><input  id="txtPrc_Tax' + cnt + '" disabled type="number" class="form-control" placeholder="النسبه"></td>' +
            '<td><input  id="txtTax_AmontDis' + cnt + '"disabled value="0" type="number" class="form-control" placeholder="السعر  "></td>' +

            '</tr>';
        $("#Table_Tax").append(html);

        debugger
        for (var i = 0; i < Tax.length; i++) {
            $('#ddlDisTax' + cnt + '').append('<option  value="' + Tax[i].StdCode + '">' + Tax[i].DescA + '</option>');
        }





        $("#ddlDisTax" + cnt).on('change', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");

            if ($("#ddlDisTax" + cnt).val() == 'null') {
                $('#ddlTypeDis' + cnt).html('')
                $('#ddlTypeDis' + cnt).append('<option    value="null">اختار</option>');
                $('#txtPrc_Tax' + cnt).val('0')
                $('#txtTax_AmontDis' + cnt).val('0')
            }
            else {

                let DisTax = $("#ddlDisTax" + cnt).val();
                let TaxT1 = TaxType.filter(x => x.StdCode == DisTax)

                $('#ddlTypeDis' + cnt).html('')
                for (var i = 0; i < TaxT1.length; i++) {
                    $('#ddlTypeDis' + cnt).append('<option  Data_Rate="' + TaxT1[i].Remarks + '"  value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
                }

                $('#txtPrc_Tax' + cnt).val(TaxT1[0].Remarks)
            }

            totalRow(cnt, true);

        });


        $("#ddlTypeDis" + cnt).on('change', function (e) {
            if ($("#txt_StatusFlag" + cnt).val() != "i")
                $("#txt_StatusFlag" + cnt).val("u");


            let Typeuom = $("#ddlTypeDis" + cnt);
            let rate = $('option:selected', Typeuom).attr('Data_Rate');

            $('#txtPrc_Tax' + cnt).val(rate)
            totalRow(cnt, true);
        });





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

        let rate = Number($("#txtPrc_Tax" + cnt).val());

        var Tax_AmontDis = rate == 0 ? 0 : ((total * rate) / 100);
        total = total - Tax_AmontDis;
        $("#txtTax_AmontDis" + cnt).val(Tax_AmontDis);

        rate == 0 ? $("#btnTaxDis" + cnt).html(' ضريبة خصم ') : $("#btnTaxDis" + cnt).html(Tax_AmontDis.toString());


        var VatPrc = $("#txtTax_Rate" + cnt).val();
        var vatAmount = Number(total) * VatPrc / 100;
        $("#txtTax" + cnt).val(vatAmount.RoundToSt(2));
        //var total = Number(txtQuantityValue) * Number(txtPriceValue);
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
        InvoiceModel.InvoiceID = 0;
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
                invoiceItemSingleModel.InvoiceItemID = ((i + 1) * -1);
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


                //------------------------------------- TaxableItem-------------------------
                //--------------------------------------------------New_Ver-----------------------------
                TaxableSinglModel = new TaxableItem();
                TaxableSinglModel.InvoiceID = ((i + 1) * -1)
                TaxableSinglModel.subType = ddlTypeTax.value
                TaxableSinglModel.taxType = ddlValueTax.value
                TaxableSinglModel.rate = Number(txtTaxPrc.value)
                TaxableSinglModel.amount = $("#txtTax" + i).val();
                TaxableModel.push(TaxableSinglModel);


                if ($("#ddlDisTax" + i).val() != 'null' && $("#ddlTypeDis" + i).val()!= 'null') {
                    TaxableSinglModel = new TaxableItem();
                    TaxableSinglModel.InvoiceID = ((i+1) * -1)
                    TaxableSinglModel.subType = $("#ddlTypeDis" + i).val()
                    TaxableSinglModel.taxType = $("#ddlDisTax" + i).val()
                    TaxableSinglModel.rate = $("#txtPrc_Tax" + i).val()
                    TaxableSinglModel.amount = $("#txtTax_AmontDis" + i).val()
                    TaxableModel.push(TaxableSinglModel);
                }


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



                //------------------------------------- TaxableItem-------------------------
                //--------------------------------------------------New_Ver-----------------------------
                TaxableSinglModel = new TaxableItem();
                TaxableSinglModel.InvoiceID = invoiceItemId
                TaxableSinglModel.subType = ddlTypeTax.value
                TaxableSinglModel.taxType = ddlValueTax.value
                TaxableSinglModel.rate = Number(txtTaxPrc.value)
                TaxableSinglModel.amount = $("#txtTax" + i).val();
                TaxableModel.push(TaxableSinglModel);


                if ($("#ddlDisTax" + i).val() != 'null' && $("#ddlTypeDis" + i).val() != 'null') {
                    TaxableSinglModel = new TaxableItem();
                    TaxableSinglModel.InvoiceID = invoiceItemId
                    TaxableSinglModel.subType = $("#ddlTypeDis" + i).val()
                    TaxableSinglModel.taxType = $("#ddlDisTax" + i).val()
                    TaxableSinglModel.rate = $("#txtPrc_Tax" + i).val()
                    TaxableSinglModel.amount = $("#txtTax_AmontDis" + i).val()
                    TaxableModel.push(TaxableSinglModel);
                }



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

        debugger
        


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
                    DisplayMassage("تم اصدار فاتوره رقم  ( " + res.TrNo + " )", "تم اصدار فاتوره رقم  ( " + res.TrNo + " )", MessageType.Succeed);

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

        Tax = G_CodesDetails.filter(x => x.CodeType == 'Taxtypes')
        TaxType = G_CodesDetails.filter(x => x.CodeType == 'TaxSubtypes')
        let TaxT1 = TaxType.filter(x => x.StdCode == 'T1')

        $('#ddlValueTax').html('')
        $('#ddlTypeTax').html('')

        for (var i = 0; i < Tax.length; i++) {
            $('#ddlValueTax').append('<option  value="' + Tax[i].StdCode + '">' + Tax[i].DescA + '</option>'); 
        }

      

        for (var i = 0; i < TaxT1.length; i++) {
            $('#ddlTypeTax').append('<option   value="' + TaxT1[i].SubCode + '">' + TaxT1[i].DescA + '</option>');
        }



        $('#ddlValueTax').val('T1')
        $('#ddlTypeTax').val('V009')

         


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
        CountGrid = 0;
        $("#Table_Data").html("");
        AddNewRow();
    }

}












