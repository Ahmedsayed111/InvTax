$(document).ready(function () {
    StockDef.InitalizeComponent();
});
var StockDef;
(function (StockDef) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.StockDef);
    var I_ItemDetails = new Array();
    var data = new Array();
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
                    debugger;
                    I_ItemDetails = result.Response;
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
        Grid.ESG.OnfunctionTotal = computeTotal;
        Grid.ESG.OnRowDoubleClicked = DoubleClicked;
        Grid.ESG.object = new Items();
        Grid.Column = [
            { title: "ID", Name: "ItemID", Type: "number", value: "0", style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "CompCode", Name: "CompCode", Type: "text", value: compcode.toString(), style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نوع الكود", Name: "codeType", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "الكود العالمي", Name: "parentCode", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الكود الضريبي", Name: "itemCode", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "اسم الكود انجليزي", Name: "codeName", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "اسم الكود عربي", Name: "codeNameAr", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط من", Name: "activeFrom", Type: "date", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط الي", Name: "activeTo", Type: "date", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الوصف", Name: "description", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الوحده", Name: "UnitCode", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط", Name: "StatusCode", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "تنشيط", Name: "StatusItem", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.checkbox() },
        ];
        BindGridControl(Grid);
        DisplayDataGridControl(I_ItemDetails, Grid);
    }
    function SaveNew() {
        Grid.ESG.Model[0].ClientIDProd = "10d35b27-603c-426f-af72-a96df405dc98";
        Grid.ESG.Model[0].SecretIDProd = "d684b331-f346-4769-91e1-7957979eb855";
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
    }
    function computeTotal() {
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