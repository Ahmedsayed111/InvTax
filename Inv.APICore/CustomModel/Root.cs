using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;

namespace Inv.APICore.CustomModel
{
     

    public class Root
    {
        public List<Document> documents { get; set; }
     }
}