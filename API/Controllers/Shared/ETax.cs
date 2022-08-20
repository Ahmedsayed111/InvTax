//using Inv.DAL.Domain;
 
//using Newtonsoft.Json;
//using RestSharp;
//using System;
//using System.Collections.Generic;
//using System.IO;
//using System.Linq;
//using System.Text;

//namespace Inv.API.Controllers
//{
//    internal class ETax
//    {
//        internal static string CreateTokin(I_Control Taxcontrol)
//        {
             
//            var client = new RestClient("https://id.eta.gov.eg/connect/token");
//            client.Timeout = -1;
//            var request = new RestRequest(Method.POST);
//            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
//            request.AddParameter("grant_type", "client_credentials");
//            request.AddParameter("client_id", "02496d7e-0312-4cd2-81d4-e332ff2ccfe7");
//            request.AddParameter("client_secret", "0ae25efc-2811-4492-b345-506de7018978");
//            //request.AddParameter("client_id", "" + Taxcontrol.ClientIDProd + "");
//            //request.AddParameter("client_secret", "" + Taxcontrol.SecretIDProd + "");
//            request.AddParameter("scope", "InvoicingAPI");
//            IRestResponse response = client.Execute(request);
//            return response.Content.ToString();
//        }

//        public static string CreateCode(List<Items> item){

//            I_Control I_Control_ = new I_Control();
//            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(CreateTokin(I_Control_));

//            var client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1.0/codetypes/requests/codes");
//            client.Timeout = -1;
//            var request = new RestRequest(Method.POST);
//            request.AddHeader("Authorization", "Bearer " + Contenttokin.access_token + "");
//            request.AddHeader("Content-Type", "application/json");
//            var item_ = JsonConvert.SerializeObject(item);
//            var body = item;
//            request.AddParameter("application/json", body, ParameterType.RequestBody);
//            IRestResponse response = client.Execute(request);

//            return "";
//}
//}
//    public class TkenModelView
//    {
//        public string access_token { get; set; }
//        public int expires_in { get; set; }
//        public string token_type { get; set; }
//        public string scope { get; set; }
//    }
//}