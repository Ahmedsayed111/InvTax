using Inv.DAL.Domain;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace APIETAX.CustomModel
{
    internal class ETax
    {
        public static string connectionString = "";
        private IConfiguration Configuration;

        public ETax(IConfiguration _configuration)
        {
            Configuration = _configuration;
            connectionString = this.Configuration.GetConnectionString("DefaultConnection");

        }

      
        public static string CreateCode(List<ItemTax> item, string Contenttokin)
        {


            var client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1.0/codetypes/requests/codes");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", "Bearer " + Contenttokin + "");
            request.AddHeader("Content-Type", "application/json");
            var item_ = JsonConvert.SerializeObject(item);
            var body = item_;
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            return "";
        }

        internal static string CreateTokin(string ClientIDProd,string SecretIDProd)
        {
            
            var client = new RestClient("https://id.eta.gov.eg/connect/token");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", "client_credentials"); 
            request.AddParameter("client_id", "" + ClientIDProd + "");
            request.AddParameter("client_secret", "" + SecretIDProd + "");  
            request.AddParameter("scope", "InvoicingAPI");
            IRestResponse response = client.Execute(request); 
            return response.Content; ;
        }
    }

}