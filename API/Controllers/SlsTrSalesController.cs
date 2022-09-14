using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.ISlsTRInvoice;
using Inv.BLL.Services.SlsInvoiceItems;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Inv.API.Controllers;
using System.Data.SqlClient;
using Inv.API.Models.CustomModel; 

namespace Inv.API.Controllers
{
    public class SlsTrSalesController : BaseController
    {
        private readonly ISlsInvoiceItemsService SlsInvoiceItemsService;
        private readonly IISlsTRInvoiceService SlsTrSalesService;
        private readonly G_USERSController UserControl;

        public SlsTrSalesController(IISlsTRInvoiceService _ISlsTrSalesService, G_USERSController _Control, ISlsInvoiceItemsService _ISlsInvoiceItemsService)
        {
            this.SlsTrSalesService = _ISlsTrSalesService;
            this.SlsInvoiceItemsService = _ISlsInvoiceItemsService;
            this.UserControl = _Control;
        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult InsertInvoiceMasterDetail([FromBody] SlsInvoiceMasterDetails obj)
        {

            using (var dbTransaction = db.Database.BeginTransaction())
            {
                try
                {
                    // doha 4-7-2021 GUID and QR Code
                    string st = SystemToolsController.GenerateGuid();
                    obj.Sls_Ivoice.DocUUID = st;

                    var tm = DateTime.Now.ToString("HH:mm:ss");
                    obj.Sls_Ivoice.TrTime = TimeSpan.Parse(tm);

                    //var compObj = db.G_COMPANY.Where(s => s.COMP_CODE == obj.Sls_Ivoice.CompCode).FirstOrDefault();
                    //var branchObj = db.G_BRANCH.Where(s => s.BRA_CODE == obj.Sls_Ivoice.BranchCode).FirstOrDefault();
                    //var QrCode= SystemToolsController.GenerateQRCode(compObj.NameA, branchObj.GroupVatNo, obj.Sls_Ivoice.TrDate.ToString(), obj.Sls_Ivoice.NetAfterVat.ToString(), obj.Sls_Ivoice.VatAmount.ToString());
                    //obj.Sls_Ivoice.QRCode = QrCode;
                    //var x=QrCode.Length;
                    ////////////

                    var Sls_TR_Invoice = SlsTrSalesService.Insert(obj.Sls_Ivoice);

                    for (int i = 0; i < obj.Sls_InvoiceDetail.Count; i++)
                    {
                        obj.Sls_InvoiceDetail[i].InvoiceID = Sls_TR_Invoice.InvoiceID;
                    }
                    SlsInvoiceItemsService.InsertLst(obj.Sls_InvoiceDetail);

                    for (int i = 0; i < obj.taxableItem.Count; i++)
                    {
                        obj.taxableItem[i].InvoiceID = Sls_TR_Invoice.InvoiceID;

                        string query = "insert into [dbo].[taxableItems] values('"+ obj.taxableItem[i].taxType + "',0,'"+ obj.taxableItem[i].subType + "',0,"+ obj.taxableItem[i].InvoiceID + ")";
                        db.Database.ExecuteSqlCommand(query);

                    }
                    // call process trans 

                    ResponseResult res =  Shared.TransactionProcess(Convert.ToInt32(obj.Sls_Ivoice.CompCode), Convert.ToInt32(obj.Sls_Ivoice.BranchCode), Sls_TR_Invoice.InvoiceID, "Quotation", "Add", db);
                    if (res.ResponseState == true)
                    {
                        obj.Sls_Ivoice.TrNo = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(obj.Sls_Ivoice));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                    ////////
                }
                catch (Exception ex)
                {
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }
        [HttpPost, AllowAnonymous]
        public IHttpActionResult updateInvoiceMasterDetail([FromBody] SlsInvoiceMasterDetails updatedObj)
        {

            using (var dbTransaction = db.Database.BeginTransaction())
            {
                try
                {

                    string st = SystemToolsController.GenerateGuid();
                    updatedObj.Sls_Ivoice.DocUUID = st;

                    var tm = DateTime.Now.ToString("HH:mm:ss");
                    updatedObj.Sls_Ivoice.TrTime = TimeSpan.Parse(tm);

                    //update Master
                    var Sls_TR_Invoice = SlsTrSalesService.Update(updatedObj.Sls_Ivoice);

                    //update Details
                    var insertedInvoiceItems = updatedObj.Sls_InvoiceDetail.Where(x => x.StatusFlag == 'i').ToList();
                    var updatedInvoiceItems = updatedObj.Sls_InvoiceDetail.Where(x => x.StatusFlag == 'u').ToList();
                    var deletedInvoiceItems = updatedObj.Sls_InvoiceDetail.Where(x => x.StatusFlag == 'd').ToList();

                    //loop insered  
                    foreach (var item in insertedInvoiceItems)
                    {
                        item.InvoiceID = updatedObj.Sls_Ivoice.InvoiceID;
                        var InsertedRec = SlsInvoiceItemsService.Insert(item);
                    }

                    //loop Update  
                    foreach (var item in updatedInvoiceItems)
                    {
                        item.InvoiceID = updatedObj.Sls_Ivoice.InvoiceID;
                        var updatedRec = SlsInvoiceItemsService.Update(item);
                    }

                    //loop Delete  
                    foreach (var item in deletedInvoiceItems)
                    {
                        int deletedId = item.InvoiceItemID;
                        //SlsInvoiceItemsService.Delete(deletedId);

                        string query = "delete [dbo].[Sls_InvoiceDetail] where InvoiceItemID = " + deletedId + "";
                        db.Database.ExecuteSqlCommand(query);

                    }


                    for (int i = 0; i < updatedObj.taxableItem.Count; i++)
                    {
                        updatedObj.taxableItem[i].InvoiceID = Sls_TR_Invoice.InvoiceID;

                        string query = "insert into [dbo].[taxableItems] values('" + updatedObj.taxableItem[i].taxType + "',0,'" + updatedObj.taxableItem[i].subType + "',0," + updatedObj.taxableItem[i].InvoiceID + ")";
                        db.Database.ExecuteSqlCommand(query);

                    }
                    // call process trans 

                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(updatedObj.Sls_Ivoice.CompCode), Convert.ToInt32(updatedObj.Sls_Ivoice.BranchCode), Sls_TR_Invoice.InvoiceID, "Quotation", "Update", db);
                    if (res.ResponseState == true)
                    {
                        updatedObj.Sls_Ivoice.TrNo = int.Parse(res.ResponseData.ToString());
                        dbTransaction.Commit();
                        return Ok(new BaseResponse(updatedObj.Sls_Ivoice));
                    }
                    else
                    {
                        dbTransaction.Rollback();
                        return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, res.ResponseMessage));
                    }
                }
                catch (Exception ex)
                {
                    dbTransaction.Rollback();
                    return Ok(new BaseResponse(HttpStatusCode.ExpectationFailed, ex.Message));
                }
            }

        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllSlsInvoice(int CompCode, int BranchCode, int CustomerId , string RFQFilter , string StartDate, string EndDate)
        {
             
             
            string s = @"SELECT   [InvoiceID] ,[TrNo]  ,[RefNO]  ,[RefTrID] , TrDate
                      ,CONVERT(varchar, TrDate, 103) as TrDateH ,[TrType] ,[IsCash] ,[SlsInvType] ,[SlsInvSrc]  ,[CashBoxID] ,[CustomerId]
                      ,[CustomerName] ,[DeliveryEndDate]  ,[SalesmanId] ,[StoreId] ,[OperationId] ,[TotalAmount]
                      ,[VatAmount] ,[VatType] ,[DiscountAmount] ,[DiscountPrc]  ,[NetAfterVat]   ,[CommitionAmount]  ,[CashAmount]
                      ,[CardAmount] ,[BankTfAmount]  ,[BankAccount] ,[TotalPaidAmount] ,[RemainAmount]  ,[Remark]
                      ,[Status] ,[IsPosted] ,[VoucherNo] ,[VoucherType] ,[CreatedAt]  ,[CreatedBy] ,[UpdatedAt] ,[UpdatedBy]
                      ,[CompCode] ,[BranchCode]  ,[DocNo] ,[DocUUID] ,[TrTime] ,[InvoiceTypeCode] ,[InvoiceTransCode]  ,[TaxNotes]
                      ,[TaxCurrencyID] ,[InvoiceCurrenyID] ,[ContractNo] ,[PurchaseorderNo] ,[GlobalInvoiceCounter] ,[PrevInvoiceHash]  ,[QRCode]
                      ,[CryptographicStamp]  ,[DeliveryDate]  ,CONVERT(varchar, DeliveryEndDate, 103) as CustomerMobileNo ,[PaymentMeansTypeCode],[CRDBReasoncode],[PaymentTerms],[PaymentTermsID],[AllowAmount],[AllowPrc]
                      ,[AllowBase]      ,[AllowVatNatID],[AllowVatPrc],[AllowAfterVat],[AllowReason],[AllowCode],[ChargeAmount],[ChargePrc],[ChargeBase],[ChargeVatNatID]
                      ,[ChargeVatPrc],[ChargeAfterVat],[ChargeReason],[ChargeCode],[ItemTotal],[ItemAllowTotal],[ItemDiscountTotal],[ItemVatTotal],[RoundingAmount],DocType,UUID,TimeUpload,VersionInv
                      FROM  Sls_Ivoice where   ";

            string condition = "";
            string Customer = "";
            string RFQ = "";

            if (CustomerId != 0 && CustomerId != null)
                Customer = " and CustomerId =" + CustomerId+" ";
            if (RFQFilter != "" && RFQFilter != null)
                RFQ =  " and RefNO ='" + RFQFilter +"' "; 


            condition = " ( CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and  TrDate >='" + StartDate + "' and TrDate <= '" + EndDate + "'  " + Customer +" "+ RFQ + " )";
            condition = condition + " or ( CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and  DeliveryEndDate >='" + StartDate + "' and DeliveryEndDate <= '" + EndDate + "' and TrType = '1' " + Customer + " " + RFQ + " )";

         string query = s + condition + " ORDER BY TrNo DESC;";  

            var res = db.Database.SqlQuery<Sls_Ivoice>(query).ToList();
            return Ok(new BaseResponse(res));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateInvoice(int InvoiceID,string InvDate)
        {

            //InvDate = DateTime.Now.ToString();
            string query = "update [dbo].[Sls_Ivoice] set TrType = 1 , DeliveryEndDate = '"+InvDate+"' where InvoiceID = " + InvoiceID + "";
            var res = db.Database.ExecuteSqlCommand(query);
             ResponseResult res1 = Shared.TransactionProcess(Convert.ToInt32(1), Convert.ToInt32(1), InvoiceID, "INV", "ADD", db);

            return Ok(new BaseResponse(100));
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeleteInvoice(int InvoiceID)
        {

            //InvDate = DateTime.Now.ToString();
            string query = "update [dbo].[Sls_Ivoice] set TrType = 0 , DeliveryEndDate = '' where InvoiceID = " + InvoiceID + "";
            var res = db.Database.ExecuteSqlCommand(query);
            //ResponseResult res1 = Shared.TransactionProcess(Convert.ToInt32(1), Convert.ToInt32(1), InvoiceID, "INV", "ADD", db);

            return Ok(new BaseResponse(100));
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdatePurNo(int InvoiceID , string PurNo)
        {
            string query = "update [dbo].[Sls_Ivoice] set TaxNotes = '" + PurNo + "' where InvoiceID = " + InvoiceID + "";

            var res = db.Database.ExecuteSqlCommand(query);
            return Ok(new BaseResponse(100));
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllUOM()
        {
            string query = "select * from I_D_UOM ";

            var res = db.Database.SqlQuery<I_D_UOM>(query).ToList();
            return Ok(new BaseResponse(res));
        }
           
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllG_Codes()
        {
            string query = "select * from G_Codes where CodeType = 'TaxSubtypes' or CodeType = 'Taxtypes' ";

            var res = db.Database.SqlQuery<G_Codes>(query).ToList();
            return Ok(new BaseResponse(res));
        } 
        
        
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCurreny()
        {
            string query = "select * from G_Currency ";

            var res = db.Database.SqlQuery<G_Currency>(query).ToList();
            return Ok(new BaseResponse(res));
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetCustomer(int id)
        {
            string query = "select * from receiver where  receiverID = " + id + "";

            var res = db.Database.SqlQuery<receiver>(query).ToList();
            return Ok(new BaseResponse(res));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCustomer()
        {
            string query = "select * from Customer ";

            var res = db.Database.SqlQuery<Customer>(query).ToList();
            return Ok(new BaseResponse(res));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult InsertCustomer(string NAMEA, string NAMEE, string EMAIL, string Address_Street, Boolean Isactive, string REMARKS, string CREATED_BY, string CREATED_AT, string Mobile, string Telephone)
        {
            int active = 0;
            if (Isactive == true)
            { active = 1; }
            string query = "INSERT INTO [dbo].[Customer] (NAMEA,NAMEE,EMAIL,REMARKS,Isactive,Address_Street,MOBILE,TEL) VALUES  ('" + NAMEA + "','" + NAMEE + "','" + EMAIL + "','" + REMARKS + "'," + active + ",'" + Address_Street + "','" + Mobile + "','" + Telephone + "')";
            db.Database.ExecuteSqlCommand(query);
            return Ok(new BaseResponse(100));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateCustomer(string NAMEA, string NAMEE, string EMAIL, string Address_Street, Boolean Isactive, string REMARKS, string CREATED_BY, string CREATED_AT, int CustomerId, string Mobile, string Telephone)
        {
            int active = 0;
            if (Isactive == true)
            { active = 1; }
            string query = "update [dbo].[Customer] set  NAMEA ='" + NAMEA + "' ,NAMEE = '" + NAMEE + "',EMAIL = '" + EMAIL + "',REMARKS = '" + REMARKS + "',Isactive = " + active + ",Address_Street= '" + Address_Street + "', MOBILE = '" + Mobile + "',TEL = '" + Telephone + "'  where CustomerId = " + CustomerId + "";
            db.Database.ExecuteSqlCommand(query);
            return Ok(new BaseResponse(100));
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetSlsInvoiceItem(int invoiceID)
        {

            var res = db.Sls_InvoiceDetail.Where(x => x.InvoiceID == invoiceID).ToList();
            return Ok(new BaseResponse(res));
        }
         
        [HttpPost, AllowAnonymous]
        public IHttpActionResult AddUsers([FromBody] SlsInvoiceMasterDetails updatedObj)
        {
           string CreatedAt = DateTime.Now.ToString();
            var QUERY = "";
            var res = db.Database.ExecuteSqlCommand(QUERY);
            return Ok(new BaseResponse(res));
        }


        [HttpPost, AllowAnonymous]
        public IHttpActionResult GetAllItem(int CompCode)
        {
            string CreatedAt = DateTime.Now.ToString();
            var QUERY = "select * from Items where CompCode = " + CompCode + "";
            var res = db.Database.ExecuteSqlCommand(QUERY);
            return Ok(new BaseResponse(res));
        }
    }
}
