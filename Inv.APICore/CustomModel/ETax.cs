using Inv.DAL.Domain;

using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Inv.APICore.CustomModel
{
    internal class ETax
    {
        public static string connectionString = @"Data Source=192.168.1.50\SQL2014;Initial Catalog=TESTRAGAB;User Id=SYSUSER;Password=SYSUSER";


        internal static I_ControlTax CreateTokin()
        {
            List<I_ControlTax> I_ControlTaxList = new List<I_ControlTax>();
            I_ControlTax ControlTax = new I_ControlTax();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("SELECT * FROM IQ_EGTaxInvItems", con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {

                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {
                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                I_ControlTax I_ControlTax = new I_ControlTax();
                                I_ControlTax.issuerId = dt.Rows[i]["issuerId"].ToString();
                                I_ControlTax.BranchCode = Convert.ToInt32(dt.Rows[i]["BranchCode"]);

                                I_ControlTax.IsTaxForTest = Convert.ToBoolean(dt.Rows[i]["IsTaxForTest"]);

                                I_ControlTax.SecretIDProd = dt.Rows[i]["SecretIDProd"].ToString();
                                I_ControlTax.SecretIDTest = dt.Rows[i]["SecretIDTest"].ToString();

                                I_ControlTax.ClientIDProd = dt.Rows[i]["ClientIDProd"].ToString();
                                I_ControlTax.ClientIDTest = dt.Rows[i]["ClientIDTest"].ToString();



                                I_ControlTax.CancelDllUrl = dt.Rows[i]["CancelDllUrl"].ToString();
                                I_ControlTax.DownloadCustDllUrl = dt.Rows[i]["DownloadCustDllUrl"].ToString();
                                I_ControlTax.CancelDllUrl = dt.Rows[i]["CancelDllUrl"].ToString();

                                I_ControlTax.TokenPinType = dt.Rows[i]["TokenPinType"].ToString();
                                I_ControlTax.TokenPinCode = dt.Rows[i]["TokenPinCode"].ToString();

                            
                                I_ControlTax.RejectInvoicePeriod = Convert.ToInt32(dt.Rows[i]["RejectInvoicePeriod"]);
                                I_ControlTax.LastTaxSycnDate = Convert.ToDateTime(dt.Rows[i]["LastTaxSycnDate"]);
                                I_ControlTax.CancelinvoicePeriod = Convert.ToInt32(dt.Rows[i]["CancelinvoicePeriod"]);
                                I_ControlTaxList.Add(I_ControlTax);
                            }
                        }

                    }
                }

            }

            ControlTax = I_ControlTaxList[0];

            var client = new RestClient();
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", "client_credentials");
            if (ControlTax.SecretIDTest=="1")
            {
                client = new RestClient("https://id.eta.gov.eg/connect/token");
                request.AddParameter("client_id", "" + ControlTax.ClientIDProd + "");
                request.AddParameter("client_secret", "" + ControlTax.SecretIDProd + "");
            }
            else
            {
                client = new RestClient("https://id.eta.gov.eg/connect/token");
                request.AddParameter("client_id", "" + ControlTax.ClientIDTest + "");
                request.AddParameter("client_secret", "" + ControlTax.SecretIDTest + "");
            }
            
            request.AddParameter("scope", "InvoicingAPI");
            IRestResponse response = client.Execute(request); 
            ControlTax.access_token = response.Content;
            return ControlTax;
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