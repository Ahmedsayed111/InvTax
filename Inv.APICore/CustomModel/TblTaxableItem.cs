using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using System.Text;

namespace Inv.APICore.CustomModel
{ 
  

 
    public partial class TblTaxableItem
    {
        
        public int  Id { get; set; }
        public int InvoiceLineId { get; set; }
        public string taxType { get; set; }
        public decimal amount { get; set; }
        public string subType { get; set; }
        public int rate { get; set; }

       
     }
}