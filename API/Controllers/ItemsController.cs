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



            return Ok(new BaseResponse(11));
        }



        [HttpGet, AllowAnonymous] 
        public string DownloadList(string from, string to, string pageNo, string pageSize, int tyep)
        {
            string RegistrationNumber = CompInfo.RegistrationNumber;
            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(CreateTokin());
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
                    DownloadPDF(item.uuid, item.internalId, Contenttokin.access_token);
                }
            }
            else if (tyep == 1)
            {
                double FROMNO = Convert.ToDouble(from);
                double TONO = Convert.ToDouble(to);

                _ResultissuerId.result = _Result.result.Where(x => x.issuerId == CompInfo.RegistrationNumber && x.status == "Valid").ToList();
                for (int i = 0; i < _ResultissuerId.result.Count; i++)
                {
                    _ResultissuerId.result[i].internalId2 = Convert.ToDouble(_ResultissuerId.result[i].internalId);
                }
                _ResultissuerId.result = _Result.result.Where(x => x.internalId2 >= FROMNO && x.internalId2 <= TONO).ToList();

                foreach (var item in _ResultissuerId.result)
                {
                    DownloadPDF(item.uuid, item.internalId, Contenttokin.access_token);
                }
            }
            else
            {
                _ResultreceiverId.result = _Result.result.Where(x => x.issuerId != CompInfo.RegistrationNumber && x.status == "Valid").ToList();

                foreach (var item in _ResultreceiverId.result)
                {
                    DownloadPDF(item.uuid, item.internalId, Contenttokin.access_token);
                }
            }

            return Json(_Result);
        }




    }
}
