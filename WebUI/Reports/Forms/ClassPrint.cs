using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace Inv.WebUI.Reports.Forms
{

    

    public class ClassPrint
    {
        private static List<Stream> m_streams;
        private static int m_currentPageIndex;

        public void PrintToPrinter(LocalReport report, ReportsDetails ReportsDetail)
        {
            Export(report, ReportsDetail);

        }

        public static void Export(LocalReport report, ReportsDetails ReportsDetail, bool print = true)
        {

            if (ReportsDetail.TopMargin == 0) { ReportsDetail.TopMargin = 0.5; } else { ReportsDetail.TopMargin = (Convert.ToDouble(ReportsDetail.TopMargin) / 10); }
            if (ReportsDetail.LeftMargin == 0) { ReportsDetail.LeftMargin = 0.5; } else { ReportsDetail.LeftMargin = (Convert.ToDouble(ReportsDetail.LeftMargin) / 10); }
            if (ReportsDetail.RightMargin == 0) { ReportsDetail.RightMargin = 0.5; } else { ReportsDetail.RightMargin = (Convert.ToDouble(ReportsDetail.RightMargin) / 10); }
            if (ReportsDetail.BottomMargin == 0) { ReportsDetail.BottomMargin = 0.5; } else { ReportsDetail.BottomMargin = (Convert.ToDouble(ReportsDetail.BottomMargin) / 10); }

            if (ReportsDetail.PageWidth == 0) { ReportsDetail.PageWidth = 21; } 
            if (ReportsDetail.PageHight == 0) { ReportsDetail.PageHight = 29.7; } 


            string deviceInfo =
         "<DeviceInfo>" +
         "  <OutputFormat>EMF</OutputFormat>" +
         "  <PageWidth>"+ ReportsDetail.PageWidth + "cm</PageWidth>" +
         "  <PageHeight>"+ ReportsDetail.PageHight + "cm</PageHeight>" +
         "  <MarginTop>" + ReportsDetail.TopMargin + "cm</MarginTop>" +
         "  <MarginLeft>" + ReportsDetail.LeftMargin + "cm</MarginLeft>" +
         "  <MarginRight>" + ReportsDetail.RightMargin + "cm</MarginRight>" +
         "  <MarginBottom>" + ReportsDetail.BottomMargin + "cm</MarginBottom>" +
         "</DeviceInfo>";

            Warning[] warnings;
            m_streams = new List<Stream>();
            report.Render("Image", deviceInfo, CreateStream, out warnings);
            foreach (Stream stream in m_streams)
                stream.Position = 0;

            if (print)
            {
                Print(report,ReportsDetail.PrintName, ReportsDetail.PageSize, ReportsDetail.Landscape);
            }
        }


        public static void Print(LocalReport report, string PrintName, string PageSize, bool Landscape)
        {
            if (m_streams == null || m_streams.Count == 0)
                throw new Exception("Error: no stream to print.");
            PrintDocument printDoc = new PrintDocument();
            PrinterSettings ps = new PrinterSettings();
            printDoc.PrinterSettings = ps;
            if (!printDoc.PrinterSettings.IsValid)
            {
                throw new Exception("Error: cannot find the default printer.");
            }
            else
            {
                printDoc.PrintPage += new PrintPageEventHandler(PrintPage);
                if (PrintName != null)
                {
                    printDoc.PrinterSettings.PrinterName = PrintName;

                }


                if (PageSize != null)
                {
                    var Paper = GetPaperSize(PageSize);
                    printDoc.DefaultPageSettings.PaperSize = Paper;
                }
                else
                {
                    //IEnumerable<PaperSize> paperSizes = ps.PaperSizes.Cast<PaperSize>();
                    //PaperSize sizeA4 = paperSizes.First<PaperSize>(size => size.Kind == PaperKind.A4); // setting paper size to A4 size    
                    //printDoc.DefaultPageSettings.PaperSize = sizeA4;

                    printDoc.DefaultPageSettings.PaperSize = report.GetDefaultPageSettings().PaperSize;
                    printDoc.DefaultPageSettings.Margins = report.GetDefaultPageSettings().Margins;
                    printDoc.DefaultPageSettings.Landscape = report.GetDefaultPageSettings().IsLandscape;
                }

                if (Landscape != false)
                {
                    printDoc.DefaultPageSettings.Landscape = Landscape;

                }

                m_currentPageIndex = 0;
                printDoc.Print();
                //here's a way to set the paper size by kind like 'A4' for example

                // Conversion from String to Enum 
                //var Paper = (PaperKind)Enum.Parse(typeof(PaperKind), "A6");


                //IEnumerable<PaperSize> paperSizes = ps.PaperSizes.Cast<PaperSize>();
                //PaperSize sizeA4 = paperSizes.First<PaperSize>(size => size.Kind == Paper); // setting paper size to A4 size                                                                                                   //recordDoc.DefaultPageSettings.PaperSize = sizeA4;



                //printDoc.DefaultPageSettings.Landscape.PaperSize = sizeA4;

            }



        }
        public static PaperSize GetPaperSize(string Name)
        {
            PaperSize size1 = null;
            Name = Name.ToUpper();
            PrinterSettings settings = new PrinterSettings();
            foreach (PaperSize size in settings.PaperSizes)
                if (size.Kind.ToString().ToUpper() == Name)
                {
                    size1 = size;
                    break;
                }
            return size1;
        }
        public static Stream CreateStream(string name, string fileNameExtension, Encoding encoding, string mimeType, bool willSeek)
        {
            Stream stream = new MemoryStream();
            m_streams.Add(stream);
            return stream;
        }

        public static void PrintPage(object sender, PrintPageEventArgs ev)
        {
            Metafile pageImage = new
               Metafile(m_streams[m_currentPageIndex]);

            // Adjust rectangular area with printer margins.
            Rectangle adjustedRect = new Rectangle(
                ev.PageBounds.Left - (int)ev.PageSettings.HardMarginX,
                ev.PageBounds.Top - (int)ev.PageSettings.HardMarginY,
                ev.PageBounds.Width,
                ev.PageBounds.Height);

            //PageSettings page = new PageSettings();
            //page.PaperSize
            // Draw a white background for the report
            ev.Graphics.FillRectangle(Brushes.White, adjustedRect);

            // Draw the report content
            ev.Graphics.DrawImage(pageImage, adjustedRect);

            // Prepare for the next page. Make sure we haven't hit the end.
            m_currentPageIndex++;
            ev.HasMorePages = (m_currentPageIndex < m_streams.Count);

            // Draw the report FromLTRB (int left, int top, int right, int bottom);
            //Rectangle myRectangle = Rectangle.FromLTRB(200, 150, 300, 400);
            //ev.Graphics.DrawRectangle(SystemPens.ControlText, myRectangle);
        }

        public static void DisposePrint()
        {
            if (m_streams != null)
            {
                foreach (Stream stream in m_streams)
                    stream.Close();
                m_streams = null;
            }
        }





    }
}