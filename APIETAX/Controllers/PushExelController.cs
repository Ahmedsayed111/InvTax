using APIETAX.CustomModel;
using Microsoft.AspNetCore.Mvc;

namespace APIETAX.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PushExelController : ControllerBase
    {
       
        private readonly ILogger<PushExelController> _logger;

        public PushExelController(ILogger<PushExelController> logger)
        {
            _logger = logger;
        } 

        [HttpGet(Name = "PushExel")]
        public string PushExel(int Comp,string type)
        {

            I_ControlTax newI_ControlTax = new I_ControlTax();
            newI_ControlTax = HomeSendinvoce.GetControlTax(Comp);
            newI_ControlTax.access_token = ETax.CreateTokin(newI_ControlTax.ClientID, newI_ControlTax.ClientSecret);
            HomeSendinvoce.PushExel("x", newI_ControlTax);
            return "";           
        }

        
 
    }
}