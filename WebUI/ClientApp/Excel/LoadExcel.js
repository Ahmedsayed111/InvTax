var ExcelToJSON_Master = function () {

    this.parseExcel_Master = function (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                //console.log(JSON.parse(json_object));
                jQuery('#xlx_jsonMaster').val(json_object);
            })
        };

        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

var ExcelToJSON_Detail = function () {

    this.parseExcel_Detail = function (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                //console.log(JSON.parse(json_object));
                jQuery('#xlx_jsonDetail').val(json_object);
            })
        };

        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

function handleFileSelectMaster(evt) {

    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON_Master();
    xl2json.parseExcel_Master(files[0]);

}

function handleFileSelectDetail(evt) {

    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON_Detail();
    xl2json.parseExcel_Detail(files[0]);

}


//-------------------------------------------------------------


document.getElementById('uploadMaster').addEventListener('change', handleFileSelectMaster, false);

document.getElementById('uploadDetail').addEventListener('change', handleFileSelectDetail, false);