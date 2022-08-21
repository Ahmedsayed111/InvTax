$(document).ready(function () {
    Downloadinv.InitalizeComponent();
});
var Downloadinv;
(function (Downloadinv) {
    var InvoiceModel = new Documente();
    var InvoiceLst = new Array();
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.StockDef);
    var btnSearch;
    var txtSearch;
    var fromno;
    var tono;
    var sales;
    var Putcher;
    var inv;
    var invfrom;
    var invto;
    var puch;
    var puchfrom;
    var puchvto;
    var searchbutmemreport;
    var Page = true;
    var pageIndex;
    function InitalizeComponent() {
        //InitalizeControls();
        //InitializeEvents();
        //DownloadList();
        var d = new Date();
        var day = d.getDate();
        debugger;
        var dd = $("#sales").prop("checked");
        var rr = $("#Putcher").prop("checked");
        $("#puchfrom").val(GetDate().toString());
        $("#puchvto").val(GetDate().toString());
        $("#puchfrom").attr("disabled", "disabled");
        $("#puchvto").attr("disabled", "disabled");
    }
    Downloadinv.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnSearch = document.getElementById("btnSearch");
        txtSearch = document.getElementById("navbar-search-input");
        searchbutmemreport = document.getElementById("searchbutmemreport");
        sales = document.getElementById("sales");
        Putcher = document.getElementById("Putcher");
        inv = document.getElementById("inv");
        invfrom = document.getElementById("invfrom");
        invto = document.getElementById("invto");
        puch = document.getElementById("puch");
        puchfrom = document.getElementById("puchfrom");
        puchvto = document.getElementById("puchvto");
    }
    function InitializeEvents() {
    }
    $("#All").on('click', function () {
        debugger;
        //if ($("#sales").prop("checked") == "true") {
        $("#puchfrom").attr("disabled", "disabled");
        $("#puchvto").attr("disabled", "disabled");
        $("#invfrom").attr("disabled", "disabled");
        $("#invto").attr("disabled", "disabled");
    });
    $("#sales").on('click', function () {
        debugger;
        //if ($("#sales").prop("checked") == "true") {
        $("#puchfrom").attr("disabled", "disabled");
        $("#puchvto").attr("disabled", "disabled");
        $("#invfrom").removeAttr("disabled");
        $("#invto").removeAttr("disabled");
        //$("#pageNo").removeAttr("disabled")
        //$("#pageSize").removeAttr("disabled")
    });
    $("#Putcher").on('click', function () {
        debugger;
        /* if ($("#sales").prop("checked") == "true") {*/
        $("#puchfrom").removeAttr("disabled");
        $("#puchvto").removeAttr("disabled");
        $("#invfrom").attr("disabled", "disabled");
        $("#invto").attr("disabled", "disabled");
        //$("#pageNo").attr("disabled", "disabled")
        //$("#pageSize").attr("disabled", "disabled")
    });
    $("#btnDownload").on('click', function () {
        debugger;
        var _from_ = "";
        var _to_ = "";
        var _tyep_ = 0;
        if ($("#sales").prop("checked")) {
            _tyep_ = 1;
            _from_ = $("#invfrom").val();
            _to_ = $("#invto").val();
            var pageNo = $("#pageNo").val();
            var pageSize = $("#pageSize").val();
        }
        else if ($("#Putcher").prop("checked")) {
            _tyep_ = 2;
            _from_ = $("#puchfrom").val();
            _to_ = $("#puchvto").val();
        }
        else {
            _tyep_ = 0;
            _from_ = $("#puchfrom").val();
            _to_ = $("#puchvto").val();
        }
        DownloadList(_from_, _to_, pageNo, pageSize, _tyep_);
    });
    function GetDate() {
        var today = new Date();
        var dd = today.getDate().toString();
        var ReturnedDate;
        var mm = (today.getMonth() + 1).toString();
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
    function DownloadList(_from, _to, pageNo, pageSize, _tyep) {
        debugger;
        var ClientIDProd_ = "531b1531-d482-46c6-9e87-da8bc33f4fd3";
        var SecretIDProd_ = "97959a2a-1829-42b4-8330-20d1b829c6bf";
        var RegistrationNumber_ = "200154257";
        var PDFFolder_ = SysSession.CurrentEnvironment.I_Control[0].DocPDFFolder;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Items", "DownloadList"),
            data: { from: _from, to: _to, pageNo: pageNo, pageSize: pageSize, tyep: _tyep, ClientIDProd: ClientIDProd_, SecretIDProd: SecretIDProd_, RegistrationNumber: RegistrationNumber_, PDFFolder: PDFFolder_ },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                }
            }
        });
    }
})(Downloadinv || (Downloadinv = {}));
//# sourceMappingURL=Downloadinv.js.map