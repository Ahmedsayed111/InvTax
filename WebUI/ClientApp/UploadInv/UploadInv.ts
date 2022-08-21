/// 

$(document).ready(() => {
    LoadingInv.InitalizeComponent();
})

namespace LoadingInv {
    var TaxModel: TaxTotal = new TaxTotal();
    var InvoiceModel: Documente = new Documente();
    var InvoiceItemsDetailsModel: Array<InvoiceLine> = new Array<InvoiceLine>();
    var _root: Root = new Root();
    var invoiceItemSingleModel: InvoiceLine = new InvoiceLine();
    var invoiceTaxSingleModel: TaxableItem = new TaxableItem();
    var Model_root: Root = new Root();


    var btnMargin: HTMLButtonElement;
    var btnPush: HTMLButtonElement;
    var btnRefrash: HTMLButtonElement;
    let PackageCount = 0;
    let Totalbefore = 0;
    let CountTotal = 0;
    let TotalAllTaxItems = 0;
    let txtTotAfterTax = 0;
    let VatPrc = 0;
    var vatAmount = 0;
    var txtTax = 0;
    var totalAfterVat = 0;
    var total = 0;
    var Qty = 0;
    var totalvatAmountD = 0;
    var Disount = 0;
    var totalaftarall = 0;
    var totaloutall = 0;
    export function InitalizeComponent() {
        InitalizeControls();
        InitializeEvents();


    }
    function InitalizeControls() {
        btnMargin = document.getElementById("btnMargin") as HTMLButtonElement;
        btnPush = document.getElementById("btnPush") as HTMLButtonElement;
        btnRefrash = document.getElementById("btnRefrash") as HTMLButtonElement;
    }
    function InitializeEvents() {
        document.getElementById('uploadMaster').addEventListener('change', () => { LoadExcel('Master'); }, false);
        document.getElementById('uploadDetail').addEventListener('change', () => { LoadExcel('Detail') }, false);
        document.getElementById('uploadMaster').onclick = () => { NoLoad('Master'); }
        document.getElementById('uploadDetail').onclick = () => { NoLoad('Detail'); }
        btnMargin.onclick = btnMargin_onclick;
        btnPush.onclick = btnPush_onclick;
        btnRefrash.onclick = btnRefrash_onclick;
    }
    function btnRefrash_onclick() {

        location.reload();

    }
    function LoadExcel(Type: string) {
        setTimeout(function () {
            debugger
            let json_object = $('#xlx_json' + Type).val();
            let object = JSON.parse(json_object);
             $('#upload' + Type).addClass('background_upload');
        }, 400);

    }
    function NoLoad(Type: string) {
        $('#upload' + Type).removeClass('background_upload');
    }

    function btnMargin_onclick() {
         debugger
        let Master_object = $('#xlx_jsonMaster').val();
        let Model_MasterAll = JSON.parse(Master_object);

        let Detail_object = $('#xlx_jsonDetail').val();
        
        let Model_DetailAll = JSON.parse(Detail_object);
         

        Model_root = new Root();
        Qty = 0;
        Disount = 0;
        totalaftarall = 0;
        totalvatAmountD = 0;
        totaloutall = 0;
        let Msg = "";

        for (var i = 0; i < Model_MasterAll.length; i++) {
             
            let InvoiceNo = Number(Model_MasterAll[i].InvoiceNo)
            let Model_Detail = Model_DetailAll.filter(x => x.InvoiceNo == InvoiceNo);
            Qty = 0;
            //if (!ChackDate(Model_MasterAll[i].Date)) {
            //    Msg += " - The date must be between 7 days from the past to today for Invoice No. (" + Model_MasterAll[i].InvoiceNo + ") ";
            //    continue;
            //}
            Assign(Model_MasterAll[i], Model_Detail)
        }

        if (!IsNullOrEmpty(Msg))
            alert(Msg)

        InitializeGrid(Model_root.documents)
        $("#totalaftartax").val(totalaftarall.toFixed(2));
        $("#totalouttax").val(totaloutall.toFixed(2));
        $("#totatax").val(totalvatAmountD.toFixed(2));
        $("#textDisount").val((Disount * totalaftarall / 100).toFixed(5));
        $("#totaِAftarDisount").val(((totalaftarall) - (Disount * totalaftarall / 100)).toFixed(5));
    }


    function Assign(Model_Master: any, Model_Detail: any) {
         
        var StatusFlag: String;
        InvoiceModel = new Documente();
        InvoiceItemsDetailsModel = new Array<InvoiceLine>();
        TaxModel = new TaxTotal();
        _root = new Root();
        ComputeTotals(Model_Detail)
        //------------------------------------------**Document**------------------------------------ 
        InvoiceModel = DocumentActions.AssignToModel<Documente>(InvoiceModel);
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
        InvoiceModel.receiver.address = DocumentActions.AssignToModel<Address>(InvoiceModel.receiver.address);
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
        let Disountinv = 0;        //Details
        let totalAmount = 0;        //Details
        let totaltaxEX = 0;        //Details
        for (var i = 0; i < Model_Detail.length; i++) {

            invoiceItemSingleModel = new InvoiceLine();
            invoiceTaxSingleModel = new TaxableItem();
            invoiceItemSingleModel.itemCode = Model_Detail[i].ItemCode;
            invoiceItemSingleModel.itemType = Model_Detail[i].ItemType;;//$("#txtType" + i).val();
            invoiceItemSingleModel.description = Model_Detail[i].Description;
            invoiceItemSingleModel.unitType = Model_Detail[i].Unit;
            invoiceItemSingleModel.quantity = Numeric(Number(Model_Detail[i].Qty));
            Qty += Numeric(Number(Model_Detail[i].Qty));



            invoiceItemSingleModel.itemsDiscount = 0;

            total = Number(Model_Detail[i].Price) * Number(Model_Detail[i].Qty)
            debugger
            Disountinv = Number((total * Number(Model_Master.Disount) / 100).toFixed(2))
           
            let txtsalesTotalD = Number(Model_Detail[i].Price) * Number(Model_Detail[i].Qty)
            let VatPrcD = Number(Model_Detail[i].TaxRate);
            let vatAmountD = 0;
            if (VatPrcD != 0) {
                vatAmountD = Numeric(Number(total) * VatPrcD / 100);
            }
            let totalAfterVatD = Numeric(Number(vatAmountD.toFixed(2)) + Number(total.toFixed(2))); 
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
 
            invoiceTaxSingleModel.amount = Numeric(Number(vatAmountD));//Number($("#txtsalesTotal" + i).val());//Number($("#txtTax" + i).val());
            vatAmount += invoiceTaxSingleModel.amount;
            invoiceTaxSingleModel.rate = Number(Model_Detail[i].TaxRate)
            invoiceTaxSingleModel.subType = "V003";
            invoiceTaxSingleModel.taxType = "T1";
            invoiceItemSingleModel.taxableItems.push(invoiceTaxSingleModel);
              
            var result = 0;
            if (Model_Master.Disount > 0) {
                debugger
              invoiceTaxSingleModel = new TaxableItem(); 
              invoiceTaxSingleModel.taxType = "T4"; 
              invoiceTaxSingleModel.subType = "W004";
              invoiceTaxSingleModel.rate = Number(Model_Master.Disount);
              invoiceTaxSingleModel.amount = Number(Disountinv) ;
              totaltaxEX += Number(Disountinv); 
              invoiceItemSingleModel.taxableItems.push(invoiceTaxSingleModel);

            }
            invoiceItemSingleModel.total = Numeric(Number(totalAfterVatD) - Number(Disountinv) );
            InvoiceItemsDetailsModel.push(invoiceItemSingleModel);
            totalAmount += Numeric(Number(totalAfterVatD));
        }
        InvoiceModel.totalAmount = Numeric(Number(totalAmount) - totaltaxEX );
        InvoiceModel.extraDiscountAmount = 0.00;
  ;

        //------------------------------------------**TaxTotal**------------------------------------      
        TaxModel.taxType = "T1";
        TaxModel.amount = Numeric(vatAmount);
        InvoiceModel.taxTotals.push(TaxModel);
         
         if (Number(Model_Master.Disount) > 0) {
            let TaxModel_ = new TaxTotal();
             TaxModel_.taxType = "T4"
           
             TaxModel_.amount = Numeric(totaltaxEX) ;
            InvoiceModel.taxTotals.push(TaxModel_);

        }
        InvoiceModel.invoiceLines = InvoiceItemsDetailsModel;
        _root.documents.push(InvoiceModel);
        
        Model_root.documents.push(InvoiceModel);
    }

    function btnPush_onclick() {
        insert()
    }

    function ComputeTotals(Model_Detail: any) {
         
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
        for (let i = 0; i < Model_Detail.length; i++) {
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
        debugger
        let _Uri: string = Url.Action("ListInvoice", "Home");
        
        let _Data: string = JSON.stringify(Model_root.documents);
         Ajax.Callsync(
            {
                "url": _Uri,
                "data": _Data,
                async: false,
                success: (d) => {
                    debugger
                    let _res: Array<ClientResponseModel> = d as Array<ClientResponseModel>;
                    let _msg: string = "";
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
            }
        )
    }

    function InitializeGrid(dataSource: any) {

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
}