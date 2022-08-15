using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using Inv.APICore.CustomModel;
using System.Data.SqlClient;
using System.Data;

namespace Inv.APICore
{



    public class WeatherForecast
    { 
 
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);

        public string Summary { get; set; } 

    }
}
