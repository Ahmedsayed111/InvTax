using Inv.DAL.Domain;
 
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Inv.API.Controllers
{
    internal class ETax
    {
        public string CreateToken() {
            var client = new RestClient("https://id.eta.gov.eg/connect/token");
            var request = new RestRequest();
            request.Method = Method.POST;
            request.Timeout = -1;
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded"); 
            request.AddParameter("client_secret", " ");
            request.AddParameter("client_id", ""); 
            request.AddParameter("scope", "InvoicingAPI");
            request.AddParameter("grant_type", "client_credentials");
            IRestResponse response = client.Execute(request);
            return response.Content;
        }
       
        public static string CreateCode(List<Item> item){

            var client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1.0/codetypes/requests/codes");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", "Bearer ");
            request.AddHeader("Content-Type", "application/json");
            var item_ = JsonConvert.SerializeObject(item);
            var body = item;
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            return "";
}
}
    
}