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
    }
}
