using APIETAX.CustomModel;
using Microsoft.AspNetCore.Mvc;

namespace APIETAX.Controllers
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

        [HttpGet(Name = "GetWeatherForecast")]
        public string Get(int Comp, int Optype, int InvoiceID)
        {

            I_ControlTax newI_ControlTax = new I_ControlTax();

            newI_ControlTax = HomeSendinvoce.GetControlTax(Comp);
            newI_ControlTax.access_token = ETax.CreateTokin(newI_ControlTax.ClientIDProd, newI_ControlTax.SecretIDProd);

            HomeSendinvoce.sendinvoce(Optype, InvoiceID, newI_ControlTax);
            return "";           
        }
    }
}