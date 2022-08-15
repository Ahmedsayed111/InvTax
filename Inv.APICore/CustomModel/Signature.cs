using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using System.Text;

namespace Inv.APICore.CustomModel
{
    public class Signature
    {
        public string signatureType { get; set; }
        public string value { get; set; }
    }


}