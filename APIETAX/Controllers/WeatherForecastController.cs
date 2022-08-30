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
        [HttpGet]
        public IEnumerable<WeatherForecast> Get(int Comp, int Optype, int InvoiceID)
        {

           

            var rng = new Random();
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            })
            .ToArray();
        }
        [HttpGet(Name = "GetWeatherForecast")]
        public string Get (int Comp, int Optype, int InvoiceID)
        {
            I_ControlTax newI_ControlTax = new I_ControlTax();
            newI_ControlTax = HomeSendinvoce.GetControlTax(1);
            HomeSendinvoce.sendinvoce(Comp, Optype, InvoiceID);

            return "";
           
        }
    }
}