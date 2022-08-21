$(document).ready(function () {
    receiverCompany.InitalizeComponent();
});
var receiverCompany;
(function (receiverCompany) {
    var sys = new SystemTools();
    var SysSession = GetSystemSession(Modules.Quotation);
    var receiversDetails = new Array();
    var GovernDetails = new Array();
    var compcode; //SharedSession.CurrentEnvironment.CompCode;
    var BranchCode; //SharedSession.CurrentEnvironment.CompCode; 
    var Grid = new ESGrid();
    function InitalizeComponent() {
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        GetAllGovenment();
        GetAllreceivers();
    }
    receiverCompany.InitalizeComponent = InitalizeComponent;
    function GetAllreceivers() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customers", "GetAllCustomers"),
            data: { CompCode: compcode },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    receiversDetails = result.Response;
                    InitializeGridControl();
                }
            }
        });
    }
    function GetAllGovenment() {
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customers", "GetAllGovenment"),
            data: { CompCode: compcode },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    debugger;
                    GovernDetails = result.Response;
                }
            }
        });
    }
    function InitializeGridControl() {
        Grid.ESG.NameTable = 'Grad1';
        Grid.ESG.PrimaryKey = 'receiverId';
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
        Grid.ESG.object = new receiver();
        Grid.Column = [
            { title: "ID", Name: "receiverID", Type: "number", value: "0", style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "CompCode", Name: "CompCode", Type: "text", value: compcode.toString(), style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "أسم العميل", Name: "name", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الرقم الضريبي", Name: "id", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الدوله", Name: "country", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "المحافظه", Name: "Code", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Dropdown(GovernDetails, "DescA", null, null) },
            { title: "المدينه", Name: "regionCity", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الشارع", Name: "street", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الرقم البريدي", Name: "postalCode", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الطابق", Name: "floor", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "المكتب", Name: "room", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "علامة مميزه", Name: "landmark", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "معلومات اضافيه", Name: "additionalInformation", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نوع العميل", Name: "type", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
        ];
        BindGridControl(Grid);
        DisplayDataGridControl(receiversDetails, Grid);
    }
    function SaveNew() {
        console.log(Grid.ESG.Model);
        var data = JSON.stringify(Grid.ESG.Model);
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Customers", "Updatereceiver"),
            data: { data: data },
            success: function (d) {
                var result = d;
                if (result.IsSuccess) {
                    GetAllreceivers();
                    DisplayDataGridControl(receiversDetails, Grid);
                }
            }
        });
    }
})(receiverCompany || (receiverCompany = {}));
//# sourceMappingURL=CustomerCompany.js.map