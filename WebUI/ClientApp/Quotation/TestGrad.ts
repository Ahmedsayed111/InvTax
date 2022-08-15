
$(document).ready(() => {
    TestGrad.InitalizeComponent();
})

namespace TestGrad {

    var sys: SystemTools = new SystemTools(); 
    var SysSession: SystemSession = GetSystemSession(Modules.Quotation); 
    var I_D_UOMDetails: Array<I_D_UOM> = new Array<I_D_UOM>(); 
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.CompCode; 
    var Grid: ESGrid = new ESGrid();

    export function InitalizeComponent() {
         
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "GetAllUOM"),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    I_D_UOMDetails = result.Response as Array<I_D_UOM>;
                }
            }
        });
         
        InitializeGridControl(); 
    }
     
    function InitializeGridControl() {
         
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
            { title: "الرقم", Name: "UomCode", value: "0", Type: "text", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Dropdown(I_D_UOMDetails, 'DescA', () => { }, () => { }, () => { console.log(this) }) },
            { title: "الاسم", Name: "DescA", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(() => { }, () => { }, () => {   }) },
            { title: "العمر", Name: "DescE", value: "1", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false),ColumnType: ControlType.Input(() => {  }, () => { }, () => { console.log(this) }) },
            { title: "رقم التيلفون", Name: "CompCode", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(() => { }, () => { }, () => { console.log(this) }) },
            { title: "رقم البطاقه", Name: "Remarks", value: "BUT", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(() => { }, () => { }, () => { }) },
            { title: "النوع", Name: "CreatedAt", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input(() => { }, () => { ('CreatedBy').Set_Val(('CreatedAt').Get_Val(Grid), Grid) }, () => { console.log(this.propone) }) },
            { title: "الملاحظات", Name: "CreatedBy", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(true,'مينفع تساوي (100)' ,['='] ,'100'), ColumnType: ControlType.Input(() => { }, () => { }, () => { console.log(this) }) },
            { title: "رصيد", Name: "Cheack", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.checkbox(() => { alert(('Cheack').Get_Cheak(Grid)) }, () => { }, () => { }) },
        ]

        BindGridControl(Grid); 
        DisplayDataGridControl(I_D_UOMDetails, Grid); 
    }
    function SaveNew() {
        debugger
        alert(Grid.ESG.Model)

        console.log(Grid.ESG.Model)
    }
    function computeTotal() { 
        console.log(Grid.ESG.TotalModel); 
    }   
    function DoubleClicked() {
        alert(Grid.ESG.SelectedKey);    
    }
      
}












