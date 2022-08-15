using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using System.Text;

namespace Inv.APICore.CustomModel
{
 
    public partial class Issuer
    {
        public Address address { get; set; }
        public string type { get; set; }
        public string id { get; set; }
        public string name { get; set; }
    }
}