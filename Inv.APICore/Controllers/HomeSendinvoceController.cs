using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Inv.APICore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeSendinvoceController : ControllerBase
    {
         
        private readonly ILogger<HomeSendinvoceController> _logger;

        public HomeSendinvoceController(ILogger<HomeSendinvoceController> logger)
        {
            _logger = logger;
        }
        
        [HttpGet]
        //public IEnumerable<HomeSendinvoce> Get()
        public string Get(int Comp, int Optype, int InvoiceID)
        {
            List<I_ControlTax> newI_ControlTax2 = new List<I_ControlTax>();
            I_ControlTax newI_ControlTax = new I_ControlTax();
            newI_ControlTax = HomeSendinvoce.GetControlTax(Comp); 
            string Result = HomeSendinvoce.sendinvoce(newI_ControlTax, Optype, InvoiceID); 
            return Result;
        }
    }
}
