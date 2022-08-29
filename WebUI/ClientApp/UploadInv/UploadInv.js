/// 
$(document).ready(function () {
    LoadingInv.InitalizeComponent();
});
var LoadingInv;
(function (LoadingInv) {
    var TaxModel = new TaxTotal();
    var InvoiceModel = new Documente();
    var InvoiceItemsDetailsModel = new Array();
    var _root = new Root();
    var invoiceItemSingleModel = new InvoiceLine();
    var invoiceTaxSingleModel = new TaxableItem();
    var Model_root = new Root();
    var btnMargin;
    var btnPush;
    var btnRefrash;
    var PackageCount = 0;
    var Totalbefore = 0;
    var CountTotal = 0;
    var TotalAllTaxItems = 0;
    var txtTotAfterTax = 0;
    var VatPrc = 0;
    var vatAmount = 0;
    var txtTax = 0;
    var totalAfterVat = 0;
    var total = 0;
    var Qty = 0;
    var totalvatAmountD = 0;
    var Disount = 0;
    var totalaftarall = 0;
    var totaloutall = 0;
    function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();
    }
    LoadingInv.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnMargin = document.getElementById("btnMargin");
        btnPush = document.getElementById("btnPush");
        btnRefrash = document.getElementById("btnRefrash");
    }
    function InitializeEvents() {
        document.getElementById('uploadMaster').addEventListener('change', function () { LoadExcel('Master'); }, false);
        document.getElementById('uploadDetail').addEventListener('change', function () { LoadExcel('Detail'); }, false);
        document.getElementById('uploadMaster').onclick = function () { NoLoad('Master'); };
        document.getElementById('uploadDetail').onclick = function () { NoLoad('Detail'); };
        btnMargin.onclick = btnMargin_onclick;
        btnPush.onclick = btnPush_onclick;
        btnRefrash.onclick = btnRefrash_onclick;
    }
    function btnRefrash_onclick() {
        location.reload();
    }
    function LoadExcel(Type) {
        setTimeout(function () {
            debugger;
            var json_object = $('#xlx_json' + Type).val();
            var object = JSON.parse(json_object);
            $('#upload' + Type).addClass('background_upload');
        }, 400);
    }
    function NoLoad(Type) {
        $('#upload' + Type).removeClass('background_upload');
    }
    function btnMargin_onclick() {
        debugger;
        var Master_object = $('#xlx_jsonMaster').val();
        var Model_MasterAll = JSON.parse(Master_object);
        var Detail_object = $('#xlx_jsonDetail').val();
        var Model_DetailAll = JSON.parse(Detail_object);
        Model_root = new Root();
        Qty = 0;
        Disount = 0;
        totalaftarall = 0;
        totalvatAmountD = 0;
        totaloutall = 0;
        var Msg = "";
        var _loop_1 = function () {
            var InvoiceNo = Number(Model_MasterAll[i].InvoiceNo);
            var Model_Detail = Model_DetailAll.filter(function (x) { return x.InvoiceNo == InvoiceNo; });
            Qty = 0;
            //if (!ChackDate(Model_MasterAll[i].Date)) {
            //    Msg += " - The date must be between 7 days from the past to today for Invoice No. (" + Model_MasterAll[i].InvoiceNo + ") ";
            //    continue;
            //}
            Assign(Model_MasterAll[i], Model_Detail);
        };
        for (var i = 0; i < Model_MasterAll.length; i++) {
            _loop_1();
        }
        if (!IsNullOrEmpty(Msg))
            alert(Msg);
        InitializeGrid(Model_root.documents);
        $("#totalaftartax").val(totalaftarall.toFixed(2));
        $("#totalouttax").val(totaloutall.toFixed(2));
        $("#totatax").val(totalvatAmountD.toFixed(2));
        $("#textDisount").val((Disount * totalaftarall / 100).toFixed(5));
        $("#totaِAftarDisount").val(((totalaftarall) - (Disount * totalaftarall / 100)).toFixed(5));
    }
    function Assign(Model_Master, Model_Detail) {
        var StatusFlag;
        InvoiceModel = new Documente();
        InvoiceItemsDetailsModel = new Array();
        TaxModel = new TaxTotal();
        _root = new Root();
        ComputeTotals(Model_Detail);
        //------------------------------------------**Document**------------------------------------ 
        InvoiceModel = DocumentActions.AssignToModel(InvoiceModel);
        InvoiceModel.totalSalesAmount = Numeric(CountTotal);
        InvoiceModel.netAmount = InvoiceModel.totalSalesAmount;
        //InvoiceModel.extraDiscountAmount = 0.0;
        InvoiceModel.internalID = Model_Master.InvoiceNo;
        InvoiceModel.totalItemsDiscountAmount = 0;
        //------------------------------------------**Receiver**------------------------------------
        InvoiceModel.receiver.id = IsNullOrEmpty(Model_Master.RegistrationNo) ? "" : Model_Master.RegistrationNo;
        InvoiceModel.receiver.name = Model_Master.ReciverName;
        InvoiceModel.receiver.type = Model_Master.ReciverType;
        //------------------------------------------**Receiver _ address**------------------------------------
        InvoiceModel.receiver.address = DocumentActions.AssignToModel(InvoiceModel.receiver.address);
        InvoiceModel.receiver.address.governate = Model_Master.Governorate;
        InvoiceModel.receiver.address.regionCity = Model_Master.City;
        InvoiceModel.receiver.address.street = Model_Master.Street;
        InvoiceModel.receiver.address.buildingNumber = Model_Master.BuildingNo;
        InvoiceModel.receiver.address.landmark = Model_Master.Landmark;
        InvoiceModel.receiver.address.country = "EG";
        InvoiceModel.dateTimeIssued = DateFormatRep(Model_Master.Date);
        InvoiceModel.documentType = Model_Master.DocumentType;
        InvoiceModel.documentTypeVersion = "1.0";
        Disount = Model_Master.Disount;
        vatAmount = 0;
        var Disountinv = 0; //Details
        var totalAmount = 0; //Details
        var totaltaxEX = 0; //Details
        for (var i = 0; i < Model_Detail.length; i++) {
            invoiceItemSingleModel = new InvoiceLine();
            invoiceTaxSingleModel = new TaxableItem();
            invoiceItemSingleModel.itemCode = Model_Detail[i].ItemCode;
            invoiceItemSingleModel.itemType = Model_Detail[i].ItemType;
            ; //$("#txtType" + i).val();
            invoiceItemSingleModel.description = Model_Detail[i].Description;
            invoiceItemSingleModel.unitType = Model_Detail[i].Unit;
            invoiceItemSingleModel.quantity = Numeric(Number(Model_Detail[i].Qty));
            Qty += Numeric(Number(Model_Detail[i].Qty));
            invoiceItemSingleModel.itemsDiscount = 0;
            total = Number(Model_Detail[i].Price) * Number(Model_Detail[i].Qty);
            debugger;
            Disountinv = Number((total * Number(Model_Master.Disount) / 100).toFixed(2));
            var txtsalesTotalD = Number(Model_Detail[i].Price) * Number(Model_Detail[i].Qty);
            var VatPrcD = Number(Model_Detail[i].TaxRate);
            var vatAmountD = 0;
            if (VatPrcD != 0) {
                vatAmountD = Numeric(Number(total) * VatPrcD / 100);
            }
            var totalAfterVatD = Numeric(Number(vatAmountD.toFixed(2)) + Number(total.toFixed(2)));
            totalaftarall += Numeric(Number(totalAfterVatD));
            totaloutall += Numeric(Number(total));
            totalvatAmountD += Numeric(Number(vatAmountD));
            //الاجمالي بدون ضريبه - (price * qty) 
            invoiceItemSingleModel.salesTotal = Numeric(txtsalesTotalD);
            invoiceItemSingleModel.netTotal = Numeric(txtsalesTotalD);
            invoiceItemSingleModel.unitValue.currencySold = "EGP";
            invoiceItemSingleModel.unitValue.amountEGP = Numeric(Number(Model_Detail[i].Price));
            //------------------------------------------Discount-----------
            invoiceItemSingleModel.discount.amount = 0;
            invoiceItemSingleModel.discount.rate = 0;
            //------------------------------------------TaxableItem-----------
            invoiceTaxSingleModel.amount = Numeric(Number(vatAmountD)); //Number($("#txtsalesTotal" + i).val());//Number($("#txtTax" + i).val());
            vatAmount += invoiceTaxSingleModel.amount;
            invoiceTaxSingleModel.rate = Number(Model_Detail[i].TaxRate);
            invoiceTaxSingleModel.subType = "V003";
            invoiceTaxSingleModel.taxType = "T1";
            invoiceItemSingleModel.taxableItems.push(invoiceTaxSingleModel);
            var result = 0;
            if (Model_Master.Disount > 0) {
                debugger;
                invoiceTaxSingleModel = new TaxableItem();
                invoiceTaxSingleModel.taxType = "T4";
                invoiceTaxSingleModel.subType = "W004";
                invoiceTaxSingleModel.rate = Number(Model_Master.Disount);
                invoiceTaxSingleModel.amount = Number(Disountinv);
                totaltaxEX += Number(Disountinv);
                invoiceItemSingleModel.taxableItems.push(invoiceTaxSingleModel);
            }
            invoiceItemSingleModel.total = Numeric(Number(totalAfterVatD) - Number(Disountinv));
            InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            totalAmount += Numeric(Number(totalAfterVatD));
        }
        InvoiceModel.totalAmount = Numeric(Number(totalAmount) - totaltaxEX);
        InvoiceModel.extraDiscountAmount = 0.00;
        ;
        //------------------------------------------**TaxTotal**------------------------------------      
        TaxModel.taxType = "T1";
        TaxModel.amount = Numeric(vatAmount);
        InvoiceModel.taxTotals.push(TaxModel);
        if (Number(Model_Master.Disount) > 0) {
            var TaxModel_ = new TaxTotal();
            TaxModel_.taxType = "T4";
            TaxModel_.amount = Numeric(totaltaxEX);
            InvoiceModel.taxTotals.push(TaxModel_);
        }
        InvoiceModel.invoiceLines = InvoiceItemsDetailsModel;
        _root.documents.push(InvoiceModel);
        Model_root.documents.push(InvoiceModel);
    }
    function btnPush_onclick() {
        insert();
    }
    function ComputeTotals(Model_Detail) {
        PackageCount = 0;
        Totalbefore = 0;
        CountTotal = 0;
        TotalAllTaxItems = 0;
        txtTotAfterTax = 0;
        VatPrc = 0;
        vatAmount = 0;
        txtTax = 0;
        totalAfterVat = 0;
        total = 0;
        for (var i = 0; i < Model_Detail.length; i++) {
            var txtQuantityValue = Number(Model_Detail[i].Qty);
            var txtPriceValue = Number(Model_Detail[i].Price);
            total = Numeric(Number(txtQuantityValue) * Number(txtPriceValue));
            VatPrc = Number(Model_Detail[i].TaxRate);
            if (VatPrc != 0) {
                vatAmount = Numeric(Number(total) * VatPrc / 100);
            }
            totalAfterVat += Numeric(Number(vatAmount.toFixed(2)) + Number(total.toFixed(2)));
            PackageCount += txtQuantityValue;
            Totalbefore += (txtQuantityValue * txtPriceValue);
            CountTotal += total;
            TotalAllTaxItems += vatAmount;
            txtTotAfterTax += totalAfterVat;
        }
    }
    function insert() {
        debugger;
        var _Uri = Url.Action("ListInvoice", "Home");
        var _Data = JSON.stringify(Model_root.documents);
        Ajax.Callsync({
            "url": _Uri,
            "data": _Data,
            async: false,
            success: function (d) {
                debugger;
                var _res = d;
                var _msg = "";
                for (var i = 0; i < _res.length; i++) {
                    _msg = " ( " + i + ":" + _res[i].message + " ) ";
                    //alert("( " + i + 1 + " ) >> " + _res[i].message);
                    if (_res[i].isSuccess)
                        if (!IsNullOrEmpty(_res[i].uuid)) {
                            console.log("Download Mehtod");
                            console.log(_res);
                        }
                }
            }
        });
    }
    function InitializeGrid(dataSource) {
        $("#jsGrid").jsGrid({
            width: "100%",
            height: "auto",
            sorting: true,
            paging: true,
            autoload: true,
            pageSize: 10,
            data: dataSource,
            fields: [
                { title: "Internal ID", name: "internalID", type: "label", width: "8%" },
                { title: "Date", name: "dateTimeIssued", type: "label", width: "8%" },
                { title: "Receiver No.", name: "receiver.id", type: "label", width: "8%" },
                { title: "Receiver Name", name: "receiver.name", type: "label", width: "20%" },
                { title: "Receiver Type", name: "receiver.type", type: "label", width: "8%" },
                //Sum all all InvoiceLine/SalesTotal items
                { title: "Total without Tax", name: "totalSalesAmount", type: "label", width: "8%" },
                //TotalSales – TotalDiscount
                //{ title: "Net Amount", name: "netAmount", type: "label", width: "8%" },
                //Total amount of the invoice calculated as NetAmount + Totals of tax amounts. 5 decimal digits allowed.
                { title: "Total with Tax", name: "totalAmount", type: "label", width: "8%" },
            ]
        });
    }
})(LoadingInv || (LoadingInv = {}));
//# sourceMappingURL=UploadInv.js.map