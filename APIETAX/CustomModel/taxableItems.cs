using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Text;

namespace APIETAX.CustomModel
{
     

    public class taxableItems
    {
        public int TaxID { get; set; }
        public string taxType { get; set; }
        public double? amount { get; set; }
        public string subType { get; set; }
        public double? rate { get; set; }
        public double? InvoiceID { get; set; }
    }
     
 }