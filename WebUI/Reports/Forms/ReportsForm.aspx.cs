using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Drawing.Printing;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing;
using System.Collections.Specialized;
using System.Globalization;
using System.Text;
using System.Web.Configuration;
using Inv.WebUI.Reports.Models;
using Inv.WebUI.Reports.Forms;


using System.Net.Http;
//using OnBarcode.Barcode;
using QRCoder;
using Inv.DAL.Repository;
using Inv.API.Tools;
using Inv.DAL.Domain;
using Microsoft.Reporting.WebForms;

namespace RS.WebUI.Reports.Forms
{//eslam 1 dec 2020
    public partial class ReportsForm : System.Web.UI.Page
    {
        //SessionRecord CurrentSession;
        StdParamters CurrentReportParameters;

        ReportsDetails ReportsDetail = new ReportsDetails();
        ReportInfo Rep = new ReportInfo();
        ClassPrint Printer = new ClassPrint();

        protected TaxEntities db = UnitOfWork.context(BuildConnectionString());
        string Par;
        string NameAr;
        string NameEn;
        string BrNameAr;
        string BrNameEn;
        string SystemCode = "";
        string SubSystemCode = "";
        int CompCode = 0;
        int? branCode = 0;
        string LoginUser = "";
        string ScreenLanguage = "";
        public static string BuildConnectionString()
        {
            var httpClient = new HttpClient();
            var res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection").Result;
            return res;
        }
        public Boolean CheckUser(string Guid, string uCode)

        {
            string Pref = Guid.Substring(0, 5);
            string OrgGuid = Guid.Remove(0, 5); // remove  prefix 

            string EnGuid = Pref + Inv.WebUI.Reports.Models.UserTools.Encrypt(OrgGuid, "Business-Systems");

            var usr = db.G_USERS.Where(x => x.USER_CODE == uCode).ToList();
            if (usr.Count == 0)
            {
                return false;
            }
            if (usr[0].Tokenid != EnGuid)
            {
                return false;
            }
            if (usr[0].LastLogin == null)
            {
                return false;
            }
            DateTime LL = Convert.ToDateTime(usr[0].LastLogin);
            if (DateTime.Now.Subtract(LL).Hours > 8)
            {
                return false;
            }
            return true;

        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string x = Request["rpt"];
                string y = Request["par"];
                y = y.Replace("*", "+");
                if (Request["rpt"] == null)
                    return;
                if (Request["par"] != null)
                {   //mahroos 
                    Par = Inv.WebUI.Reports.Models.UserTools.Decrypt(y, "Business-Systems");

                    CurrentReportParameters = JsonConvert.DeserializeObject<StdParamters>(Par);
                }
                //add api call returns boolean mahroos 
                if (!CheckUser(CurrentReportParameters.Tokenid, CurrentReportParameters.UserCode))
                {
                    return;
                }

                reportViewer1.ShowPrintButton = true;

                string ReportName = Request["rpt"];

                if (!IsPostBack)
                {
                    var method = this.GetType().GetMethod(ReportName);
                    method.Invoke(this, null);


                }

            }

        }

        #region Bind Reports Functions
        private void BindReport(string reportName, int OutputTypeNo, string OutputType, ReportsDetails ReportsDetail, params object[] models)
        {
            if (OutputTypeNo == 2) { OutputType = "PDF"; }
            else { OutputType = "Excel"; }
            //reportViewer1.LocalReport.ReportPath = Se"Excel"rver.MapPath("../Report/" + reportName + ".rdlc");
            if (reportName.Contains("Prnt"))
                reportViewer1.LocalReport.ReportPath = Server.MapPath("../Report/Print/" + reportName + ".rdlc");
            else if (reportName.Contains("Slip"))
            {
                reportViewer1.LocalReport.ReportPath = Server.MapPath("../Report/Slip/" + reportName + ".rdlc");

            }
            else
                reportViewer1.LocalReport.ReportPath = Server.MapPath("../Report/Reports/" + reportName + ".rdlc");


            reportViewer1.LocalReport.DataSources.Clear();
            foreach (var model in models)
            {
                ReportDataSource source = new ReportDataSource(reportName, model);

                reportViewer1.LocalReport.DataSources.Add(source);

            }


            if (OutputTypeNo == 1)
            {
                reportViewer1.DataBind();

            }
            else if (OutputTypeNo == 4)
            {

                Printer.PrintToPrinter(reportViewer1.LocalReport, ReportsDetail);
            }
            else
            {

                Warning[] warnings;
                string[] streamIds;
                string mimeType = string.Empty;
                string encoding = string.Empty;
                string extension = string.Empty;
                byte[] bytes = reportViewer1.LocalReport.Render(OutputType, null, out mimeType, out encoding, out extension, out streamIds, out warnings);
                Response.Buffer = true;
                Response.Clear();
                Response.ContentType = mimeType;
                Response.AddHeader("content-disposition", "attachment; filename=" + reportName + "." + extension);
                Response.OutputStream.Write(bytes, 0, bytes.Length);
                Response.Flush();
                Response.End();
            }



        }
        private void BindReport(string reportName, List<DataSourceStruct> models)
        {
            reportViewer1.LocalReport.ReportPath = Server.MapPath("../Reports/" + reportName + ".rdlc");
            reportViewer1.LocalReport.DataSources.Clear();
            foreach (var model in models)
            {
                ReportDataSource source = new ReportDataSource(model.Name, model.DataSource);
                reportViewer1.LocalReport.DataSources.Add(source);
            }

            reportViewer1.DataBind();

        }
        private void BindSSRS(string reportName, List<DataSourceStruct> models)
        {
            reportViewer1.LocalReport.ReportPath = Server.MapPath("../Reports/" + reportName + ".rdlc");
            reportViewer1.LocalReport.DataSources.Clear();
            foreach (var model in models)
            {
                ReportDataSource source = new ReportDataSource(model.Name, model.DataSource);
                reportViewer1.LocalReport.DataSources.Add(source);
            }

            reportViewer1.DataBind();
        }
        #endregion

        #region Calling Reports Function

        protected void btnPrint_Click(object sender, EventArgs e)
        {
            ReportPrintDocument rp = new ReportPrintDocument(reportViewer1.LocalReport);
            rp.Print();
        }

        private ReportInfo OpenReport(string ReportName)
        {

            GQ_ReportWebSetting Result = new GQ_ReportWebSetting();

            var DefauldReports = db.GQ_ReportWebSetting.Where(x => x.SystemCode == SystemCode && x.SubSystemCode == SubSystemCode && x.ReportID == ReportName);
            if (DefauldReports.Count() != 0)
            {
                var report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == branCode && x.USER_CODE == LoginUser);
                if (report.Count() == 0)
                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.USER_CODE == LoginUser);
                }
                if (report.Count() == 0)
                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == branCode);
                }
                if (report.Count() == 0)
                {
                    report = DefauldReports.Where(x => x.COMP_CODE == CompCode && x.BRA_Code == null);
                }
                if (report.Count() == 0)
                {
                    Result = DefauldReports.FirstOrDefault();
                }
                else
                {
                    Result = report.FirstOrDefault();
                }    
            }

            ReportInfo ReportInfoObj = new ReportInfo();
            ReportInfoObj.OutputTypeNo = Result != null ? Result.OutputTypeNo.ToString() : "";
            ReportInfoObj.OutputType = Result != null ? Result.OutputType : "";
            ReportInfoObj.dataSource = Result != null ? Result.ReportDataSouce : "";
            ReportInfoObj.PrinterName = Result != null ? Result.PrinterName : "";
            ReportInfoObj.PageSize = Result != null ? Result.PageSize : "";
            ReportInfoObj.RightMargin = Result != null ? Convert.ToDouble(Result.RightMarginMM) : 0;
            ReportInfoObj.LeftMargin = Result != null ? Convert.ToDouble(Result.LeftMarginMM) : 0;
            ReportInfoObj.TopMargin = Result != null ? Convert.ToDouble(Result.TopMarginMM) : 0;
            ReportInfoObj.BottomMargin = Result != null ? Convert.ToDouble(Result.BottomMarginMM) : 0;
            ReportInfoObj.PageHight = Result != null ? Convert.ToDouble(Result.PageHightCM) : 0;
            ReportInfoObj.PageWidth = Result != null ? Convert.ToDouble(Result.PageWidthCM) : 0;
            ReportInfoObj.Landscape = Result != null ? Convert.ToBoolean(Result.IsLandScape) : false;
            if (ScreenLanguage == "ar")
            {
                ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameAr : "";
            }
            else
            {
                ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameEn : "";
            }
            return ReportInfoObj;
        }

        private ReportStandardParameters getStandardParameters()
        {
            ReportStandardParameters StandardParameter = new ReportStandardParameters();
            ScreenLanguage = CurrentReportParameters.ScreenLanguage;
            //CurrentSession = JsonConvert.DeserializeObject<SessionRecord>(Request["ses"]);
            if (ScreenLanguage == "ar")
            {
                reportViewer1.Attributes.Add("style", "direction:rtl;");
            }
            else
            {
                reportViewer1.Attributes.Add("style", "direction:ltr;");
            }
            //int CompCode = int.Parse(Request["CompCode"].ToString());
            CompCode = int.Parse(CurrentReportParameters.CompCode);
            branCode = int.Parse(CurrentReportParameters.BranchCode);
            // G_COMPANY Comp = new G_COMPANY();
            var Comp = db.G_COMPANY.Where(x => x.COMP_CODE == CompCode).ToList();
            var Bra = db.G_BRANCH.Where(x => x.COMP_CODE == CompCode && x.BRA_CODE == branCode).ToList();
            NameAr = SecuritySystem.Decrypt(Comp[0].NameA);
            NameEn = SecuritySystem.Decrypt(Comp[0].NameE);

            BrNameAr = Bra[0].BRA_DESC;
            BrNameEn = Bra[0].BRA_DESCL;
            if (BrNameAr == null)
                BrNameAr = " ";
            if (BrNameEn == null)
                BrNameEn = " ";
            StandardParameter.spComCode = new SqlParameter("@comp", CompCode);

            //string comapnyName = Request["CompNameA"].ToString();
            StandardParameter.spComNameA = new SqlParameter("@CompNameA", NameAr);

            //string CompNameE = Request["CompNameE"].ToString();
            StandardParameter.spComNameE = new SqlParameter("@CompNameE", NameEn);

            //string BraNameA = Request["BraNameA"].ToString();
            StandardParameter.spBraNameA = new SqlParameter("@BraNameA", BrNameAr);

            //string BraNameE = Request["BraNameE"].ToString();
            StandardParameter.braNameE = new SqlParameter("@BraNameE", BrNameEn);

            SystemCode = CurrentReportParameters.SystemCode;

            SubSystemCode = CurrentReportParameters.SubSystemCode;


            LoginUser = CurrentReportParameters.UserCode;
            StandardParameter.spLoginUser = new SqlParameter("@LoginUser", LoginUser);

            StandardParameter.spbra = new SqlParameter("@bra", branCode);

            return StandardParameter;
        }

        public class ReportPrintDocument : PrintDocument
        {
            private PageSettings m_pageSettings;
            private int m_currentPage;
            private List<Stream> m_pages = new List<Stream>();

            public ReportPrintDocument(ServerReport serverReport)
                : this((Report)serverReport)
            {
                RenderAllServerReportPages(serverReport);
            }

            public ReportPrintDocument(LocalReport localReport)
                : this((Report)localReport)
            {
                RenderAllLocalReportPages(localReport);
            }

            private ReportPrintDocument(Report report)
            {
                // Set the page settings to the default defined in the report 
                ReportPageSettings reportPageSettings = report.GetDefaultPageSettings();
                m_pageSettings = new PageSettings();
                m_pageSettings.PaperSize = reportPageSettings.PaperSize;
                m_pageSettings.Margins = reportPageSettings.Margins;
                m_pageSettings.Landscape = true;
            }

            protected override void Dispose(bool disposing)
            {
                base.Dispose(disposing);

                if (disposing)
                {
                    foreach (Stream s in m_pages)
                    {
                        s.Dispose();
                    }

                    m_pages.Clear();
                }
            }

            protected override void OnBeginPrint(PrintEventArgs e)
            {
                base.OnBeginPrint(e);

                m_currentPage = 0;
            }

            protected override void OnPrintPage(PrintPageEventArgs e)
            {
                if (e == null)
                    throw new ArgumentNullException("e");

                base.OnPrintPage(e);

                Stream pageToPrint = m_pages[m_currentPage];
                pageToPrint.Position = 0;

                // Load each page into a Metafile to draw it. 
                using (Metafile pageMetaFile = new Metafile(pageToPrint))
                {
                    Rectangle adjustedRect = new Rectangle(
                            e.PageBounds.Left - (int)e.PageSettings.HardMarginX,
                            e.PageBounds.Top - (int)e.PageSettings.HardMarginY,
                            e.PageBounds.Width,
                            e.PageBounds.Height);

                    // Draw a white background for the report 
                    e.Graphics.FillRectangle(Brushes.White, adjustedRect);

                    // Draw the report content 
                    e.Graphics.DrawImage(pageMetaFile, adjustedRect);

                    // Prepare for next page.  Make sure we haven't hit the end. 
                    m_currentPage++;
                    e.HasMorePages = m_currentPage < m_pages.Count;
                }
            }

            protected override void OnQueryPageSettings(QueryPageSettingsEventArgs e)
            {
                if (e == null)
                    throw new ArgumentNullException("e");

                e.PageSettings = (PageSettings)m_pageSettings.Clone();
            }

            private void RenderAllServerReportPages(ServerReport serverReport)
            {
                string deviceInfo = CreateEMFDeviceInfo();

                // Generating Image renderer pages one at a time can be expensive.  In order 
                // to generate page 2, the server would need to recalculate page 1 and throw it 
                // away.  Using PersistStreams causes the server to generate all the pages in 
                // the background but return as soon as page 1 is complete. 
                NameValueCollection firstPageParameters = new NameValueCollection();
                firstPageParameters.Add("rs:PersistStreams", "True");

                // GetNextStream returns the next page in the sequence from the background process 
                // started by PersistStreams. 
                NameValueCollection nonFirstPageParameters = new NameValueCollection();
                nonFirstPageParameters.Add("rs:GetNextStream", "True");

                string mimeType;
                string fileExtension;
                Stream pageStream = serverReport.Render("IMAGE", deviceInfo, firstPageParameters, out mimeType, out fileExtension);

                // The server returns an empty stream when moving beyond the last page. 
                while (pageStream.Length > 0)
                {
                    m_pages.Add(pageStream);

                    pageStream = serverReport.Render("IMAGE", deviceInfo, nonFirstPageParameters, out mimeType, out fileExtension);
                }
            }

            private void RenderAllLocalReportPages(LocalReport localReport)
            {
                string deviceInfo = CreateEMFDeviceInfo();

                Warning[] warnings;
                localReport.Render("IMAGE", deviceInfo, LocalReportCreateStreamCallback, out warnings);
            }

            private Stream LocalReportCreateStreamCallback(
                string name,
                string extension,
                Encoding encoding,
                string mimeType,
                bool willSeek)
            {
                MemoryStream stream = new MemoryStream();
                m_pages.Add(stream);

                return stream;
            }

            private string CreateEMFDeviceInfo()
            {
                PaperSize paperSize = m_pageSettings.PaperSize;
                Margins margins = m_pageSettings.Margins;

                // The device info string defines the page range to print as well as the size of the page. 
                // A start and end page of 0 means generate all pages. 
                return string.Format(
                    CultureInfo.InvariantCulture,
                    "<DeviceInfo><OutputFormat>emf</OutputFormat><StartPage>0</StartPage><EndPage>0</EndPage><MarginTop>{0}</MarginTop><MarginLeft>{1}</MarginLeft><MarginRight>{2}</MarginRight><MarginBottom>{3}</MarginBottom><PageHeight>{4}</PageHeight><PageWidth>{5}</PageWidth></DeviceInfo>",
                    ToInches(margins.Top),
                    ToInches(margins.Left),
                    ToInches(margins.Right),
                    ToInches(margins.Bottom),
                    "21.5cm",
                    "14cm");
            }

            private static string ToInches(int hundrethsOfInch)
            {
                double inches = hundrethsOfInch / 100.0;
                return inches.ToString(CultureInfo.InvariantCulture) + "in";
            }
        }

        public void ReportsDetails()
        {

            ReportsDetail.PrintName = Rep.PrinterName;
            ReportsDetail.PageSize = Rep.PageSize;
            ReportsDetail.Landscape = Rep.Landscape;
            ReportsDetail.RightMargin = Rep.RightMargin;
            ReportsDetail.LeftMargin = Rep.LeftMargin;
            ReportsDetail.TopMargin = Rep.TopMargin;
            ReportsDetail.BottomMargin = Rep.BottomMargin;
            ReportsDetail.PageHight = Rep.PageHight;
            ReportsDetail.PageWidth = Rep.PageWidth;

        }

        #endregion
        /// <summary>
        //work 1/12/2020
        /// </summary>
        /// <returns></returns>
    
    }

}



