$(document).ready(function () {
    Report_Page.InitalizeComponent();
});
var Report_Page;
(function (Report_Page) {
    var btnPDF;
    var btnPrint;
    var result;
    function InitalizeComponent() {
        InitalizeControls();
        InitalizeEvents();
        $('#div_Reports').removeClass('display_none');
        result = localStorage.getItem("result");
        $('#printableArea').html("" + result + "");
        //$('#printableArea').html('<img src="data:image/png;base64,' + result + '" />'); 
        //$('#printableArea').html('' + result + ''); 
        //ImagetoPrint('data:image/png;base64,' + result + '')
    }
    Report_Page.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
        btnPDF = document.getElementById("btnPDF");
        btnPrint = document.getElementById("btnPrint");
    }
    function InitalizeEvents() {
        btnPrint.onclick = print;
        //btnPDF.onclick = btnPDF_onclick;
    }
    $(":file").change(function () {
        alert($(":file").val());
    });
    function btnPDF_onclick() {
        debugger;
        var url = "";
        Ajax.CallAsync({
            url: Url.Action("DownloadDdf", "ReportsPagePrint"),
            data: { url: url },
            success: function (d) {
                alert('ok');
            }
        });
    }
    function print() {
        printDiv("printableArea");
    }
    //function ImagetoPrint(source) {
    //    return "<html><head><scri" + "pt>function step1(){\n" +
    //        "setTimeout('step2()', 10);}\n" +
    //        "function step2(){window.print();window.close()}\n" +
    //        "</scri" + "pt></head><body onload='step1()'>\n" +
    //        "<img src='data:image/png;base64," + source + "' /></body></html>";
    //}
    //function PrintImage(source) {
    //    this.prints = true;
    //    var pwa = window.open('', 'Print-Window', 'height=600,width=800');
    //    pwa.document.open();
    //    pwa.document.write(ImagetoPrint(source));
    //    pwa.document.close();
    //}
    function printDiv(divName) {
        //var printContents = document.getElementById(divName).innerHTML;
        //var originalContents = document.body.innerHTML; 
        //document.body.innerHTML = printContents;
        //window.print();
        //document.body.innerHTML = originalContents;
        var sOption = "toolbar=no,location=no,directories=yes,menubar=no,";
        sOption += "scrollbars=yes,width=775,height=600,left=10,top=25";
        var mywindow = window.open('', 'PRINT', sOption);
        mywindow.document.write(document.getElementById(divName).innerHTML);
        //document.getElementById('header').style.display = 'none';
        //document.getElementById('footer').style.display = 'none';
        //mywindow.document.styl
        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/ 
        mywindow.pageXOffset; // necessary for IE >= 10*/ 
        mywindow.history.back();
        mywindow.onload = function () {
            mywindow.moveTo(0, 0);
            mywindow.resizeTo(640, 480);
        };
        mywindow.print();
        mywindow.close();
    }
    //function ImagetoPrint(source: string) {
    //    var div = document.getElementById(source).innerHTML
    //    return "<html><head><link href='~/css/loader.css' rel='stylesheet' /><scri" + "pt>function step1(){\n" +
    //        "setTimeout('step2()', 10);}\n" +
    //        "function step2(){window.print();window.close()}\n" +
    //        "</scri" + "pt></head><body onload='step1()'>\n" +
    //        "" + div+"</body></html>";
    //}
    //function printDiv(divName: string){
    //    var sOption = "toolbar=no,location=no,directories=yes,menubar=no,";
    //    sOption += "scrollbars=yes,width=775,height=600,left=10,top=25";
    //    var mywindow = window.open('', 'PRINT', sOption);
    //    mywindow.document.open();
    //    mywindow.document.write(ImagetoPrint(divName));
    //    mywindow.document.close();
    //}
})(Report_Page || (Report_Page = {}));
//# sourceMappingURL=Report_Page.js.map