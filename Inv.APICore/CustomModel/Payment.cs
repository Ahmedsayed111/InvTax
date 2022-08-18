using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;


using System.Text;

namespace Inv.APICore.CustomModel
{
      
    public class Payment
    {
        public string bankName { get; set; } = "";
        public string bankAddress { get; set; } = "";
        public string bankAccountNo { get; set; } = "";
        public string bankAccountIBAN { get; set; } = "";
        public string swiftCode { get; set; } = "";
        public string terms { get; set; } = "";
    }

    
}