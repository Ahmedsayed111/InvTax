using Inv.API.Models;
using Inv.API.Tools;
using Inv.BLL.Services.Customer; 
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
    public class CustomersController : BaseController
    { 
        private readonly CustomerService CustomerService;
        private readonly G_USERSController UserControl;

        public CustomersController(CustomerService CustomerService, G_USERSController _Control )
        {
            this.CustomerService = CustomerService; 
            this.UserControl = _Control;
        }
        
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllCustomers(int CompCode)
        { 
            var res = db.Database.SqlQuery<receiver>("select * from receiver where CompCode = " + CompCode + "").ToList();
            return Ok(new BaseResponse(res));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult Updatereceiver(string data)
        {
            List<receiver> receiverlist = JsonConvert.DeserializeObject<List<receiver>>(data);


            var insertedInvoicereceiver = receiverlist.Where(x => x.StatusFlag == 'i').ToList();
            var updatedInvoicereceiver = receiverlist.Where(x => x.StatusFlag == 'u').ToList();
            var deletedInvoicereceiver = receiverlist.Where(x => x.StatusFlag == 'd').ToList();

            foreach (var item in insertedInvoicereceiver)
            {
                CustomerService.Insert(item);
            }
            foreach (var item in updatedInvoicereceiver)
            {
                CustomerService.Update(item);
            }
            foreach (var item in deletedInvoicereceiver)
            {
                CustomerService.Delete(item.receiverID);
            }
            return Ok(new BaseResponse(11));
        }
        [HttpGet, AllowAnonymous]
        public IHttpActionResult GetAllGovenment()
        {
            //var res = db.Database.SqlQuery<>("select * from Government").ToList();
            return Ok(new BaseResponse(1));
        }

    }
}
