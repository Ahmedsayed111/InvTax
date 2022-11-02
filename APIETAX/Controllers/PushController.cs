using APIETAX.CustomModel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace APIETAX.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PushController : ControllerBase
    {
       
        private readonly ILogger<PushController> _logger;

        public PushController(ILogger<PushController> logger)
        {
            _logger = logger;
        } 

        [HttpGet(Name = "GetPusht")]
        public string Get(int Comp,int InvoiceID)
        {

            I_ControlTax newI_ControlTax = new I_ControlTax();
            newI_ControlTax = HomeSendinvoce.GetControlTax(Comp);
            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(ETax.CreateTokin(newI_ControlTax.ClientID, newI_ControlTax.ClientSecret));

            newI_ControlTax.access_token = Contenttokin.access_token;
            HomeSendinvoce.Pushinvoce(InvoiceID, newI_ControlTax);
            return "";           
        }

        
 
    }
}