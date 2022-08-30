using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Text;

namespace APIETAX.CustomModel
{
     

    public class TaxableItem
    {
        public string taxType { get; set; }
        public double? amount { get; set; }
        public string subType { get; set; }
        public double? rate { get; set; }
    }



}