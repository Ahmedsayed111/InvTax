using Inv.DAL.Domain;
using Inv.DAL.Repository;
using Inv.WebUI.Reports.Forms;
using Inv.WebUI.Reports.Models;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Configuration;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class GeneralRepController : ReportsPagePrintController
    {
        private readonly StdParamters CurrentReportParameters;
        private readonly ReportsDetails ReportsDetail = new ReportsDetails();
        private readonly ReportInfo Rep = new ReportInfo();
        private readonly ClassPrint Printer = new ClassPrint();

        protected TaxEntities db = UnitOfWork.context(BuildConnectionString());

        public static string BuildConnectionString()
        {
            HttpClient httpClient = new HttpClient();
            string res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection").Result;
            return res;
        }

        public string PrintQuotation(RepFinancials rp)
        {

           IEnumerable<Prnt_Quotation_Result> que = Prnt_Quotation(rp);

          return buildReport(que);

        }



    }
}