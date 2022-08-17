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
            url: sys.apiUrl("SlsTrSales", "GetAllItem"),
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
            { title: "ID", Name: "ItemID", Type: "text", style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "codeType", Name: "codeType", Type: "text", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "parentCode", Name: "parentCode", Type: "text", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "itemCode", Name: "itemCode", Type: "text", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "codeName", Name: "codeName", Type: "text", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "activeFrom", Name: "activeFrom", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "activeTo", Name: "activeTo", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "description", Name: "description", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "UnitCode", Name: "UnitCode", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "StatusCode", Name: "StatusCode", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
        ];
        BindGridControl(Grid);
        DisplayDataGridControl(I_ItemDetails, Grid);
    }
    function SaveNew() {
        debugger;
        alert(Grid.ESG.Model);
        console.log(Grid.ESG.Model);
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