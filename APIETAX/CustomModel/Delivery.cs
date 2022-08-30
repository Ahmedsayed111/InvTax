using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Text;

namespace APIETAX.CustomModel
{
    public class Delivery
    {
        public string approach { get; set; } = "";
        public string packaging { get; set; } = "";
        public string dateValidity { get; set; } = "";
        public string exportPort { get; set; } = "";
        public double grossWeight { get; set; } = 0.0;
        public double netWeight { get; set; } = 0.0;
        public string terms { get; set; } = "";
    }

  }