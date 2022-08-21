using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.IItems; 
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
using Newtonsoft.Json;
using Inv.API.CustomModel;
using RestSharp;
using Inv.APICore.CustomModel;

namespace Inv.API.Controllers
{
    public class ItemsController : BaseController
    { 
        private readonly ItemsService ItemsService;
        private readonly G_USERSController UserControl;

        public ItemsController(ItemsService _IItemsService, G_USERSController _Control )
        {
            this.ItemsService = _IItemsService; 
            this.UserControl = _Control;
        }
        
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllItem(int CompCode)
        { 
            var res = db.Database.SqlQuery<Items>("select * from Items where CompCode = " + CompCode + "").ToList();
            return Ok(new BaseResponse(res));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult UpdateItems(string data)
        {
            List<Items> Itemlist = JsonConvert.DeserializeObject<List<Items>>(data);


            var insertedInvoiceItems = Itemlist.Where(x => x.StatusFlag == 'i').ToList();
            var updatedInvoiceItems = Itemlist.Where(x => x.StatusFlag == 'u').ToList();
            var deletedInvoiceItems = Itemlist.Where(x => x.StatusFlag == 'd').ToList();

            foreach (var item in insertedInvoiceItems)
            {
                ItemsService.Insert(item); 
            }
            foreach (var item in updatedInvoiceItems)
            {
                ItemsService.Update(item); 
            }
            foreach (var item in deletedInvoiceItems)
            {
                ItemsService.Delete(item.ItemID); 
            }

            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(CreateTokin(Itemlist[0].ClientIDProd, Itemlist[0].SecretIDProd));

            ItemTax ItemTaxsingle = new ItemTax();
            List<ItemTax> ItemTax = new List<ItemTax>();
            foreach (var item in Itemlist)
            {
                ItemTaxsingle.codeType = item.codeType;
                ItemTaxsingle.UnitCode = item.UnitCode;
                ItemTaxsingle.codeName = item.codeName;
                ItemTaxsingle.activeFrom = item.activeFrom;
                ItemTaxsingle.activeTo = item.activeTo;
                ItemTaxsingle.codeNameAr = item.codeNameAr;
                ItemTaxsingle.description = item.description;
                ItemTaxsingle.parentCode = item.parentCode;
                ItemTaxsingle.itemCode = item.itemCode;
                ItemTax.Add(ItemTaxsingle);
            }


            var result = CreateCode(ItemTax, Contenttokin.access_token);



            return Ok(new BaseResponse(11));
        }

        public static string CreateCode(List<ItemTax> item, string Contenttokin)
        {

            List<ItemTax> objlst = new List<ItemTax>();
            objlst = item;
            var client = new RestClient("https://api.preprod.invoicing.eta.gov.eg/api/v1.0/codetypes/requests/codes");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", "Bearer " + Contenttokin + "");
            request.AddHeader("Content-Type", "application/json");
            var item_ = JsonConvert.SerializeObject(objlst);
            var body = "\"items\"\"\":" + item_;
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            return "";
        }

        internal static string CreateTokin(string ClientIDProd, string SecretIDProd)
        { 
            var client = new RestClient("https://id.preprod.eta.gov.eg/connect/token");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", "client_credentials");
            request.AddParameter("client_id", "" + ClientIDProd + "");
            request.AddParameter("client_secret", "" + SecretIDProd + "");
            request.AddParameter("scope", "InvoicingAPI");
            IRestResponse response = client.Execute(request);
            return response.Content; ;
        }

        public string DownloadList(string from, string to, string pageNo, string pageSize, int tyep, string ClientIDProd, string SecretIDProd, string RegistrationNumber, string PDFFolder)
        {
          
            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(CreateTokin(ClientIDProd,SecretIDProd));

            var client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1.0/documents/recent?pageNo=" + pageNo + "&pageSize=" + pageSize + "");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("PageSize", "" + pageNo + "");
            request.AddHeader("PageNo", "" + pageSize + "");
            request.AddHeader("Authorization", "Bearer " + Contenttokin.access_token + "");
            IRestResponse response = client.Execute(request);
            Root2 _Result = new Root2();
            Root2 _ResultissuerId = new Root2();
            Root2 _ResultreceiverId = new Root2();
            _Result = JsonConvert.DeserializeObject<Root2>(response.Content);

            if (tyep == 0)
            {
                double FROMNO = Convert.ToDouble(from);
                double TONO = Convert.ToDouble(to);

                _ResultissuerId.result = _Result.result.Where(x => x.status == "Valid").ToList();
                for (int i = 0; i < _ResultissuerId.result.Count; i++)
                {
                    _ResultissuerId.result[i].internalId2 = Convert.ToDouble(_ResultissuerId.result[i].internalId);
                }
                _ResultissuerId.result = _Result.result.Where(x => x.internalId2 >= FROMNO && x.internalId2 <= TONO).ToList();

                foreach (var item in _ResultissuerId.result)
                {
                    DownloadPDF(item.uuid, item.internalId, Contenttokin.access_token, PDFFolder);
                }
            }
            else if (tyep == 1)
            {
                double FROMNO = Convert.ToDouble(from);
                double TONO = Convert.ToDouble(to);

                _ResultissuerId.result = _Result.result.Where(x => x.issuerId == RegistrationNumber && x.status == "Valid").ToList();
                for (int i = 0; i < _ResultissuerId.result.Count; i++)
                {
                    _ResultissuerId.result[i].internalId2 = Convert.ToDouble(_ResultissuerId.result[i].internalId);
                }
                _ResultissuerId.result = _Result.result.Where(x => x.internalId2 >= FROMNO && x.internalId2 <= TONO).ToList();

                foreach (var item in _ResultissuerId.result)
                {
                    DownloadPDF(item.uuid, item.internalId, Contenttokin.access_token, PDFFolder);
                }
            }
            else
            {
                _ResultreceiverId.result = _Result.result.Where(x => x.issuerId != RegistrationNumber && x.status == "Valid").ToList();

                foreach (var item in _ResultreceiverId.result)
                {
                    DownloadPDF(item.uuid, item.internalId, Contenttokin.access_token, PDFFolder);
                }
            }

            return "";
        }
        protected async void DownloadPDF(string UUID, string nternalId, string PDFFolder, string Tokin)
        {
            RestClient client = new RestClient();
            client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1/documents/" + UUID + "/pdf?=");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("Authorization", "Bearer " + Tokin + "");
            IRestResponse response = client.Execute(request);
            var content_ = response.Content;
            client.DownloadData(request);
            byte[] renderdByte = response.RawBytes;

          
            try
            {                
                System.IO.File.WriteAllBytes(PDFFolder + @"\" + nternalId + "" + ".pdf", renderdByte);
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            } 
        }
    }
    public class Metadata
    {
        public int totalPages { get; set; }
        public int totalCount { get; set; }
    }

    public class Result
    {
        public string publicUrl { get; set; }
        public string uuid { get; set; }
        public string submissionUUID { get; set; }
        public string longId { get; set; }
        public string internalId { get; set; }
        public double internalId2 { get; set; }
        public string typeName { get; set; }
        public string documentTypeNamePrimaryLang { get; set; }
        public string documentTypeNameSecondaryLang { get; set; }
        public string typeVersionName { get; set; }
        public string issuerId { get; set; }
        public string issuerName { get; set; }
        public string receiverId { get; set; }
        public string receiverName { get; set; }
        public DateTime dateTimeIssued { get; set; }
        public DateTime dateTimeReceived { get; set; }
        public double totalSales { get; set; }
        public double totalDiscount { get; set; }
        public double netAmount { get; set; }
        public double total { get; set; }
        public int maxPercision { get; set; }
        public object invoiceLineItemCodes { get; set; }
        public DateTime? cancelRequestDate { get; set; }
        public object rejectRequestDate { get; set; }
        public DateTime? cancelRequestDelayedDate { get; set; }
        public object rejectRequestDelayedDate { get; set; }
        public object declineCancelRequestDate { get; set; }
        public object declineRejectRequestDate { get; set; }
        public string documentStatusReason { get; set; }
        public string status { get; set; }
        public string createdByUserId { get; set; }
    }

    public class Root2
    {
        public List<Result> result { get; set; }
        public Metadata metadata { get; set; }
    }
}
