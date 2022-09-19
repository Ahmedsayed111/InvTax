using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using Inv.API.Models.CustomEntities;

namespace Inv.API.Models.CustomModel
{
    public class  DetailsAndTaxabl : SecurityClass
    {
        
        public List<IQ_Sls_InvoiceDetail_Tax> IQ_Sls_InvoiceDetail_Tax { get; set; }
        public List<taxableItem> taxableItem { get; set; }
    }
}