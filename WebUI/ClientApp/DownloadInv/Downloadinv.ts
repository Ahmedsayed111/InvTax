$(document).ready(() => {
    Downloadinv.InitalizeComponent();
})

namespace Downloadinv {
    var InvoiceModel: Documente = new Documente();
    var InvoiceLst: Array<Documente> = new Array<Documente>();
    var dataSource: Array<VDocument>;
    var frestdataSource: Array<VDocument>;
    var dataSourcefeltar: Array<VDocument>;
    var dataSourceDownload: Array<TblFile>;
    var btnSearch: HTMLElement;
    var txtSearch: HTMLButtonElement;

    var fromno: HTMLInputElement;
    var tono: HTMLInputElement;
    var sales: HTMLInputElement;
    var Putcher: HTMLInputElement;
    var inv: HTMLInputElement;
    var invfrom: HTMLInputElement;
    var invto: HTMLInputElement;
    var puch: HTMLInputElement;
    var puchfrom: HTMLInputElement;
    var puchvto: HTMLInputElement;


    var searchbutmemreport: HTMLInputElement;
    var Page = true;
    let pageIndex;
    export function InitalizeComponent() {

        //InitalizeControls();
        //InitializeEvents();

        //DownloadList();
        const d = new Date();
        let day = d.getDate();
        debugger
        let dd = $("#sales").prop("checked");
        let rr = $("#Putcher").prop("checked");

        $("#puchfrom").val(GetDate().toString());
        $("#puchvto").val(GetDate().toString());

        $("#puchfrom").attr("disabled", "disabled")
        $("#puchvto").attr("disabled", "disabled")




    }

    function InitalizeControls() {
        btnSearch = document.getElementById("btnSearch") as HTMLElement;
        txtSearch = document.getElementById("navbar-search-input") as HTMLInputElement;
        searchbutmemreport = document.getElementById("searchbutmemreport") as HTMLInputElement;
        sales = document.getElementById("sales") as HTMLInputElement;
        Putcher = document.getElementById("Putcher") as HTMLInputElement;
        inv = document.getElementById("inv") as HTMLInputElement;
        invfrom = document.getElementById("invfrom") as HTMLInputElement;
        invto = document.getElementById("invto") as HTMLInputElement;
        puch = document.getElementById("puch") as HTMLInputElement;
        puchfrom = document.getElementById("puchfrom") as HTMLInputElement;
        puchvto = document.getElementById("puchvto") as HTMLInputElement;
    }

    function InitializeEvents() {



    }

    $("#All").on('click', function () {
        debugger
        //if ($("#sales").prop("checked") == "true") {
        $("#puchfrom").attr("disabled", "disabled")
        $("#puchvto").attr("disabled", "disabled")

        $("#invfrom").attr("disabled", "disabled");
        $("#invto").attr("disabled", "disabled");


    });
    $("#sales").on('click', function () {
        debugger
        //if ($("#sales").prop("checked") == "true") {
        $("#puchfrom").attr("disabled", "disabled")
        $("#puchvto").attr("disabled", "disabled")
        $("#invfrom").removeAttr("disabled")
        $("#invto").removeAttr("disabled")
        //$("#pageNo").removeAttr("disabled")
        //$("#pageSize").removeAttr("disabled")


    });
    $("#Putcher").on('click', function () {
        debugger
        /* if ($("#sales").prop("checked") == "true") {*/
        $("#puchfrom").removeAttr("disabled")
        $("#puchvto").removeAttr("disabled")
        $("#invfrom").attr("disabled", "disabled")
        $("#invto").attr("disabled", "disabled")
        //$("#pageNo").attr("disabled", "disabled")
        //$("#pageSize").attr("disabled", "disabled")


    });
    $("#btnDownload").on('click', function () {
        debugger
        var _from_ = "";
        var _to_ = "";
        var _tyep_ = 0;
        if ($("#sales").prop("checked")) {
            _tyep_ = 1;
            _from_ = $("#invfrom").val();
            _to_ = $("#invto").val();
            var pageNo = $("#pageNo").val();
            var pageSize = $("#pageSize").val();

        } else if ($("#Putcher").prop("checked")) {
            _tyep_ = 2;
            _from_ = $("#puchfrom").val();
            _to_ = $("#puchvto").val();
        }
        else
        {
            _tyep_ = 0;
            _from_ = $("#puchfrom").val();
            _to_ = $("#puchvto").val();
        }
        DownloadList(_from_, _to_, pageNo, pageSize, _tyep_)

    });

    function GetDate() {
        var today: Date = new Date();
        var dd: string = today.getDate().toString();
        var ReturnedDate: string;
        var mm: string = (today.getMonth() + 1).toString();
        var yyyy = today.getFullYear();
        if (Number(dd) < 10) {
            dd = ('0' + dd);
        }
        if (Number(mm) < 10) {
            mm = ('0' + mm);
        }
        ReturnedDate = yyyy + '-' + mm + '-' + dd;
        return ReturnedDate;
    }



    function DownloadList(_from: string, _to: string, pageNo: string, pageSize: string, _tyep: number) {


        let _Uri: string = Url.Action("DownloadList", "Home");
        Ajax.CallAsync(
            {
                "url": _Uri,
                "data": { from: _from, to: _to, pageNo: pageNo, pageSize: pageSize, tyep: _tyep },
                success: (d) => {
                    if (d == null) {
                        dataSource = new Array<VDocument>();
                        alert("Document No. Not Exist");
                    } else {
                        dataSource = d as Array<VDocument>;
                    }
                }
            }
        )
    }








}