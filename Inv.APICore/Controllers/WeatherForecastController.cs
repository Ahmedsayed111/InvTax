using Inv.DAL.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Inv.APICore.CustomModel;
using RestSharp;

namespace Inv.APICore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get(int Comp,int Optype, int InvoiceID)
        //{
     
        //    //I_ControlTax newI_ControlTax = new I_ControlTax();
        //    //newI_ControlTax= WeatherForecast.GetControlTax(1);

        //    //WeatherForecast.sendinvoce(newI_ControlTax,1,0);

        //    var rng = new Random();
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = rng.Next(-20, 55),
        //        Summary = Summaries[rng.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}
        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get2()
        //{
        //    var rng = new Random();
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateTime.Now.AddDays(index),
        //        TemperatureC = rng.Next(-20, 55),
        //        Summary = Summaries[rng.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}
        [HttpGet]
        public  string ActivateItems(string data)
        {

            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(HomeSendinvoce.CreateTokin2());

            List<Items> Itemlist = JsonConvert.DeserializeObject<List<Items>>(data); 
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
             
           var  body = JsonConvert.SerializeObject(ItemTax); 
            var insertedInvoiceItems = Itemlist.Where(x => x.StatusItem == true).ToList();

            var client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1.0/codetypes/requests/codes");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", "client_credentials");
            request.AddParameter("client_id", "02496d7e-0312-4cd2-81d4-e332ff2ccfe7");
            request.AddParameter("client_secret", "0ae25efc-2811-4492-b345-506de7018978");
          
            request.AddParameter("scope", "InvoicingAPI");
            request.AddHeader("Authorization", "Bearer " + Contenttokin.access_token + "");
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            return response.Content.ToString();
 


           
        }
    }
}
