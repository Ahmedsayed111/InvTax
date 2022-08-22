$(document).ready(function () {
    StockDef.InitalizeComponent();
});
var StockDef;
(function (StockDef) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Quotation);
    var I_ItemDetails = new Array();
    var I_D_UOMDetails = new Array();
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode; 
    var Grid = new ESGrid();
    var btnItems;
    function InitalizeComponent() {
        debugger;
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        GetAllItem();
        GetAllUnit();
    }
    StockDef.InitalizeComponent = InitalizeComponent;
    function InitalizeControls() {
    }
    function GetAllItem() {
        debugger;
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Items", "GetAllItem"),
            data: { CompCode: compcode },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    I_ItemDetails = result.Response;
                    for (var i = 0; i < I_ItemDetails.length; i++) {
                        I_ItemDetails[i].StatusCode == 0 ? I_ItemDetails[i].StatusCodeDesc = "غير نشط" : I_ItemDetails[i].StatusCode == 1 ? I_ItemDetails[i].StatusCodeDesc = "تحت التنشيط" : I_ItemDetails[i].StatusCodeDesc = "نشط ";
                    }
                    InitializeGridControl();
                }
            }
        });
    }
    function InitializeGridControl() {
        Grid.ESG.NameTable = 'Grad1';
        Grid.ESG.PrimaryKey = 'ItemID';
        Grid.ESG.Right = true;
        Grid.ESG.Edit = true;
        Grid.ESG.Add = true;
        Grid.ESG.DeleteRow = true;
        Grid.ESG.CopyRow = true;
        Grid.ESG.Back = true;
        Grid.ESG.Save = true;
        Grid.ESG.OnfunctionSave = SaveNew;
        //Grid.ESG.OnfunctionTotal = computeTotal;
        //Grid.ESG.OnRowDoubleClicked = DoubleClicked;
        Grid.ESG.object = new Items();
        Grid.Column = [
            { title: "ID", Name: "ItemID", Type: "number", value: "0", style: "width: 0%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "CompCode", Name: "CompCode", Type: "text", value: compcode.toString(), style: "width: 0%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نوع الكود", Name: "codeType", Type: "text", value: "", style: "width: 5%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "الكود العالمي", Name: "parentCode", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الكود الضريبي", Name: "itemCode", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "اسم الكود انجليزي", Name: "codeName", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "اسم الكود عربي", Name: "codeNameAr", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط من", Name: "activeFrom", Type: "date", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط الي", Name: "activeTo", Type: "date", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الوصف", Name: "description", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الوحده", Name: "UnitCode", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(function () { }) },
            { title: "الحاله", Name: "StatusCodeDesc", value: "", Type: "text", style: "width: 5%", Edit: false, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "تنشيط", Name: "StatusItem", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.checkbox() },
        ];
        BindGridControl(Grid);
        DisplayDataGridControl(I_ItemDetails, Grid);
    }
    function SaveNew() {
        console.log(Grid.ESG.Model);
        var data = JSON.stringify(Grid.ESG.Model);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Items", "UpdateItems"),
            data: { data: data },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetAllItem();
                    DisplayDataGridControl(I_ItemDetails, Grid);
                }
            }
        });
        debugger;
        Ajax.Callsync({
            type: "Get",
            //url: sys.apiUrlCore("HomeSendinvoce","ActivateItems"),
            data: { data: data },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetAllItem();
                    DisplayDataGridControl(I_ItemDetails, Grid);
                }
            }
        });
    }
    function computeTotal() {
        console.log(Grid.ESG.TotalModel);
    }
    function DoubleClicked() {
        alert(Grid.ESG.SelectedKey);
    }
    function GetAllUnit() {
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
})(StockDef || (StockDef = {}));
//# sourceMappingURL=StockDef.js.map