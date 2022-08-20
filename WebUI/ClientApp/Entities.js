var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var SecurityClass = /** @class */ (function () {
    function SecurityClass() {
    }
    return SecurityClass;
}());
var FavModules = /** @class */ (function () {
    function FavModules() {
    }
    return FavModules;
}());
var SystemParameters = /** @class */ (function () {
    function SystemParameters() {
    }
    return SystemParameters;
}());
var APISessionRecord = /** @class */ (function () {
    function APISessionRecord() {
    }
    APISessionRecord.prototype.SetAPISession = function (key, value) {
        $.ajax({
            url: Url.Action("SetSessionRecordValue", "Session"),
            data: { propertyName: key, value: value },
            async: false
        });
    };
    APISessionRecord.prototype.GetAPISession = function (key) {
        var value = $.ajax({
            url: Url.Action("GetSessionRecordValue", "Session"),
            data: { propertyName: key },
            async: false
        }).responseJSON.result;
        return value;
    };
    Object.defineProperty(APISessionRecord.prototype, "SystemCode", {
        get: function () {
            return this.GetAPISession("SystemCode");
        },
        set: function (value) {
            this.SetAPISession("SystemCode", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "SubSystemCode", {
        get: function () {
            return this.GetAPISession("SubSystemCode");
        },
        set: function (value) {
            this.SetAPISession("SubSystemCode", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "Modulecode", {
        get: function () {
            return this.GetAPISession("Modulecode");
        },
        set: function (value) {
            this.SetAPISession("Modulecode", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "UserCode", {
        get: function () {
            return this.GetAPISession("UserCode");
        },
        set: function (value) {
            this.SetAPISession("UserCode", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "Token", {
        get: function () {
            return this.GetAPISession("Token");
        },
        set: function (value) {
            this.SetAPISession("Token", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "CompCode", {
        get: function () {
            return this.GetAPISession("CompCode");
        },
        set: function (value) {
            this.SetAPISession("CompCode", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "BranchCode", {
        get: function () {
            return this.GetAPISession("BranchCode");
        },
        set: function (value) {
            this.SetAPISession("BranchCode", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "CurrentYear", {
        get: function () {
            return this.GetAPISession("CurrentYear");
        },
        set: function (value) {
            this.SetAPISession("CurrentYear", value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(APISessionRecord.prototype, "ScreenLanguage", {
        get: function () {
            return this.GetAPISession("ScreenLanguage");
        },
        set: function (value) {
            this.SetAPISession("ScreenLanguage", value);
        },
        enumerable: false,
        configurable: true
    });
    return APISessionRecord;
}());
var SlsInvoiceMasterDetails = /** @class */ (function (_super) {
    __extends(SlsInvoiceMasterDetails, _super);
    function SlsInvoiceMasterDetails() {
        var _this = _super.call(this) || this;
        _this.Sls_Ivoice = new Sls_Ivoice();
        _this.Sls_InvoiceDetail = new Array();
        return _this;
    }
    return SlsInvoiceMasterDetails;
}(SecurityClass));
var EntityContext = /** @class */ (function () {
    function EntityContext() {
    }
    return EntityContext;
}());
var ResponseResult = /** @class */ (function () {
    function ResponseResult() {
    }
    return ResponseResult;
}());
var BaseResponse = /** @class */ (function () {
    function BaseResponse() {
    }
    return BaseResponse;
}());
var ReportParameters = /** @class */ (function () {
    function ReportParameters() {
    }
    return ReportParameters;
}());
var G_BRANCH = /** @class */ (function (_super) {
    __extends(G_BRANCH, _super);
    function G_BRANCH() {
        var _this = _super.call(this) || this;
        _this.COMP_CODE = 0;
        _this.BRA_CODE = 0;
        _this.BRA_DESC = "";
        _this.BRA_TYPE = 0;
        _this.BRA_DESCL = "";
        _this.BRA_SHORTA = "";
        _this.BRA_SHORTL = "";
        _this.REGION_CODE = "";
        _this.City = "";
        _this.Address = "";
        _this.Tel = "";
        _this.Fax = "";
        _this.Email = "";
        _this.WebSite = "";
        _this.BranchManager = "";
        _this.HRResponsible = "";
        _this.FinanceResponsible = "";
        _this.SalesManager = "";
        _this.CUSTOM1 = "";
        _this.CUSTOM2 = "";
        _this.CUSTOM3 = "";
        _this.CUSTOM4 = "";
        _this.CUSTOM5 = "";
        _this.CUSTOMFLAG1 = false;
        _this.CUSTOMFLAG2 = false;
        _this.CUSTOMNUM1 = 0;
        _this.CUSTOMNUM2 = 0;
        _this.CUSTOMDATE = "";
        _this.BRA_DESCE = "";
        _this.GroupVatNo = "";
        _this.VndIDTypeCode = 0;
        _this.IDNo;
        _this.Address_Street = "";
        _this.Address_Str_Additional = "";
        _this.Address_BuildingNo = "";
        _this.Address_Build_Additional = "";
        _this.Address_City = "";
        _this.Address_Postal = "";
        _this.Address_Province = "";
        _this.Address_District = "";
        _this.NationalityID = 0;
        _this.Currencyid = 0;
        _this.InvoiceTypeCode = 0;
        _this.ReturnTypeCode = 0;
        _this.SlsInvType = 0;
        _this.RetailInvoiceTransCode = 0;
        _this.WholeInvoiceTransCode = 0;
        _this.RetailInvoicePayment = 0;
        _this.WholeInvoicePayment = 0;
        _this.ServiceInvoiceTransCode = 0;
        return _this;
    }
    return G_BRANCH;
}(SecurityClass));
var G_COMPANY = /** @class */ (function (_super) {
    __extends(G_COMPANY, _super);
    function G_COMPANY() {
        var _this = _super.call(this) || this;
        _this.COMP_CODE = 0;
        _this.NameA = "";
        _this.NameE = "";
        _this.Systems = "";
        _this.MOI_ID;
        _this.CRT_NO;
        _this.City = "";
        _this.Address = "";
        _this.Tel = "";
        _this.Fax = "";
        _this.Email = "";
        _this.WebSite = "";
        _this.GMName = "";
        _this.HRResponsible = "";
        _this.FinanceResponsible = "";
        _this.SalesManager = "";
        _this.CUSTOM1 = "";
        _this.CUSTOM2 = "";
        _this.CUSTOM3 = "";
        _this.CUSTOM4 = "";
        _this.CUSTOM5 = "";
        _this.CUSTOMFLAG1 = false;
        _this.CUSTOMFLAG2 = false;
        _this.CUSTOMNUM1 = 0;
        _this.CUSTOMNUM2 = 0;
        _this.CUSTOMDATE = "";
        _this.NameActive = "";
        _this.IsActive = false;
        _this.IsReadOnly = false;
        _this.LogoIcon = "";
        _this.BkImage1 = "";
        _this.BkImage2 = "";
        _this.GroupVatNo = "";
        _this.VATNO = "";
        _this.VndIDTypeCode = 0;
        _this.IDNo;
        _this.Address_Street = "";
        _this.Address_Str_Additional = "";
        _this.Address_BuildingNo = "";
        _this.Address_Build_Additional = "";
        _this.Address_City = "";
        _this.Address_Postal = "";
        _this.Address_Province = "";
        _this.Address_District = "";
        _this.NationalityID = 0;
        _this.Currencyid = 0;
        return _this;
    }
    return G_COMPANY;
}(SecurityClass));
var G_MODULES = /** @class */ (function (_super) {
    __extends(G_MODULES, _super);
    function G_MODULES() {
        var _this = _super.call(this) || this;
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.MODULE_CODE = "";
        _this.MENU_NO = "";
        _this.MENU_NAME = "";
        _this.MODULE_DESCE = "";
        _this.MODULE_DESCA = "";
        _this.CREATE = false;
        _this.EDIT = false;
        _this.DELETE = false;
        _this.PRINT = false;
        _this.VIEW = false;
        _this.CUSTOM1 = false;
        _this.CUSTOM2 = false;
        _this.CUSTOM3 = false;
        _this.CUSTOM1_DESC = "";
        _this.CUSTOM2_DESC = "";
        _this.CUSTOM3_DESC = "";
        _this.CUSTOM4 = false;
        _this.CUSTOM5 = false;
        _this.CUSTOM6 = false;
        _this.CUSTOM4_DESC = "";
        _this.CUSTOM5_DESC = "";
        _this.CUSTOM6_DESC = "";
        _this.CUSTOM7 = false;
        _this.CUSTOM8 = false;
        _this.CUSTOM9 = false;
        _this.CUSTOM7_DESC = "";
        _this.CUSTOM8_DESC = "";
        _this.CUSTOM9_DESC = "";
        _this.AVAILABLE = false;
        _this.MODULE_TYPE;
        _this.Images_Enabled = false;
        _this.SYSTEM_CODE_Desc = "";
        _this.SUB_SYSTEM_CODE_Desc = "";
        return _this;
    }
    return G_MODULES;
}(SecurityClass));
var G_ModuleHelp = /** @class */ (function (_super) {
    __extends(G_ModuleHelp, _super);
    function G_ModuleHelp() {
        var _this = _super.call(this) || this;
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.MODULE_CODE = "";
        _this.HelpBody_Ar = "";
        _this.HelpBody_En = "";
        return _this;
    }
    return G_ModuleHelp;
}(SecurityClass));
var GQ_GetUserModule = /** @class */ (function (_super) {
    __extends(GQ_GetUserModule, _super);
    function GQ_GetUserModule() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.MODULE_CODE = "";
        _this.EXECUTE = false;
        _this.CREATE = false;
        _this.EDIT = false;
        _this.DELETE = false;
        _this.PRINT = false;
        _this.VIEW = false;
        _this.CUSTOM1 = false;
        _this.CUSTOM2 = false;
        _this.CUSTOM3 = false;
        _this.CUSTOM4 = false;
        _this.CUSTOM5 = false;
        _this.CUSTOM6 = false;
        _this.CUSTOM7 = false;
        _this.CUSTOM8 = false;
        _this.CUSTOM9 = false;
        _this.ViewImages = false;
        _this.EditImages = false;
        _this.MENU_NO = "";
        _this.MODULE_DESCE = "";
        _this.MODULE_DESCA = "";
        _this.M_CREATE = false;
        _this.M_EDIT = false;
        _this.M_DELETE = false;
        _this.M_VIEW = false;
        _this.M_PRINT = false;
        _this.M_CUSTOM1 = false;
        _this.M_CUSTOM2 = false;
        _this.M_CUSTOM3 = false;
        _this.M_CUSTOM4 = false;
        _this.M_CUSTOM5 = false;
        _this.M_CUSTOM6 = false;
        _this.M_CUSTOM7 = false;
        _this.M_CUSTOM8 = false;
        _this.M_CUSTOM9 = false;
        _this.CUSTOM1_DESC = "";
        _this.CUSTOM2_DESC = "";
        _this.CUSTOM3_DESC = "";
        _this.CUSTOM4_DESC = "";
        _this.CUSTOM5_DESC = "";
        _this.CUSTOM6_DESC = "";
        _this.CUSTOM7_DESC = "";
        _this.CUSTOM8_DESC = "";
        _this.CUSTOM9_DESC = "";
        _this.AVAILABLE = false;
        _this.M_images_enabled = false;
        return _this;
    }
    return GQ_GetUserModule;
}(SecurityClass));
var G_Noteifications = /** @class */ (function (_super) {
    __extends(G_Noteifications, _super);
    function G_Noteifications() {
        var _this = _super.call(this) || this;
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.MODULE_CODE = "";
        _this.MODULE_DESCE = "";
        _this.MODULE_DESCA = "";
        _this.Remarks = "";
        _this.ISActive = false;
        _this.ActiveIcon = "";
        _this.InActiveIcon = "";
        _this.PageName = "";
        _this.DisplayOrder = 0;
        return _this;
    }
    return G_Noteifications;
}(SecurityClass));
var G_NotificationCompany = /** @class */ (function (_super) {
    __extends(G_NotificationCompany, _super);
    function G_NotificationCompany() {
        var _this = _super.call(this) || this;
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.MODULE_CODE = "";
        _this.CompCode = 0;
        _this.BranchCode = 0;
        _this.ISActive = false;
        _this.NoteCount = 0;
        return _this;
    }
    return G_NotificationCompany;
}(SecurityClass));
var NoteificationsModel = /** @class */ (function (_super) {
    __extends(NoteificationsModel, _super);
    function NoteificationsModel() {
        var _this = _super.call(this) || this;
        _this.MODULE_CODE = "";
        _this.MODULE_DESCE = "";
        _this.MODULE_DESCA = "";
        _this.NoteCount = 0;
        return _this;
    }
    return NoteificationsModel;
}(SecurityClass));
var G_RoleUsers = /** @class */ (function (_super) {
    __extends(G_RoleUsers, _super);
    function G_RoleUsers() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.RoleId = 0;
        _this.ISActive = false;
        _this.StatusFlag = "";
        return _this;
    }
    return G_RoleUsers;
}(SecurityClass));
var G_USERS = /** @class */ (function (_super) {
    __extends(G_USERS, _super);
    function G_USERS() {
        var _this = _super.call(this) || this;
        _this.LoginUrl = false;
        _this.Email = "";
        _this.FirstLogin = "";
        _this.Remarks = "";
        _this.CreatedAt = "";
        _this.CreatedBy = "";
        _this.UpdatedAt = "";
        _this.UpdatedBy = "";
        _this.CashBoxID = 0;
        _this.SalesManID = 0;
        _this.USER_CODE = "";
        _this.USER_PASSWORD = "";
        _this.USER_ACTIVE = false;
        _this.USER_NAME = "";
        _this.CompCode = 0;
        _this.GRP_CODE = "";
        _this.REGION_CODE = "";
        _this.USER_PASSWORD2 = "";
        _this.CHANGE_PASS_DATE = "";
        _this.City = "";
        _this.Address = "";
        _this.Tel = "";
        _this.Fax = "";
        _this.Mobile = "";
        _this.DepartmentName = "";
        _this.JobTitle = "";
        _this.USER_TYPE = 0;
        _this.ManagedBy = "";
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.Tokenid = "";
        _this.LastLogin = "";
        _this.Flag_Mastr = "";
        _this.StoreID = 0;
        return _this;
    }
    return G_USERS;
}(SecurityClass));
var GQ_GetUsers = /** @class */ (function (_super) {
    __extends(GQ_GetUsers, _super);
    function GQ_GetUsers() {
        var _this = _super.call(this) || this;
        _this.LoginUrl = false;
        _this.USER_CODE = "";
        _this.USER_PASSWORD = "";
        _this.USER_ACTIVE = false;
        _this.USER_NAME = "";
        _this.CompCode = 0;
        _this.CashBoxID = 0;
        _this.SalesManID = 0;
        _this.REGION_CODE = "";
        _this.GRP_CODE = "";
        _this.USER_PASSWORD2 = "";
        _this.CHANGE_PASS_DATE = "";
        _this.City = "";
        _this.Address = "";
        _this.Tel = "";
        _this.Fax = "";
        _this.Mobile = "";
        _this.Email = "";
        _this.DepartmentName = "";
        _this.JobTitle = "";
        _this.USER_TYPE = 0;
        _this.ManagedBy = "";
        _this.Tokenid = "";
        _this.LastLogin = "";
        _this.FirstLogin = "";
        _this.Remarks = "";
        _this.CreatedAt = "";
        _this.CreatedBy = "";
        _this.UpdatedAt = "";
        _this.UpdatedBy = "";
        _this.Type_DescA = "";
        _this.Type_DescE = "";
        _this.CodeType = "";
        _this.IsActiveDesc = "";
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.Flag_Mastr = "";
        _this.StoreID = 0;
        return _this;
    }
    return GQ_GetUsers;
}(SecurityClass));
var GQ_GetUserRole = /** @class */ (function (_super) {
    __extends(GQ_GetUserRole, _super);
    function GQ_GetUserRole() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.ISActive = false;
        _this.DescA = "";
        _this.DescE = "";
        _this.Remarks = "";
        _this.RoleId = 0;
        _this.IsActiveDesc = "";
        _this.IsAvailable = false;
        _this.IsShowable = false;
        return _this;
    }
    return GQ_GetUserRole;
}(SecurityClass));
var G_Role = /** @class */ (function (_super) {
    __extends(G_Role, _super);
    function G_Role() {
        var _this = _super.call(this) || this;
        _this.RoleId = 0;
        _this.DescA = "";
        _this.DescE = "";
        _this.Remarks = "";
        _this.IsAvailable = false;
        _this.IsShowable = false;
        return _this;
    }
    return G_Role;
}(SecurityClass));
var G_CONTROL = /** @class */ (function (_super) {
    __extends(G_CONTROL, _super);
    function G_CONTROL() {
        var _this = _super.call(this) || this;
        _this.COMP_CODE = 0;
        _this.FIN_YEAR = 0;
        _this.ACC_STATUS = 0;
        _this.INV_STATUS = 0;
        _this.FirstDate = "";
        _this.LastDate = "";
        _this.ProfitAcc_Code = "";
        _this.OpenAccVoucheNo = 0;
        _this.OpenInvAdjNo = 0;
        return _this;
    }
    return G_CONTROL;
}(SecurityClass));
var G_SearchForm = /** @class */ (function (_super) {
    __extends(G_SearchForm, _super);
    function G_SearchForm() {
        var _this = _super.call(this) || this;
        _this.SearchFormCode = "";
        _this.ReturnDataPropertyName = "";
        _this.Description = "";
        _this.SerachFormTitle = "";
        _this.IsFullScreen = false;
        _this.Left = 0;
        _this.Top = 0;
        _this.Height = 0;
        _this.Width = 0;
        _this.PageSize = 0;
        _this.DataSourceName = "";
        _this.SearchInterval = 0;
        _this.SerachFormTitleA = "";
        return _this;
    }
    return G_SearchForm;
}(SecurityClass));
var G_SearchFormModule = /** @class */ (function (_super) {
    __extends(G_SearchFormModule, _super);
    function G_SearchFormModule() {
        var _this = _super.call(this) || this;
        _this.SystemCode = "";
        _this.SubSystemCode = "";
        _this.ModuleCode = "";
        _this.ControlCode = "";
        _this.SearchFormCode = "";
        return _this;
    }
    return G_SearchFormModule;
}(SecurityClass));
var G_SearchFormSetting = /** @class */ (function (_super) {
    __extends(G_SearchFormSetting, _super);
    function G_SearchFormSetting() {
        var _this = _super.call(this) || this;
        _this.SearchFormSettingID = 0;
        _this.SearchFormCode = "";
        _this.FieldSequence = 0;
        _this.DataMember = "";
        _this.AlternateDataMember = "";
        _this.FieldTitle = "";
        _this.IsReadOnly = false;
        _this.Datatype = 0;
        _this.FieldWidth = 0;
        _this.UseSelectionOperator = false;
        _this.Language = 0;
        _this.FieldTitleA = "";
        return _this;
    }
    return G_SearchFormSetting;
}(SecurityClass));
var CustomerType = /** @class */ (function () {
    function CustomerType() {
        this.IsCredit = null;
        this.SalesInvoiceNature = null;
        this.IsPersonal = null;
    }
    return CustomerType;
}());
var G_USER_BRANCH = /** @class */ (function (_super) {
    __extends(G_USER_BRANCH, _super);
    function G_USER_BRANCH() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.COMP_CODE = 0;
        _this.BRA_CODE = 0;
        _this.EXECUTE = false;
        _this.CREATE = false;
        _this.EDIT = false;
        _this.DELETE = false;
        _this.PRINT = false;
        _this.VIEW = false;
        _this.StatusFlag = "";
        return _this;
    }
    return G_USER_BRANCH;
}(SecurityClass));
var G_USER_COMPANY = /** @class */ (function (_super) {
    __extends(G_USER_COMPANY, _super);
    function G_USER_COMPANY() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.COMP_CODE = 0;
        _this.EXECUTE = false;
        _this.CREATE = false;
        _this.EDIT = false;
        _this.DELETE = false;
        _this.PRINT = false;
        _this.VIEW = false;
        return _this;
    }
    return G_USER_COMPANY;
}(SecurityClass));
var G_USER_LOG = /** @class */ (function (_super) {
    __extends(G_USER_LOG, _super);
    function G_USER_LOG() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.SYSTEM_CODE;
        _this.SYSTEM_YEAR = 0;
        _this.MODULE_CODE = "";
        _this.COMP_CODE = 0;
        _this.LOG_DATE = "";
        return _this;
    }
    return G_USER_LOG;
}(SecurityClass));
var G_USER_MODULE = /** @class */ (function (_super) {
    __extends(G_USER_MODULE, _super);
    function G_USER_MODULE() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.MODULE_CODE = "";
        _this.EXECUTE = false;
        _this.CREATE = false;
        _this.EDIT = false;
        _this.DELETE = false;
        _this.PRINT = false;
        _this.VIEW = false;
        _this.CUSTOM1 = false;
        _this.CUSTOM2 = false;
        _this.CUSTOM3 = false;
        _this.CUSTOM4 = false;
        _this.CUSTOM5 = false;
        _this.CUSTOM6 = false;
        _this.CUSTOM7 = false;
        _this.CUSTOM8 = false;
        _this.CUSTOM9 = false;
        _this.ViewImages = false;
        _this.EditImages = false;
        return _this;
    }
    return G_USER_MODULE;
}(SecurityClass));
var G_USER_SUB_SYSTEM = /** @class */ (function (_super) {
    __extends(G_USER_SUB_SYSTEM, _super);
    function G_USER_SUB_SYSTEM() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.SYSTEM_CODE = "";
        _this.SUB_SYSTEM_CODE = "";
        _this.EXECUTE = false;
        _this.FILTER_STRING = "";
        return _this;
    }
    return G_USER_SUB_SYSTEM;
}(SecurityClass));
var G_USER_SYSTEM = /** @class */ (function (_super) {
    __extends(G_USER_SYSTEM, _super);
    function G_USER_SYSTEM() {
        var _this = _super.call(this) || this;
        _this.USER_CODE = "";
        _this.SYSTEM_CODE = "";
        _this.EXECUTE = false;
        _this.FILTER_STRING = "";
        return _this;
    }
    return G_USER_SYSTEM;
}(SecurityClass));
var I_Control = /** @class */ (function () {
    function I_Control() {
        this.CompCode = 0;
        this.DefSlsVatType = 0;
        this.DefPurVatType = 0;
        this.IsVat = false;
        this.MobileLength = 0;
        this.IDLength = 0;
        this.SendSMS = false;
        this.SendPublicSMS = false;
        this.NotePeriodinSec = 0;
        this.DashBoardPeriodinSec = 0;
        this.MaxYearlyMSGs = 0;
        this.UsedMSGs = 0;
        this.UserTimeZoneUTCDiff = 0;
        this.ServerTimeZoneUTCDiff = 0;
        this.SaudiNationID = 0;
        this.WebCustomerWebsite = false;
        this.MembeshiptStartDate = "";
        this.MembeshipEndDate = "";
        this.MembershipAllanceDays = 0;
        this.MembershipreadOnlyDays = 0;
        this.IsFreePurchaseReturn = false;
        this.IsFreeSalesReturn = false;
        this.ExceedMinPricePassword = "";
        this.GL_VoucherCCType = 0;
        this.GL_VoucherCCDT_Type = 0;
        this.Gl_JournalOpenType = 0;
        this.GL_JournalMonthlyNo = false;
        this.GL_JournalMonthlyNoWidth = 0;
        this.GL_JournalSaveUnbalanced = false;
        this.IsLocalBranchCustomer = false;
        this.SysTimeOut = 0;
        this.NationalityID = 0;
        this.Currencyid = 0;
        this.InvoiceWithoutCust = false;
        this.IvoiceDateEditable = false;
        this.InvoiceLineDiscount = false;
        this.InvoiceLineAllowance = false;
        this.InvoiceTotalAllowance = false;
        this.InvoiceTotalCharge = false;
        this.OperationPriceWithVAT = false;
        this.SalesPriceWithVAT = false;
        this.DocPDFFolder = "";
        this.ISCustVendorInGL = false;
    }
    return I_Control;
}());
var KQ_GetAlertNoteLog = /** @class */ (function (_super) {
    __extends(KQ_GetAlertNoteLog, _super);
    function KQ_GetAlertNoteLog() {
        var _this = _super.call(this) || this;
        _this.NoteType = 0;
        _this.NoteSubType = 0;
        _this.MemberID = 0;
        _this.MsgDate = "";
        _this.MsgText = "";
        _this.IsSent = false;
        _this.AlertID = 0;
        return _this;
    }
    return KQ_GetAlertNoteLog;
}(SecurityClass));
var G_Nationality = /** @class */ (function (_super) {
    __extends(G_Nationality, _super);
    function G_Nationality() {
        var _this = _super.call(this) || this;
        _this.NationalityID = 0;
        _this.NationalityCode = "";
        _this.DescA = "";
        _this.DescL = "";
        _this.Remarks = "";
        _this.StatusFlag = "";
        return _this;
    }
    return G_Nationality;
}(SecurityClass));
var I_VW_GetCompStatus = /** @class */ (function (_super) {
    __extends(I_VW_GetCompStatus, _super);
    function I_VW_GetCompStatus() {
        var _this = _super.call(this) || this;
        _this.CompCode = 0;
        _this.AddAble = false;
        _this.Editable = false;
        _this.CompStatus = 0;
        _this.LoginMsg;
        _this.LastDate = "";
        _this.FirstDate = "";
        _this.INV_STATUS = 0;
        _this.ACC_STATUS = 0;
        _this.ProfitAcc_Code = "";
        _this.OpenAccVoucheNo = 0;
        _this.OpenInvAdjNo = 0;
        return _this;
    }
    return I_VW_GetCompStatus;
}(SecurityClass));
var Customer = /** @class */ (function (_super) {
    __extends(Customer, _super);
    function Customer() {
        var _this = _super.call(this) || this;
        _this.CustomerId = 0;
        _this.CustomerCODE = "";
        _this.CatID = 0;
        _this.GroupId = 0;
        _this.NAMEA = "";
        _this.NAMEE = "";
        _this.SHORTNAME = "";
        _this.TEL = "";
        _this.FAX = "";
        _this.EMAIL = "";
        _this.CURCODE = "";
        _this.REMARKS = "";
        _this.STATUS = false;
        _this.MOBILE = "";
        _this.Bank = "";
        _this.AccountNo = "";
        _this.ManagerName = "";
        _this.NationalityID = 0;
        _this.BranchCode = 0;
        _this.CompCode = 0;
        _this.CREATED_BY = "";
        _this.CREATED_AT = "";
        _this.UPDATED_AT = "";
        _this.UPDATED_BY = "";
        _this.Employer = "";
        _this.JobName = "";
        _this.WorkTel = "";
        _this.WorkAddress = "";
        _this.VATType = 0;
        _this.AddDedType = 0;
        _this.AddDedNo = "";
        _this.VatNo = "";
        _this.Isactive = false;
        _this.IsAuthorized = false;
        _this.CreditLimit = 0;
        _this.CreditLimitFC = 0;
        _this.CreditPeriod = 0;
        _this.OpenBalanceFC = 0;
        _this.Openbalance = 0;
        _this.Debit = 0;
        _this.DebitFC = 0;
        _this.Credit = 0;
        _this.CreditFC = 0;
        _this.PaymentType = 0;
        _this.FCRate = 0;
        _this.CreditExpiryDate = "";
        _this.RefCode2 = "";
        _this.RefCode1 = "";
        _this.IsCreditCustomer = false;
        _this.DiscountplanID = 0;
        _this.SalesmanId = 0;
        _this.Address_postal = "";
        _this.Address_Province = "";
        _this.GroupVatNo = "";
        _this.Address_Street = "";
        _this.Address_Str_Additional = "";
        _this.Address_BuildingNo = "";
        _this.Address_Build_Additional = "";
        _this.Address_City = "";
        _this.Address_District = "";
        return _this;
    }
    return Customer;
}(SecurityClass));
var Sls_Ivoice = /** @class */ (function (_super) {
    __extends(Sls_Ivoice, _super);
    function Sls_Ivoice() {
        var _this = _super.call(this) || this;
        _this.InvoiceID = 0;
        _this.TrNo = 0;
        _this.RefNO = "";
        _this.RefTrID = 0;
        _this.TrDate = "";
        _this.TrDateH = "";
        _this.TrType = 0;
        _this.IsCash = false;
        _this.SlsInvType = 0;
        _this.SlsInvSrc = 0;
        _this.CashBoxID = 0;
        _this.CustomerId = 0;
        _this.CustomerName = "";
        _this.CustomerMobileNo = "";
        _this.SalesmanId = 0;
        _this.StoreId = 0;
        _this.OperationId = 0;
        _this.TotalAmount = 0;
        _this.VatAmount = 0;
        _this.VatType = 0;
        _this.DiscountAmount = 0;
        _this.DiscountPrc = 0;
        _this.NetAfterVat = 0;
        _this.CommitionAmount = 0;
        _this.CashAmount = 0;
        _this.CardAmount = 0;
        _this.BankTfAmount = 0;
        _this.BankAccount = "";
        _this.TotalPaidAmount = 0;
        _this.RemainAmount = 0;
        _this.Remark = "";
        _this.Status = 0;
        _this.IsPosted = false;
        _this.VoucherNo = 0;
        _this.VoucherType = 0;
        _this.CreatedAt = "";
        _this.CreatedBy = "";
        _this.UpdatedAt = "";
        _this.UpdatedBy = "";
        _this.CompCode = 0;
        _this.BranchCode = 0;
        _this.DocNo = "";
        _this.DocUUID = "";
        _this.TrTime = "";
        _this.InvoiceTypeCode = 0;
        _this.InvoiceTransCode = 0;
        _this.TaxNotes = "";
        _this.TaxCurrencyID = 0;
        _this.InvoiceCurrenyID = 0;
        _this.ContractNo = "";
        _this.PurchaseorderNo = "";
        _this.GlobalInvoiceCounter = 0;
        _this.PrevInvoiceHash;
        _this.QRCode;
        _this.CryptographicStamp;
        _this.DeliveryDate = "";
        _this.DeliveryEndDate = "";
        _this.PaymentMeansTypeCode = 0;
        _this.CRDBReasoncode = 0;
        _this.PaymentTerms = "";
        _this.PaymentTermsID = 0;
        _this.AllowAmount = 0;
        _this.AllowPrc = 0;
        _this.AllowBase = 0;
        _this.AllowVatNatID = 0;
        _this.AllowVatPrc = 0;
        _this.AllowAfterVat = 0;
        _this.AllowReason = "";
        _this.AllowCode = 0;
        _this.ChargeAmount = 0;
        _this.ChargePrc = 0;
        _this.ChargeBase = 0;
        _this.ChargeVatNatID = 0;
        _this.ChargeVatPrc = 0;
        _this.ChargeAfterVat = 0;
        _this.ChargeReason = "";
        _this.ChargeCode = 0;
        _this.ItemTotal = 0;
        _this.ItemAllowTotal = 0;
        _this.ItemDiscountTotal = 0;
        _this.ItemVatTotal = 0;
        _this.RoundingAmount = 0;
        return _this;
    }
    return Sls_Ivoice;
}(SecurityClass));
var Sls_InvoiceDetail = /** @class */ (function (_super) {
    __extends(Sls_InvoiceDetail, _super);
    function Sls_InvoiceDetail() {
        var _this = _super.call(this) || this;
        _this.InvoiceItemID = 0;
        _this.InvoiceID = 0;
        _this.ItemID = 0;
        _this.UomID = 0;
        _this.InvoiceSoldQty = 0;
        _this.SoldQty = 0;
        _this.Unitprice = 0;
        _this.DiscountPrc = 0;
        _this.DiscountAmount = 0;
        _this.NetUnitPrice = 0;
        _this.ItemTotal = 0;
        _this.VatPrc = 0;
        _this.VatAmount = 0;
        _this.NetAfterVat = 0;
        _this.StockSoldQty = 0;
        _this.StockUnitCost = 0;
        _this.VatApplied = 0;
        _this.TotRetQty = 0;
        _this.Serial = 0;
        _this.AllowAmount = 0;
        _this.AllowancePrc = 0;
        _this.AllowanceBase = 0;
        _this.AllowReason = "";
        _this.AllowCode = 0;
        _this.BaseQty = 0;
        _this.BaseQtyUomid = 0;
        _this.BaseQtyPrice = 0;
        _this.BaseQtyDiscount = 0;
        _this.DiscountPrcBase = 0;
        _this.DiscountVatNatID = 0;
        _this.Discountreason = "";
        _this.DiscountCode = 0;
        _this.ItemNetAmount = 0;
        _this.ChargeAmount = 0;
        _this.ChargePrc = 0;
        _this.ChargeBase = 0;
        _this.ChargeVatNatID = 0;
        _this.ChargeVatPrc = 0;
        _this.ChargeAfterVat = 0;
        _this.ChargeReason = "";
        _this.ChargeCode = 0;
        _this.VatNatID = 0;
        _this.UnitpriceWithVat = 0;
        _this.NetUnitPriceWithVat = 0;
        _this.Name_Item = "";
        _this.MinUnitPrice = 0;
        _this.ItemFamilyID = 0;
        _this.Name_ItemFamily = "";
        _this.OnhandQty = 0;
        _this.StatusFlag = "";
        _this.Itemdesc = "";
        return _this;
    }
    return Sls_InvoiceDetail;
}(SecurityClass));
var Items = /** @class */ (function (_super) {
    __extends(Items, _super);
    function Items() {
        var _this = _super.call(this) || this;
        _this.StatusCode = 0;
        _this.ItemID = 0;
        _this.CompCode = "";
        _this.codeType = "";
        _this.parentCode = "";
        _this.itemCode = "";
        _this.codeName = "";
        _this.codeNameAr = "";
        _this.activeFrom = "";
        _this.activeTo = "";
        _this.description = "";
        _this.UnitCode = "";
        _this.StatusCode = 0;
        _this.StatusCodeDesc = "";
        _this.StatusFlag = "";
        _this.StatusItem = false;
        return _this;
    }
    return Items;
}(SecurityClass));
var I_D_UOM = /** @class */ (function () {
    function I_D_UOM() {
        this.UomID = 0;
        this.UomCode = "";
        this.DescA = "";
        this.DescE = "";
        this.CompCode = 0;
        this.Remarks = "";
        this.CreatedAt = "";
        this.CreatedBy = "";
        this.UpdatedAt = "";
        this.UpdatedBy = "";
        this.StatusFlag = "";
        this.Cheack = false;
    }
    return I_D_UOM;
}());
var issuer = /** @class */ (function () {
    function issuer() {
        this.issuerID = 0;
        this.branchID = 0;
        this.country = "";
        this.governate = "";
        this.regionCity = "";
        this.street = "";
        this.buildingNumber = "";
        this.postalCode = "";
        this.floor = "";
        this.room = "";
        this.landmark = "";
        this.additionalInformation = "";
        this.type = "";
        this.id = "";
        this.name = "";
        this.CompCode = 0;
    }
    return issuer;
}());
var G_Government = /** @class */ (function (_super) {
    __extends(G_Government, _super);
    function G_Government() {
        var _this = _super.call(this) || this;
        _this.ID = 0;
        _this.Code = "";
        _this.DescA = "";
        _this.DescE = "";
        return _this;
    }
    return G_Government;
}(SecurityClass));
var receiver = /** @class */ (function () {
    function receiver() {
        this.receiverID = 0;
        this.branchID = 0;
        this.country = "";
        this.governate = "";
        this.regionCity = "";
        this.street = "";
        this.buildingNumber = "";
        this.postalCode = "";
        this.floor = "";
        this.room = "";
        this.landmark = "";
        this.additionalInformation = "";
        this.type = "";
        this.id = "";
        this.name = "";
        this.CompCode = 0;
    }
    return receiver;
}());
var Documente = /** @class */ (function () {
    function Documente() {
        this.issuer = new issuer();
        this.receiver = new receiver();
        this.documentType = "";
        this.documentTypeVersion = "";
        this.dateTimeIssued = "";
        this.taxpayerActivityCode = "";
        this.internalID = "";
        this.purchaseOrderReference = "";
        this.purchaseOrderDescription = "";
        this.salesOrderReference = "";
        this.salesOrderDescription = "";
        this.proformaInvoiceNumber = "";
        this.payment = new Payment();
        this.delivery = new Delivery();
        this.invoiceLines = new Array();
        this.totalDiscountAmount = 0;
        this.totalSalesAmount = 0;
        this.netAmount = 0;
        this.taxTotals = new Array();
        this.totalAmount = 0;
        this.extraDiscountAmount = 0;
        this.totalItemsDiscountAmount = 0;
    }
    return Documente;
}());
var Payment = /** @class */ (function () {
    function Payment() {
        this.bankName = "";
        this.bankAddress = "";
        this.bankAccountNo = "";
        this.bankAccountIBAN = "";
        this.swiftCode = "";
        this.terms = "";
    }
    return Payment;
}());
var Delivery = /** @class */ (function () {
    function Delivery() {
        this.approach = "";
        this.packaging = "";
        this.dateValidity = "";
        this.exportPort = "";
        this.grossWeight = 0;
        this.netWeight = 0;
        this.terms = "";
    }
    return Delivery;
}());
var TaxTotal = /** @class */ (function () {
    function TaxTotal() {
        this.taxType = "";
        this.amount = 0;
    }
    return TaxTotal;
}());
var InvoiceLine = /** @class */ (function () {
    function InvoiceLine() {
        this.description = "";
        this.itemType = "";
        this.itemCode = "";
        this.unitType = "";
        this.quantity = 0;
        this.internalCode = "";
        this.salesTotal = 0;
        this.total = 0;
        this.valueDifference = 0;
        this.totalTaxableFees = 0;
        this.netTotal = 0;
        this.itemsDiscount = 0;
        this.unitValue = new UnitValue();
        this.discount = new Discount();
        this.taxableItems = new Array();
    }
    return InvoiceLine;
}());
var UnitValue = /** @class */ (function () {
    function UnitValue() {
        this.currencySold = "";
        this.amountEGP = 0;
    }
    return UnitValue;
}());
var Discount = /** @class */ (function () {
    function Discount() {
        this.rate = 0;
        this.amount = 0;
    }
    return Discount;
}());
var TaxableItem = /** @class */ (function () {
    function TaxableItem() {
        this.taxType = "";
        this.amount = 0;
        this.subType = "";
        this.rate = 0;
    }
    return TaxableItem;
}());
var G_Currency = /** @class */ (function () {
    function G_Currency() {
        this.CurrencyID = 0;
        this.CurrencyCode = "";
        this.DescA = "";
        this.DescL = "";
        this.Remarks = "";
        this.CurNameA = "";
        this.CurNameE = "";
        this.CurSmallNameA = "";
        this.CurSmallNameE = "";
        this.ISCurMale = false;
        this.ISSmallCurMale = false;
        this.CurNameDoubleA = "";
        this.CurSmallNameDoubleA = "";
        this.CurSmallPluralNameA = "";
        this.CurSmallPluralNameE = "";
        this.CurPluralNameA = "";
        this.CurPluralNameE = "";
    }
    return G_Currency;
}());
var I_D_CURRENCY = /** @class */ (function () {
    function I_D_CURRENCY() {
        this.COMP_CODE = 0;
        this.CUR_CODE = "";
        this.DESCA = "";
        this.DESCL = "";
        this.FACTOR = 0;
        this.ACTUAL_DATE = "";
        this.CURSINGLEE = "";
        this.SMALLSINGLEE = "";
        this.CURMALE = false;
        this.SMALLCURMALE = false;
        this.CURSINGLEA = "";
        this.CURDOUBLEA = "";
        this.CURPRULARA = "";
        this.SMALLSINGLEA = "";
        this.SMALLDOUBLEA = "";
        this.SMALLPRULARA = "";
    }
    return I_D_CURRENCY;
}());
var G_Codes = /** @class */ (function () {
    function G_Codes() {
        this.ID = 0;
        this.CodeType = "";
        this.CodeValue = 0;
        this.DescA = "";
        this.DescE = "";
        this.StdCode = "";
        this.SubCode = "";
        this.Remarks = "";
    }
    return G_Codes;
}());
//# sourceMappingURL=Entities.js.map