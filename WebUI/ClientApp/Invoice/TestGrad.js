$(document).ready(function () {
    TestGrad.InitalizeComponent();
});
var TestGrad;
(function (TestGrad) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Quotation);
    var I_D_UOMDetails = new Array();
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode; 
    var Grid = new ESGrid();
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
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
        InitializeGridControl();
    }
    TestGrad.InitalizeComponent = InitalizeComponent;
    function InitializeGridControl() {
        var _this = this;
        Grid.ESG.NameTable = 'Grad1';
        Grid.ESG.PrimaryKey = 'UomID';
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
        Grid.ESG.object = new I_D_UOM();
        Grid.Column = [
            { title: "ID", Name: "UomID", value: "0", Type: "text", style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الرقم", Name: "UomCode", value: "0", Type: "text", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Dropdown(I_D_UOMDetails, 'DescA', function () { }, function () { }, function () { console.log(_this); }) },
            { title: "الاسم", Name: "DescA", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(function () { }, function () { }, function () { }) },
            { title: "العمر", Name: "DescE", value: "1", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(function () { }, function () { }, function () { console.log(_this); }) },
            { title: "رقم التيلفون", Name: "CompCode", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(function () { }, function () { }, function () { console.log(_this); }) },
            { title: "رقم البطاقه", Name: "Remarks", value: "BUT", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(function () { }, function () { }, function () { }) },
            { title: "النوع", Name: "CreatedAt", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(function () { }, function () { ('CreatedBy').Set_Val(('CreatedAt').Get_Val(Grid), Grid); }, function () { console.log(_this.propone); }) },
            { title: "الملاحظات", Name: "CreatedBy", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(true, 'مينفع تساوي (100)', ['='], '100'), ColumnType: ControlType.Input(function () { }, function () { }, function () { console.log(_this); }) },
            { title: "رصيد", Name: "Cheack", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.checkbox(function () { alert(('Cheack').Get_Cheak(Grid)); }, function () { }, function () { }) },
        ];
        BindGridControl(Grid);
        DisplayDataGridControl(I_D_UOMDetails, Grid);
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
})(TestGrad || (TestGrad = {}));
//# sourceMappingURL=TestGrad.js.map