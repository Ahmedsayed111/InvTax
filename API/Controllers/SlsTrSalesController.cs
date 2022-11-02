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
using System.Net.Http.Headers;
using RestSharp;

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

                        var tax = obj.taxableItem.Where(x => x.InvoiceID == obj.Sls_InvoiceDetail[i].InvoiceItemID).ToList();

                        var detail = SlsInvoiceItemsService.Insert(obj.Sls_InvoiceDetail[i]);


                         
                        for (int u = 0; u < tax.Count; u++)
                        {
                            tax[u].InvoiceID = detail.InvoiceItemID;

                            string query = "insert into [dbo].[taxableItems] values('" + tax[u].taxType + "','" + tax[u].amount + "','" + tax[u].subType + "','" + tax[u].rate + "'," + tax[u].InvoiceID + ")";
                            db.Database.ExecuteSqlCommand(query);

                        }

                    }
                    //SlsInvoiceItemsService.InsertLst(obj.Sls_InvoiceDetail);


                    // call process trans 

                    ResponseResult res = Shared.TransactionProcess(Convert.ToInt32(obj.Sls_Ivoice.CompCode), Convert.ToInt32(obj.Sls_Ivoice.BranchCode), Sls_TR_Invoice.InvoiceID, "Quotation", "Add", db);
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

                    string query11 = "delete [dbo].[taxableItems] where InvoiceID = " + Sls_TR_Invoice.InvoiceID + "";
                    db.Database.ExecuteSqlCommand(query11);


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
        public IHttpActionResult GetAllSlsInvoice(int CompCode, int BranchCode, string TypeInv, string Status, int CustomerId, string RFQFilter, string StartDate, string EndDate)
        {

            string s = @"SELECT  * FROM  Sls_Ivoice where   ";

            string condition = "";
            string Customer = "";
            string RFQ = "";
            string Statu = "";

            if (CustomerId != 0 && CustomerId != null)
                Customer = " and CustomerId =" + CustomerId + " ";
            if (RFQFilter != "" && RFQFilter != null)
                RFQ = " and RefNO ='" + RFQFilter + "' ";
            if (Status != "" && Status != null)
                Statu = " and Status ='" + Status + "' ";


            condition = " ( CompCode = " + CompCode + " and BranchCode = " + BranchCode + " and DocType = '" + TypeInv + "' and  TrDate >='" + StartDate + "' and TrDate <= '" + EndDate + "'  " + Customer + " " + RFQ + " " + Statu + " )";


            string query = s + condition + " ORDER BY TrNo DESC;";

            var res = db.Database.SqlQuery<Sls_Ivoice>(query).ToList();
            return Ok(new BaseResponse(res));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateInvoice(int InvoiceID, string InvDate)
        {

            //InvDate = DateTime.Now.ToString();
            string query = "update [dbo].[Sls_Ivoice] set TrType = 1 , DeliveryEndDate = '" + InvDate + "' where InvoiceID = " + InvoiceID + "";
            var res = db.Database.ExecuteSqlCommand(query);
            ResponseResult res1 = Shared.TransactionProcess(Convert.ToInt32(1), Convert.ToInt32(1), InvoiceID, "INV", "ADD", db);

            return Ok(new BaseResponse(100));
        }


        [HttpGet, AllowAnonymous]
        public IHttpActionResult DeleteInvoice(int InvoiceID)
        {

            //InvDate = DateTime.Now.ToString();
            string query = "update [dbo].[Sls_Ivoice] set Status = 3  where InvoiceID = " + InvoiceID + "";
            var res = db.Database.ExecuteSqlCommand(query);
            //ResponseResult res1 = Shared.TransactionProcess(Convert.ToInt32(1), Convert.ToInt32(1), InvoiceID, "INV", "ADD", db);

            return Ok(new BaseResponse(100));
        }

        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdatePurNo(int InvoiceID, string PurNo)
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

            string query1 = "Select * from IQ_Sls_InvoiceDetail_Tax where InvoiceID = " + invoiceID;

            var res1 = db.Database.SqlQuery<IQ_Sls_InvoiceDetail_Tax>(query1).ToList();


            string query2 = "Select * from taxableItems where InvoiceID = " + invoiceID;

            var res2 = db.Database.SqlQuery<taxableItem>(query2).ToList();


            DetailsAndTaxabl Model = new DetailsAndTaxabl();

            Model.IQ_Sls_InvoiceDetail_Tax = res1;
            Model.taxableItem = res2;


            return Ok(new BaseResponse(Model));
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
        [HttpGet, AllowAnonymous]
        public IHttpActionResult insertExcell(int CompCode,int BranchCode, string MasterPath,string DetailPath,string ExtraField)
        {
            string CreatedAt = DateTime.Now.ToString();
            var QUERY = "Exec insert_Excell "+CompCode+ "," + BranchCode + ",'"+ MasterPath + "','"+ DetailPath + "','"+ExtraField+"'";
            var res = db.Database.ExecuteSqlCommand(QUERY);

            var client = new RestClient("http://localhost:5279/Push/?Comp="+ CompCode + "&InvoiceID="+0+"");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            IRestResponse response = client.Execute(request);
            return Ok(new BaseResponse(res));
        }

       [HttpGet, AllowAnonymous]
        public IHttpActionResult GenerateQRCode()
        {
             
          var QRGenerator = QRGeneratorController.GenerateQRCode("محمد رجب ", "310122393500003", 1000, 150, "2022-04-25T15:30:00Z", "D:/New folder");

            return Ok(new BaseResponse(QRGenerator));
        }



    }
    
}
