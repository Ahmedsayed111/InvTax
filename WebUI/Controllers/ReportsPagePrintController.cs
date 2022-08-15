//using Inv.API.Models.CustomEntities;
using Inv.WebUI.Reports.Models;
using Microsoft.Reporting.WebForms;
using System;
using System.IO;
using System.Web.Mvc;
using Inv.WebUI.Reports.Forms;
using System.Collections.Generic;
using Inv.DAL.Domain;
using Inv.DAL.Repository;
using System.Net.Http;
using System.Web.Configuration;
using System.Data.SqlClient;
using Inv.API.Tools;
using Newtonsoft.Json;
using System.Linq;
using Shared = System.Web.Mvc.Shared;
using QRCoder;
using System.Drawing;
using System.Web;
using Microsoft.Reporting.WebForms.Internal.Soap.ReportingServices2005.Execution;
using System.Windows.Documents;
using Inv.WebUI.Models;
using Warning = Microsoft.Reporting.WebForms.Warning;
using Spire.Xls;
using Spire.Pdf;
using FileFormat = Spire.Pdf.FileFormat;
using System.Web.UI.WebControls;
using System.Text;
using Microsoft.Win32; 
//using Spire.Xls;

namespace Inv.WebUI.Controllers
{//eslam 1 dec 2020
    public class ReportsPagePrintController : Controller
    {


        StdParamters CurrentReportParameters;

        ReportsDetails ReportsDetail = new ReportsDetails();
        ReportInfo Rep = new ReportInfo();
        ClassPrint Printer = new ClassPrint();

        protected TaxEntities db = UnitOfWork.context(BuildConnectionString());
        string NameAr;
        string NameEn;
        string BrNameAr;
        string BrNameEn;
        string DocNo = "";
        string VatNo = "";
        string Name_File = "";
        string Comp = "";
        string DocPDFFolder = "";
        string SystemCode = "";
        string SubSystemCode = "";
        int CompCode = 0;
        int? branCode = 0;
        string LoginUser = "";
        string ScreenLanguage = "";
        string reportName = "";
        object[] query;
        int TRId;
        ReportViewer reportViewer = new ReportViewer();
        public static string BuildConnectionString()
        {
            var httpClient = new HttpClient();
            var res = httpClient.GetStringAsync(WebConfigurationManager.AppSettings["ServiceUrl"] + "SystemTools/BuildConnection").Result;
            return res;
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
        public ReportService getStandardParameters(StdParamters sr)
        {
            ReportService rep = new ReportService();


            rep.AddParameter("BranchCode", sr.BranchCode);
            rep.AddParameter("LoginUser", sr.UserCode);
            rep.AddParameter("UserCode", sr.UserCode);
            rep.AddParameter("Tokenid", "HGFD-" + sr.Tokenid);
            rep.AddParameter("ScreenLanguage", sr.ScreenLanguage);
            rep.AddParameter("SystemCode", sr.SystemCode);
            rep.AddParameter("SubSystemCode", sr.SubSystemCode);
            rep.AddParameter("CompNameA", sr.CompNameA);
            rep.AddParameter("CompNameE", sr.CompNameE);
            rep.AddParameter("CompCode", sr.CompCode);

            if (string.IsNullOrEmpty(sr.BranchName))
            {
                rep.AddParameter("BraNameA", "");
                rep.AddParameter("BraNameE", "");
            }
            else
            {
                rep.AddParameter("BraNameA", sr.BranchName);
                rep.AddParameter("BraNameE", sr.BranchName);
            }


            return rep;
        }
        private ReportStandardParameters getStandardParameters(RepFinancials RepPar)
        {
            ReportStandardParameters StandardParameter = new ReportStandardParameters();


            ScreenLanguage = RepPar.Language;
            //CurrentSession = JsonConvert.DeserializeObject<SessionRecord>(Request["ses"]);
            if (ScreenLanguage == "ar")
            {
                reportViewer.Attributes.Add("style", "direction:rtl;");
            }
            else
            {
                reportViewer.Attributes.Add("style", "direction:ltr;");
            }
            //int CompCode = int.Parse(Request["CompCode"].ToString());
            CompCode = int.Parse(RepPar.CompCode);
            branCode = int.Parse(RepPar.BranchCode);
            // G_COMPANY Comp = new G_COMPANY();
            var Comp = db.G_COMPANY.Where(x => x.COMP_CODE == CompCode).ToList();
            var Bra = db.G_BRANCH.Where(x => x.COMP_CODE == CompCode && x.BRA_CODE == branCode).ToList();
            NameAr =  Comp[0].NameA;
            NameEn =  Comp[0].NameE;

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

            SystemCode = RepPar.SystemCode;

            SubSystemCode = RepPar.SubSystemCode;


            LoginUser = RepPar.UserCode;
            StandardParameter.spLoginUser = new SqlParameter("@LoginUser", LoginUser);

            StandardParameter.spbra = new SqlParameter("@bra", branCode);

            return StandardParameter;
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
            ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameAr : "";
            //if (ScreenLanguage == "ar")
            //{
            //    ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameAr : "";
            //}
            //else
            //{
            //    ReportInfoObj.reportName = Result != null ? Result.ReportDesignNameEn : "";
            //}
            return ReportInfoObj;
        }


        public string buildReport(params object[] models)
        {



            string ReportPDFFilename = "Report-" + DateTime.Now + ".pdf";
            LocalReport localReport = new LocalReport();
            localReport.DataSources.Clear();
            foreach (var model in models)
            {
                ReportDataSource source = new ReportDataSource(reportName, model);

                localReport.DataSources.Add(source);

            }


            if (reportName.Contains("Prnt"))
            {
                localReport.ReportPath = Server.MapPath("../Reports/Report/Print/" + reportName + ".rdlc");
            }
            else if (reportName.Contains("Slip"))
            {
                localReport.ReportPath = Server.MapPath("../Reports/Report/Slip/" + reportName + ".rdlc");
            }
            else
            {
                localReport.ReportPath = Server.MapPath("../Reports/Report/Reports/" + reportName + ".rdlc");
            }

            try
            {

                //byte[] renderdByte;
                //renderdByte = localReport.Render("PDF"); 
                //DownloadContract(DocPDFFolder, "" + Name_File + "" + VatNo + "_" + (System.DateTime.Now.ToString("yyyy-MM-dd hh-mm")) + "_" + DocNo + "", renderdByte);

                //string reportType = "MHTML";
                //byte[] renderedBytes;
                //renderedBytes = localReport.Render(reportType, "<DeviceInfo><OutputFormat>web archive</OutputFormat></DeviceInfo>");

                //string base64String = Convert.ToBase64String(renderedBytes);
                //return base64String;


                //string mimeType,
                //    encoding, fileNameExtension;
                //Warning[] warnings = null;
                //string[] streamIds = null;

                //byte[] exportBytes = localReport.Render("Excel", null, out mimeType, out encoding,
                //    out fileNameExtension, out streamIds, out warnings);


                //string Str = Server.MapPath(@"~/");
                //FileStream fs = new FileStream(Str + "report.xls", FileMode.Create, FileAccess.ReadWrite);
                //fs.Write(exportBytes, 0, exportBytes.Length);
                //fs.Close();

                //Workbook workbook = new Workbook();
                //workbook.LoadFromFile(Str + "report.xls");
                //Worksheet sheet = workbook.Worksheets[0];
                //sheet.SaveToHtml(Str + "report.html");

                //string html = System.IO.File.ReadAllText(Str + "report.html");

                //return html;

                //Warning[] warnings;
                //string[] streamids;
                //string encoding; 
                //string extension;
                //string mimeType = "image/png";
                //string deviceInfo = "<DeviceInfo><OutputFormat>png</OutputFormat><StartPage>0</StartPage></DeviceInfo>";
                //byte[] byts = null;
                //byts = localReport.Render("Image", deviceInfo, out mimeType, out encoding, out extension, out streamids, out warnings);

                //int Pages = byts.;





                //string imagesAll = ""; 

                //bool startup = true;
                //List<byte[]> streams = new List<byte[]>();
                //List<string> base64String = new List<string>();
                //int numberOfPages = 0;
                //byte[] result = null;
                //while (startup || result.Length > 0)
                //{
                //    startup = false;
                //    string devInfo = String.Format(@"<DeviceInfo><OutputFormat>png</OutputFormat><PrintDpiX>150</PrintDpiX><PrintDpiY>150</PrintDpiY><StartPage>{0}</StartPage></DeviceInfo>", numberOfPages + 1);
                //    string Imagee;
                //    result = localReport.Render("IMAGE", devInfo);

                //    if (result.Length > 0)
                //    {
                //        streams.Add(result);
                //        Imagee = Convert.ToBase64String(result).ToString();
                //        imagesAll += "<img src='data:image/png;base64," + Imagee + "' />";
                //        //base64String.Add(Imagee);
                //    }

                //    //base64String[numberOfPages] = Convert.ToBase64String(result);
                //    numberOfPages++;
                //}
                //return imagesAll;


                string Str = Server.MapPath("/SavePath");
                
                byte[] renderdByte;
                renderdByte = localReport.Render("PDF");

                //string savePath = System.Web.HttpContext.Current.Server.MapPath(@"~/") + @"SavePath\Report" + ".pdf";
                //System.IO.File.WriteAllBytes(savePath, renderdByte);


                PdfDocument pdf = new PdfDocument();
                pdf.LoadFromBytes(renderdByte);
                pdf.SaveToFile(Str + "Result.html", FileFormat.HTML);

                string html = System.IO.File.ReadAllText(Str + "Result.html");
                return html;

                //base64String = Convert.ToBase64String(result);







            }
            catch (Exception ex)
            { 
                throw;
            }


        }
        public void DownloadDdf(string url)
        {
            try
            {
                //string savePath = System.Web.HttpContext.Current.Server.MapPath(@"~/") + @"SavePath\" + nid + " " + ".pdf";
                //System.IO.File.WriteAllBytes(savePath, contractByte);
                //string path = @"F:/PDFFolder/" + @"Comp1\" + nid + "" + ".pdf" D:/PDFFolder/;

                //SessionRecord ses = new SessionRecord();
                //ses.CurrentYear = WebConfigurationManager.AppSettings["DefaultYear"];
                //ses.ScreenLanguage = WebConfigurationManager.AppSettings["Defaultlanguage"];


                //PdfDocument pdf = new PdfDocument();
                //pdf.LoadFromFile(Str);



                //StringBuilder buffer = new StringBuilder();

                //foreach (PdfPageBase page in pdf.Pages)
                //{
                //    buffer.Append(page.ExtractText());
                //}

                //pdf.Close();
                //String fileName = @"C:\Users\Tamal\Desktop\101395a.txt";
                //File.WriteAllText(fileName, buffer.ToString());
                //System.Diagnostics.Process.Start(fileName);


                string Str = Server.MapPath(@"~/SavePath\Report.pdf");


                byte[] bytes = System.IO.File.ReadAllBytes(Str);

               

                string savePath = System.Web.HttpContext.Current.Server.MapPath(GetFileName("Report")) + "Report.pdf";
                System.IO.File.WriteAllBytes(savePath, bytes);





                //SaveFileDialog saveFileDialog1 = new SaveFileDialog();

                //using (Stream s = File.open)


                //System.IO.File.WriteAllBytes("hello.pdf", bytes);

                //Warning[] warnings;
                //string[] streamIds;
                //string mimeType = string.Empty;
                //string encoding = string.Empty;
                //string extension = string.Empty;
                //byte[] bytes = GeMimeTypeFromImageByteArray(bytess);
                //Response.Buffer = true;
                //Response.Clear();
                //Response.ContentType = mimeType;
                //Response.AddHeader("content-disposition", "attachment; filename=" + reportName + "." + extension);
                //Response.OutputStream.Write(bytes, 0, bytes.Length);
                //Response.Flush();
                //Response.End();

                //FileStream fs = new FileStream(Server.MapPath(Str), FileMode.Create);
                //fs.Write(bytes, 0, bytes.Length);
                //fs.Close();


                //FileInfo fi = new FileInfo(Str);

                ////Open file for Read\Write
                //FileStream fs = fi.Open(FileMode.OpenOrCreate, FileAccess.ReadWrite, FileShare.ReadWrite);

                ////create byte array of same size as FileStream length
                //byte[] fileBytes = new byte[fs.Length];

                ////define counter to check how much bytes to read. Decrease the counter as you read each byte
                //int numBytesToRead = (int)fileBytes.Length;

                ////Counter to indicate number of bytes already read
                //int numBytesRead = 0;

                ////iterate till all the bytes read from FileStream
                //while (numBytesToRead > 0)
                //{
                //    int n = fs.Read(fileBytes, numBytesRead, numBytesToRead);

                //    if (n == 0)
                //        break;

                //    numBytesRead += n;
                //    numBytesToRead -= n;
                //}

                ////Once you read all the bytes from FileStream, you can convert it into string using UTF8 encoding
                //string filestring = Encoding.UTF8.GetString(fileBytes);



            }
            catch (Exception ex)
            {

            }
        }


        public string GetFileName(string FileNameWithExtension)
        {
            try
            {
                return FileNameWithExtension.Substring(0, FileNameWithExtension.LastIndexOf('.'));
            }
            catch (Exception)
            {
                return "";
            }
        }



        public IEnumerable<Prnt_Quotation_Result> Prnt_Quotation(RepFinancials RepPar)
        {
            ReportStandardParameters StandPar = getStandardParameters(RepPar);

            var TRId = int.Parse(RepPar.TRId.ToString());
            SqlParameter spTRId = new SqlParameter("@TRId", TRId);
            int typ = int.Parse(RepPar.Typ.ToString());
            if (RepPar.Repdesign == 1)
            {
                Rep = OpenReport("Prnt_Quotation");
            }
            else if (RepPar.Repdesign == 2)
            {
                Rep = OpenReport("Prnt_DeleviryNote");
            }
            else
            {
                Rep = OpenReport("Prnt_Invoice");
            }
                  
                
            int Type = int.Parse(RepPar.Type.ToString());
            if (Type == 0) { Type = int.Parse(Rep.OutputTypeNo); }
            SqlParameter spRepType = new SqlParameter("@RepType", Type);
             
            string _Query = "execute " + Rep.dataSource +
                " @comp = '" + StandPar.spComCode.Value + "'" +
                ", @bra = '" + StandPar.spbra.Value + "'" +
                ", @CompNameA = '" + StandPar.spComNameA.Value + "'" +
                ", @CompNameE = '" + StandPar.spComNameE.Value + "'" +
                ", @BraNameA = '" + StandPar.spBraNameA.Value + "'" +
                ", @BraNameE = '" + StandPar.braNameE.Value + "'" +
                ", @LoginUser = '" + StandPar.spLoginUser.Value + "'" +
                 ",@RepType = " + spRepType.Value +
                 ",@TRId = " + spTRId.Value;

            var query = db.Database.SqlQuery<Prnt_Quotation_Result>(_Query).ToList();

            string qr = query[0].QRSTR;
            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(qr, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            var QRcode = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] byteimage = ms.ToArray();
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            query[0].QRSTR = QRcode;


            ReportsDetails();

            reportName = Rep.reportName;

            return query;
            // reportName = Rep.reportName; 
        }



    }
}