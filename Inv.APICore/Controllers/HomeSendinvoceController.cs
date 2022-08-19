using Inv.API.Controllers;
using Inv.DAL.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Inv.APICore.CustomModel;
  



namespace Inv.APICore.Controllers
{
    [ApiController]
    [Route("[api/controller]")]
    public class HomeSendinvoceController : ControllerBase
    {
         
        private readonly ILogger<HomeSendinvoceController> _logger;

        public HomeSendinvoceController(ILogger<HomeSendinvoceController> logger)
        {
            _logger = logger;
        }
        
        [HttpGet]
        [Route("Get")]
        //public IEnumerable<HomeSendinvoce> Get()
        public string Get(int Comp, int Optype, int InvoiceID)
        {
            I_ControlTax I_ControlTax = new I_ControlTax();
            I_ControlTax = ETax.CreateTokin();
            string Result = HomeSendinvoce.sendinvoce(Optype, InvoiceID, I_ControlTax); 
            return Result;
        }

        [HttpGet]
        [Route("ActivateItems")]
        public string ActivateItems(List<Items> ListItems)
        {
             
              
            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(ETax.CreateTokin(ListItems[0].ClientIDProd,ListItems[0].SecretIDProd));

            ItemTax ItemTaxsingle = new ItemTax();
            List<ItemTax> ItemTax = new List<ItemTax>();
            foreach (var item in ListItems)
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


         var result= ETax.CreateCode(ItemTax, Contenttokin.access_token);


            return result;



        }
    }
}
