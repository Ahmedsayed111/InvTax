
$(document).ready(() => {
    CustomerCompany.InitalizeComponent();
    
})

namespace CustomerCompany {

    var sys: SystemTools = new SystemTools();
    //var sys: _shared = new _shared();
    var SysSession: SystemSession = GetSystemSession(Modules.Companies);

    var Model: Customer = new Customer();
    var CustomerModel: Array <Customer> = new Array <Customer>();                                      
    var CustomerModelfil: Array <Customer> = new Array <Customer>();                                      
    var ReportGrid: JsGrid = new JsGrid();
    var compcode: number;//SharedSession.CurrentEnvironment.CompCode;
    var BranchCode: number;//SharedSession.CurrentEnvironment.CompCode;
   
    var a: HTMLButtonElement;
    var btnsave: HTMLButtonElement;
    var txtNameComp: HTMLInputElement;
    var txtmailComp: HTMLInputElement;
    var txtAddressComp: HTMLInputElement;
    var chkvat: HTMLInputElement;
    var txtRemark: HTMLInputElement;
    var txtTelephone: HTMLInputElement;
    var txtMobile: HTMLInputElement; 
    var IsNew = true;
    var UCustomerId;
    var lang = (SysSession.CurrentEnvironment.ScreenLanguage);

    export function InitalizeComponent() {
        
        compcode = Number(SysSession.CurrentEnvironment.CompCode);
        BranchCode = Number(SysSession.CurrentEnvironment.BranchCode);
        InitalizeControls();
        InitalizeEvents();
        $('#btnsave').html('Create')
        $('#a').click();
        Display();
    }  
    function InitalizeControls() {
        // ;     
        a = document.getElementById("a") as HTMLButtonElement;
        btnsave = document.getElementById("btnsave") as HTMLButtonElement;    
        // inputs
        txtmailComp = document.getElementById("txtmailComp") as HTMLInputElement;
        txtAddressComp = document.getElementById("txtAddressComp") as HTMLInputElement;
        chkvat = document.getElementById("chkvat") as HTMLInputElement;
        txtNameComp = document.getElementById("txtNameComp") as HTMLInputElement;        
        txtRemark = document.getElementById("txtRemark") as HTMLInputElement;
        txtTelephone = document.getElementById("txtTelephone") as HTMLInputElement;
        txtMobile = document.getElementById("txtMobile") as HTMLInputElement;
    }      
    function InitalizeEvents() {       
      btnsave.onclick = btnsave_onclick;
        a.onclick = AddNew;
    }     
    function Assign() { 
        Model = new Customer();     
        Model.CompCode = Number(compcode);
        Model.BranchCode = Number(BranchCode);
        Model.CustomerId = 0;
        Model.NAMEA = txtNameComp.value;
        Model.NAMEE = txtNameComp.value;
        Model.EMAIL = txtmailComp.value;
        Model.Address_Street = txtAddressComp.value;
        Model.Isactive = chkvat.checked;
        Model.REMARKS = txtRemark.value;
        Model.MOBILE = txtMobile.value;
        Model.TEL = txtTelephone.value;
        Model.CREATED_AT = GetTime();
        Model.CREATED_BY = sys.SysSession.CurrentEnvironment.UserCode;   
    }
    function insert() {                
        Assign();        
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "InsertCustomer"),
            data: {   
                NAMEA: Model.NAMEA, NAMEE: Model.NAMEE, EMAIL: Model.EMAIL, Address_Street: Model.Address_Street,
                Isactive: Model.Isactive, REMARKS: Model.REMARKS, CREATED_BY: Model.CREATED_BY, CREATED_AT: Model.CREATED_AT  ,
                Mobile: Model.MOBILE, Telephone: Model.TEL
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    DisplayMassage("Saved successfully", "Saved successfully", MessageType.Error); 
                     success_insert();       
                } else {       
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);
        
                }
            }
        });

    }
    function update() {      
        Assign();        
        Ajax.Callsync({
            type: "Get",
            url: sys.apiUrl("SlsTrSales", "UpdateCustomer"),
            data: {   
                NAMEA: Model.NAMEA, NAMEE: Model.NAMEE, EMAIL: Model.EMAIL, Address_Street: Model.Address_Street,
                Isactive: Model.Isactive, REMARKS: Model.REMARKS, CREATED_BY: Model.CREATED_BY, CREATED_AT: Model.CREATED_AT, CustomerId: UCustomerId,
                Mobile: Model.MOBILE, Telephone: Model.TEL
            },
            success: (d) => {
                let result = d as BaseResponse;
                if (result.IsSuccess == true) {
                    DisplayMassage("Saved successfully", "Saved successfully", MessageType.Error); 
                     success_insert();       
                } else {       
                    DisplayMassage("Please refresh the page and try again", "Please refresh the page and try again", MessageType.Error);
        
                }
            }
        });

    }
    function validation() {
        if (txtNameComp.value.trim() == "") {
            Errorinput(txtNameComp);
            DisplayMassage('Company Name must be entered', 'Company Name must be entered', MessageType.Error);
            return false;
        }
        if (txtmailComp.value.trim() == "") {
            Errorinput(txtmailComp);
            DisplayMassage('Company Name must be entered', 'Company Name must be entered', MessageType.Error);
            return false;
        }
        if (txtAddressComp.value.trim() == "") {
            Errorinput(txtAddressComp);
            DisplayMassage('Address must be entered', 'Address must be entered', MessageType.Error);
            return false;
        }
         
        return true;
    }
    function success_insert() {
        txtNameComp.value = "";
        txtmailComp.value ="";  
        txtAddressComp.value = "";     
        txtRemark.value = "";
        txtTelephone.value = "";
        txtMobile.value = "";
        chkvat.checked = false;
        IsNew = true
        $('#btnsave').html('Create')    
        Display(); 
        $('#b').click();
    }

    function AddNew() {
        txtNameComp.value = "";
        txtmailComp.value = "";
        txtAddressComp.value = "";
        txtRemark.value = "";
        txtTelephone.value = "";
        txtMobile.value = "";
        chkvat.checked = false;
        IsNew = true
        $('#btnsave').html('Create')
       /* Display();*/
        $('#viewmail').addClass('active in');
        $('#composemail').removeClass('active in');

        $('#aa').addClass('active');
        $('#dd').removeClass('active');
    }

    function btnsave_onclick() {
        debugger;
        if (!validation()) return;
         
        if (IsNew == true) {
            insert();
        } else {
            update();
        }


    }    
    function InitializeGrid() {


        //let res: any = GetResourceList("");
        //$("#id_ReportGrid").attr("style", "");
         ReportGrid.OnRowDoubleClicked = DriverDoubleClick;
        ReportGrid.ElementName = "ReportGrid";
        ReportGrid.PrimaryKey = "CustomerId";
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
            
            { title: "ID", name: "CustomerId", type: "text", width: "5%" },
            { title: "Company Name", name: "NAMEE", type: "text", width: "30%" },
            { title: "EMAIL", name: "EMAIL", type: "text", width: "20%" },
            { title: "Address", name: "Address_Street", type: "text", width: "25%" },
            { title: "REMARK", name: "REMARKS", type: "text", width: "20%" },
        ];
        //ReportGrid.Bind();
    }    
    function Display() {
         
        Ajax.Callsync({
            type: "GET",
            url: sys.apiUrl("SlsTrSales", "GetAllCustomer"),
            data: { },
            success: (d) => {
                  
                let result = d as BaseResponse;
                if (result.IsSuccess) {
                    CustomerModel = result.Response as Array<Customer>;

                    InitializeGrid();
                    ReportGrid.DataSource = CustomerModel;
                    ReportGrid.Bind();
                }
            }
        });


    }
    function DriverDoubleClick() {     
        IsNew = false;
        CustomerModelfil = CustomerModel.filter(x => x.CustomerId == Number(ReportGrid.SelectedKey))
        UCustomerId = Number(ReportGrid.SelectedKey);
        txtNameComp.value = CustomerModelfil[0].NAMEE;
        txtmailComp.value = CustomerModelfil[0].EMAIL;
        txtAddressComp.value = CustomerModelfil[0].Address_Street;
        txtRemark.value = CustomerModelfil[0].REMARKS;
        chkvat.checked = CustomerModelfil[0].Isactive;
        txtMobile.value = CustomerModelfil[0].MOBILE;
        txtTelephone.value = CustomerModelfil[0].TEL;
        //$('#a').click();

        $('#viewmail').addClass('active in'); 
        $('#composemail').removeClass('active in');

        $('#aa').addClass('active');
        $('#dd').removeClass('active');

        $('#btnsave').html('Update');       
    }
}












