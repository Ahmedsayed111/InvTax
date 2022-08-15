
$(document).ready(() => {
    USERS.InitalizeComponent();
})

namespace USERS {

    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.Users);

    var G_USERSModelfil: Array<G_USERS> = new Array<G_USERS>();
    var G_USERSModel: Array<G_USERS> = new Array<G_USERS>();
    var List_Roles: Array<G_Role> = new Array<G_Role>();
    var G_USERSModle: G_USERS = new G_USERS();
    var ReportGrid: JsGrid = new JsGrid();
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.CompCode;
    var Master: MasterDetailsUserRoles = new MasterDetailsUserRoles();
    var USER_NAME: HTMLInputElement;
    var Tel: HTMLInputElement;
    var USER_CODE: HTMLInputElement;
    var USER_PASSWORD: HTMLInputElement;
    var Create: HTMLButtonElement;
    var IsNew = false;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);
    var Flag_Mastr;
    var Model: G_USERS = new G_USERS();
    var ModelRoleUsers: G_RoleUsers = new G_RoleUsers();
    var BRANCHsingleModel: G_USER_BRANCH = new G_USER_BRANCH();

    var CountGrid = 0;

    export function InitalizeComponent() {

        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        clear();

        DisplayUserRole();
        Display();
        //success_insert();
    }
    function InitalizeControls() {

        USER_NAME = document.getElementById("USER_NAME") as HTMLInputElement;
        Tel = document.getElementById("Tel") as HTMLInputElement;
        USER_CODE = document.getElementById("USER_CODE") as HTMLInputElement;
        USER_PASSWORD = document.getElementById("USER_PASSWORD") as HTMLInputElement;
        Create = document.getElementById("Create") as HTMLButtonElement;
    }
    function InitalizeEvents() {
        Create.onclick = Create_onclick;
    }
    function DisplayUserRole() {


        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "GetG_Role"),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    List_Roles = result.Response as Array<G_Role>;

                    $("#Table_Data").html('');
                    CountGrid = 0;
                    for (var i = 0; i < List_Roles.length; i++) {
                        BuildControls(i);
                        $("#txtDescA" + i).val(List_Roles[i].DescA);
                        $("#txtRemarks" + i).val(List_Roles[i].Remarks);
                        $('#CheckISActive' + i).prop('checked', 'checked');
                        $("#txtRoleId" + i).val(List_Roles[i].RoleId);
                        $("#txt_StatusFlag" + i).val('i');
                        CountGrid += 1;
                    }

                }
            }
        });


    }
    function BuildControls(cnt: number) {
        var html;

        html = '<tr id= "No_Row' + cnt + '" class="  animated zoomIn ">' +
            '<td><input  id="txtDescA' + cnt + '" disabled="disabled"  type="text" class="form-control" placeholder="SR"></td>' +
            '<td><input  id="CheckISActive' + cnt + '" value="0" type="checkbox" style="width: 100px;" class="form-control" placeholder="Unit Price"></td>' +
            '<td class="display_none"><input  id="txtRemarks' + cnt + '" disabled="disabled"  type="number" class="form-control" placeholder="QTY"></td>' +
            '<td class="display_none"><input  id="txtRoleId' + cnt + '" type="hidden" class="form-control"></td>' +
            '<td class="display_none"><input  id="txt_StatusFlag' + cnt + '" type="hidden" class="form-control"></td>' +
            '</tr>';

        $("#Table_Data").append(html);


        $("#CheckISActive" + cnt).on('change', function () {
            if ($("#txt_StatusFlag" + cnt).val() != 'i') {
                $("#txt_StatusFlag" + cnt).val('u');
            }
        });



        return;
    }

    function Create_onclick() {

        if (!validation()) {
            return
        }

        Flag_Mastr = 'i';
        insert();
    } 
    function insert() {

        Assign();

        Assign_BRANCH();
        debugger
        Master.Token = "HGFD-" + SysSession.CurrentEnvironment.Token;
        Master.UserCode = SysSession.CurrentEnvironment.UserCode;




        Ajax.Callsync({
            type: "POST",
            url: sys.apiUrl("G_USERS", "Update"),
            data: JSON.stringify(Master),
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    //DisplayMassage("تم الحفظ", "saved success", MessageType.Succeed);
                    success_insert();
                }
                else {
                    DisplayMassage("الرجاء تحديث الصفحة واعادت تكرارالمحاولة مره اخري ", "Please refresh the page and try again", MessageType.Error);
                }
            }
        });



    } 
    function Assign() {

        Master.G_RoleUsers = new Array<G_RoleUsers>();
        for (var i = 0; i < CountGrid; i++) {
            ModelRoleUsers = new G_RoleUsers();
            if ($("#txt_StatusFlag" + i).val() == 'i' && $("#CheckISActive" + i).prop('checked') == true) {
                ModelRoleUsers.ISActive = $("#CheckISActive" + i).prop('checked')
                ModelRoleUsers.USER_CODE = USER_CODE.value;
                ModelRoleUsers.RoleId = $("#txtRoleId" + i).val();
                ModelRoleUsers.StatusFlag = $("#txt_StatusFlag" + i).val();
                Master.G_RoleUsers.push(ModelRoleUsers);
            }
            if ($("#txt_StatusFlag" + i).val() == 'u') {
                ModelRoleUsers.ISActive = $("#CheckISActive" + i).prop('checked')
                ModelRoleUsers.USER_CODE = USER_CODE.value;
                ModelRoleUsers.RoleId = $("#txtRoleId" + i).val();
                ModelRoleUsers.StatusFlag = $("#txt_StatusFlag" + i).val();
                Master.G_RoleUsers.push(ModelRoleUsers);
            }
            if ($("#txt_StatusFlag" + i).val() == 'd') {
                ModelRoleUsers.RoleId = $("#txtRoleId" + i).val();
                ModelRoleUsers.StatusFlag = $("#txt_StatusFlag" + i).val();
                ModelRoleUsers.ISActive = $("#CheckISActive" + i).prop('checked')
                ModelRoleUsers.USER_CODE = USER_CODE.value;
                Master.G_RoleUsers.push(ModelRoleUsers);
            }
        }

        Model = new G_USERS();

        Model.CompCode = compcode;
        Model.USER_CODE = USER_CODE.value;
        Model.USER_NAME = USER_NAME.value;
        Model.USER_PASSWORD = USER_PASSWORD.value;
        Model.Tel = Tel.value;
        Model.Flag_Mastr = Flag_Mastr;
        if (Flag_Mastr == 'i') {
            Model.CreatedBy = SysSession.CurrentEnvironment.UserCode;
            Model.CreatedAt = DateTimeFormat(Date().toString());
        }
        else {
            Model.UpdatedAt = DateTimeFormat(Date().toString());
            Model.UpdatedBy = SysSession.CurrentEnvironment.UserCode;
        }

        Model.SalesManID = null;
        Model.CashBoxID = null;
        Model.USER_TYPE = 1;

        Master.G_USERS = Model;
        Master.G_USERS.USER_ACTIVE = true;

        //if (chk_IsActive.checked)
        //else
        //    Master.G_USERS.USER_ACTIVE = false;


    }
    function Assign_BRANCH() {

        Master.BRANCHDetailsModel = new Array<G_USER_BRANCH>();
        BRANCHsingleModel.StatusFlag = 'i';
        BRANCHsingleModel.USER_CODE = USER_CODE.value;
        BRANCHsingleModel.COMP_CODE = compcode;
        BRANCHsingleModel.BRA_CODE = 1;
        BRANCHsingleModel.EXECUTE = true;
        BRANCHsingleModel.CREATE = true;
        BRANCHsingleModel.EDIT = true;
        BRANCHsingleModel.DELETE = true;
        BRANCHsingleModel.PRINT = true;
        BRANCHsingleModel.VIEW = true;
        Master.BRANCHDetailsModel.push(BRANCHsingleModel);
    } 


    function validation() {
        if (USER_NAME.value.trim() == "") {
            Errorinput(USER_NAME);
            DisplayMassage('USER_NAME must be entered', 'USER_NAME must be entered', MessageType.Error);
            return false;
        }
        if (Tel.value.trim() == "") {
            Errorinput(Tel);
            DisplayMassage('Phone Name must be entered', 'Phone must be entered', MessageType.Error);
            return false;
        }
        if (USER_CODE.value.trim() == "") {
            Errorinput(USER_CODE);
            DisplayMassage('User name must be entered', 'User name must be entered', MessageType.Error);
            return false;
        }
        if (USER_PASSWORD.value.trim() == "") {
            Errorinput(USER_PASSWORD);
            DisplayMassage('User name must be entered', 'User name must be entered', MessageType.Error);
            return false;
        }

        return true;
    }
    function success_insert() {
        USER_NAME.value = "";
        Tel.value = "";
        USER_CODE.value = "";
        USER_PASSWORD.value = ""; 
        IsNew = true
        $('#btnsave').html('Create')
        Display();
        $('#view').click();
    }
    
    function InitializeGrid() {


        //let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
        //ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "USER_CODE";
        ReportGrid.Paging = true;
        ReportGrid.PageSize = 15;
        ReportGrid.Sorting = true;
        ReportGrid.InsertionMode = JsGridInsertionMode.Binding;
        ReportGrid.Editing = false;
        ReportGrid.Inserting = false;
        ReportGrid.SelectedIndex = 1;
        ReportGrid.SwitchingLanguageEnabled = false;
        ReportGrid.OnItemEditing = () => { };
        ReportGrid.Columns = [

            //{ title: "ID", name: "USER_CODE", type: "text", width: "5%" },
            { title: "User Name ", name: "USER_NAME", type: "text", width: "15%" },
            { title: "User Code", name: "USER_CODE", type: "text", width: "15%" },
            { title: "Phone", name: "Tel", type: "text", width: "15%" },
            {
                title: "Delete",
                width: "5%",
                itemTemplate: (s: string, item: G_USERS): HTMLInputElement => {
                    let txt: HTMLInputElement = document.createElement("input");
                    txt.type = "button";
                    txt.value = ("Delete");
                    txt.id = "butDelete" + item.USER_CODE;
                    txt.className = "dis src-btn btn btn-warning input-sm";

                    txt.onclick = (e) => {
                        DeleteUesr(item.USER_CODE);
                    };
                    return txt;
                }
            },
        ];
        //ReportGrid.Bind();
    }
    function DeleteUesr(USER_CODE: string) {

        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("G_USERS", "deleteUsers"),
            data: { USER_CODE: USER_CODE },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {

                
                    
                } else {
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);

                }
            }
        });

        Display();
    }
    function Display() {

        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("G_USERS", "GetAll"),
            success: (d) => { 
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    G_USERSModel = result.Response as Array<G_USERS>;
                    G_USERSModel = G_USERSModel.filter(x => x.USER_CODE != 'islam');
                    InitializeGrid();
                    ReportGrid.DataSource = G_USERSModel;
                    ReportGrid.Bind();
                }
            }
        });


    }
    function DriverDoubleClick() {

        IsNew = false;
        G_USERSModelfil = G_USERSModel.filter(x => x.USER_CODE == ReportGrid.SelectedKey)
        USER_NAME.value = G_USERSModelfil[0].USER_NAME;
        USER_CODE.value = G_USERSModelfil[0].USER_CODE;
        USER_PASSWORD.value = G_USERSModelfil[0].USER_PASSWORD;
        Tel.value = G_USERSModelfil[0].Tel;
        
        $('#add').click();
        $('#btnsave').addClass('display_none');
        $('#btndelete').addClass('display_none');
    }

    function clear() {
        debugger
        USER_NAME.value = "";
        Tel.value = "";
        USER_CODE.value = "";
        USER_PASSWORD.value = "";
    }
}
