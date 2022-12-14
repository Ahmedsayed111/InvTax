
$(document).ready(() => {
    StockDef.InitalizeComponent();
})

namespace StockDef {

    var sys: SystemTools = new SystemTools();
    var SysSession: SystemSession = GetSystemSession(Modules.StockDef);
    var I_ItemDetails: Array<Items> = new Array<Items>();
    var data: Array<Items> = new Array<Items>();
    var I_D_UOMDetails: Array<I_D_UOM> = new Array<I_D_UOM>();
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.CompCode; 
    var Grid: ESGrid = new ESGrid();

    var btnItems: HTMLButtonElement;



    export function InitalizeComponent() {
        debugger
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);          
        GetAllItem();
        GetAllUnit();
    }
    function InitalizeControls() {

	}                 
    function GetAllItem() {
        debugger
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Items", "GetAllItem"),
            data: { CompCode: compcode },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    debugger

                    I_ItemDetails = result.Response as Array<Items>;
                    for (var i = 0; i < I_ItemDetails.length; i++) {
                        I_ItemDetails[i].StatusCodeDesc = I_ItemDetails[i].StatusCode == 1 ? "تحت التجهيز" : I_ItemDetails[i].StatusCode == 0 ? "جديد" : "نشط";
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
        Grid.ESG.OnfunctionTotal = computeTotal;
        Grid.ESG.OnRowDoubleClicked = DoubleClicked;
        Grid.ESG.object = new Items();
        Grid.Column = [
            { title: "ID", Name: "ItemID", Type: "number", value: "0", style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "CompCode", Name: "CompCode", Type: "text", value: compcode.toString(), style: "width: 10%", Edit: false, visible: false, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نوع الكود", Name: "codeType", Type: "text",value:"", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(true), ColumnType: ControlType.Input() },
            { title: "الكود العالمي", Name: "parentCode", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الكود الضريبي", Name: "itemCode", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "اسم الكود انجليزي", Name: "codeName", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "اسم الكود عربي", Name: "codeNameAr", Type: "text", value: "", style: "width: 30%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط من", Name: "activeFrom", Type: "date" , style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "نشط الي", Name: "activeTo", Type: "date" , style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الوصف", Name: "description", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الوحده", Name: "UnitCode", Type: "text", value: "", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "الحاله", Name: "StatusCodeDesc", value: "0", Type: "text", style: "width: 10%", Edit: false, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.Input() },
            { title: "تنشيط", Name: "StatusItem", value: "0", Type: "text", style: "width: 10%", Edit: true, visible: true, Validation: Valid.Set(false), ColumnType: ControlType.checkbox() },
           
        ]

        BindGridControl(Grid);
        DisplayDataGridControl(I_ItemDetails, Grid);
    }
    function SaveNew() {
        Grid.ESG.Model[0].ClientIDProd = "10d35b27-603c-426f-af72-a96df405dc98";
        Grid.ESG.Model[0].SecretIDProd = "d684b331-f346-4769-91e1-7957979eb855";
        let data = JSON.stringify(Grid.ESG.Model);
         
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("Items", "UpdateItems"),
            data: { data: data },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    let res = result.Response as Root3;
                    if (res.failedItems.length > 0) {
                        DisplayMassage(res.failedItems[0].errors.toString(), '', MessageType.Succeed);

					} else {
                    DisplayMassage('تم رفع عدد '+1+' كود ','', MessageType.Succeed);

					}
                    GetAllItem();
                 DisplayDataGridControl(I_ItemDetails, Grid);

                }
            }
        });
        debugger
         
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
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    I_D_UOMDetails = result.Response as Array<I_D_UOM>;
                }
            }
        });
	} 

}
