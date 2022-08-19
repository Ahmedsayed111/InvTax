using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inv.APICore
{
    class I_ControlTax
    {

        public int CompCode { get; set; }
        public Nullable<bool> IsTaxForTest { get; set; }
        public string SecretIDProd { get; set; }
        public string SecretIDTest { get; set; }
        public string ClientIDProd { get; set; }
        public string ClientIDTest { get; set; }
        public string TokenPinCode { get; set; }
        public string TokenPinType { get; set; }
        public string CreateTokinlDllUrl { get; set; }
        public string UploadDllUrl { get; set; }
        public string CancelDllUrl { get; set; }
        public string GetDllUrl { get; set; }
        public string DownloadInterDllUrl { get; set; }
        public string DownloadCustDllUrl { get; set; }
        public int CancelinvoicePeriod { get; set; }
        public int RejectInvoicePeriod { get; set; }
        public DateTime LastTaxSycnDate { get; set; }
        public int PageCount { get; set; }
        public int BranchCode { get; set; }
        public string issuerId { get; set; }
        public string PDFFolder { get; set; }
        public string access_token { get; set; }
      }

}
              
 