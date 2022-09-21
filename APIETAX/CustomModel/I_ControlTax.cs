using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace APIETAX.CustomModel
{
    class I_ControlTax
    {

        public int CompCode { get; set; }
        public Nullable<bool> IsTaxForTest { get; set; }
        public string ClientSecret { get; set; } 
        public string ClientID { get; set; } 
        public string TokenPinCode { get; set; }
        public string Tokentype { get; set; } 
        public int CancelinvoicePeriod { get; set; }
        public int RejectInvoicePeriod { get; set; }
        public DateTime LastTaxSycnDate { get; set; } 
        public int PageCount { get; set; }
        public int BranchCode { get; set; }
        public string issuerId { get; set; }
        public string DocPDFFolder { get; set; }
        public string access_token { get; set; }
      }

}
              
 