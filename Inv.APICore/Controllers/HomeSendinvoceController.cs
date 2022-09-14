using Inv.API.Controllers;
using Inv.DAL.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Inv.APICore.CustomModel;
using Microsoft.Extensions.Configuration;

namespace Inv.APICore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HomeSendinvoceController : ControllerBase
    {
        public static string connectionString = "";
        private IConfiguration Configuration;
        private readonly ILogger<HomeSendinvoceController> _logger;

        public HomeSendinvoceController(ILogger<HomeSendinvoceController> logger, IConfiguration _configuration)
        {
            _logger = logger;
            Configuration = _configuration;
            connectionString = this.Configuration.GetConnectionString("DefaultConnection");

        }

        [HttpGet]
        [Route("Get")]
        public IEnumerable<HomeSendinvoce> Get()
        public string Get(int Comp, int Optype, int InvoiceID)
        {
            I_ControlTax I_ControlTax = new I_ControlTax();
            I_ControlTax = CreateTokin();
            string Result = HomeSendinvoce.sendinvoce(I_ControlTax, Optype, InvoiceID);
            return "";
        }

        [HttpGet]
        [Route("ActivateItems")]
        public string ActivateItems([FromBody] List<Items> ListItems)
        {


            var Contenttokin = JsonConvert.DeserializeObject<TkenModelView>(ETax.CreateTokin(ListItems[0].ClientIDProd, ListItems[0].SecretIDProd));

            ItemTax ItemTaxsingle = new ItemTax();
            List<ItemTax> ItemTax = new List<ItemTax>();
            foreach (var item in ListItems)
            {
                ItemTaxsingle.codeType = item.codeType;
                ItemTaxsingle.UnitCode = item.UnitCode;
                ItemTaxsingle.codeName = item.codeName;
                ItemTaxsingle.activeFrom = item.activeFrom;
                ItemTaxsingle.activeTo = item.activeTo;
                ItemTaxsingle.codeNameAr = item.codeNameAr;
                ItemTaxsingle.description = item.description;
                ItemTaxsingle.parentCode = item.parentCode;
                ItemTaxsingle.itemCode = item.itemCode;
                ItemTax.Add(ItemTaxsingle);
            }


            var result = ETax.CreateCode(ItemTax, Contenttokin.access_token);


            return result;



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

        internal static string CreateTokin(string ClientIDProd, string SecretIDProd)
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
            if (ControlTax.SecretIDTest == "1")
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
    }
}
