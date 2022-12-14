using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using APIETAX.CustomModel;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json.Linq;
using System.Text;
using Microsoft.Extensions.Configuration;
using Inv.DAL.Domain;

namespace APIETAX
{



    public class HomeSendinvoce
    {
        //public static string connectionString = @"Data Source=192.168.1.50\SQL2014;Initial Catalog=TESTRAGAB;User Id=SYSUSER;Password=SYSUSER";
        public static string connectionString = @"Data Source=.;Initial Catalog=InvoiceTax;User Id=sa;Password=619619";
        private IConfiguration Configuration;

        public HomeSendinvoce(IConfiguration _configuration)
        {
            Configuration = _configuration;
            connectionString = Configuration.GetSection("MySettings").GetSection("DbConnection").Value;

        }


        //internal static string sendinvoce(int Optype, int InvoiceID, I_ControlTax I_ControlTax)
        //{

        //    string UUid = "";
        //    try
        //    {
        //        List<IQ_InvoiceHedar_Tax> Header = new List<IQ_InvoiceHedar_Tax>();
        //        List<IQ_InvoiceHedar_Tax> Header2 = new List<IQ_InvoiceHedar_Tax>();
        //        List<IQ_InvoiceHedar_Tax> Header3 = new List<IQ_InvoiceHedar_Tax>();
        //        List<IQ_EGTaxInvItems> lstInvItems = new List<IQ_EGTaxInvItems>();

        //        Header = GetInvHeader();   // get all invoices issues or to cancel 
        //        lstInvItems = GetInvItems();

        //        if (Optype == 1 || Optype == 0)  // upload invoice
        //        {
        //            if (InvoiceID == 0)
        //                Header.Where(x => x.Status == 1 && x.DocType == "I").ToList();
        //            else
        //                Header = Header.Where(x => x.InvoiceID == InvoiceID).ToList();

        //        }
        //        if (Optype == 2 || Optype == 0) // upload Cr/Db Note
        //        {
        //            if (InvoiceID == 0)
        //                Header.Where(x => x.Status == 1 && x.DocType == "C").ToList();
        //            else
        //                Header.Where(x => x.Status == 1 && x.UUID == "" && x.DocType == "C" && x.InvoiceID == InvoiceID).ToList();
        //        }
        //        if (Optype == 3 || Optype == 0) // Cancel invoice and CRDB
        //        {
        //            if (InvoiceID == 0)
        //                Header.Where(x => x.Status == 10).ToList();
        //            else
        //                Header.Where(x => x.Status == 10 && x.InvoiceID == InvoiceID).ToList();
        //            foreach (var item in Header)
        //            {
        //                cancelledinv(item, I_ControlTax);
        //            }
        //            return "cancelled " + Header.Count;
        //        }
        //        if (Optype == 4 || Optype == 0) // Update invoice status
        //        {
        //            string UpdateDocuments = RecentDocumentsSengel(I_ControlTax);
        //            return UpdateDocuments;
        //        }

        //        if (Header.Count > 0)
        //        {

        //            foreach (var item in Header)
        //            {
        //                DateTime TaxUploadDate = DateTime.Now;
        //                string DATAA = TaxUploadDate.Year.ToString() + "-" + TaxUploadDate.Day + "-" + TaxUploadDate.Month;
        //                IQ_InvoiceHedar_Tax HeaderSend = new IQ_InvoiceHedar_Tax();
        //                HeaderSend = item;
        //                List<IQ_EGTaxInvItems> lstInvItemsSend = new List<IQ_EGTaxInvItems>();
        //                lstInvItemsSend = lstInvItems.Where(xx => xx.InvoiceID == HeaderSend.InvoiceID).ToList();
        //                 UUid = GetDocumentsSend(HeaderSend, lstInvItemsSend, I_ControlTax);

        //                if (UUid != "" || UUid != null)
        //                {
        //                    //System.Data.Common and System.Data.SqlClient.


        //                    string sql = @"UPDATE [I_Sls_TR_Invoice]   SET DocUUID = @UUid ,Status = @Status,TaxUploadDate = @TaxUploadDate WHERE InvoiceID = @InvoiceID";
        //                    using (var con = new System.Data.SqlClient.SqlConnection(connectionString))
        //                    {
        //                        con.Open();
        //                        //DONE: IDisposable (SqlCommand) should be wrapped into using
        //                        using (var cmd = new System.Data.SqlClient.SqlCommand(sql, con))
        //                        {
        //                            //TODO: AddWithValue is often a bad choice; change to Add 
        //                            cmd.Parameters.AddWithValue("@UUid", UUid);
        //                            cmd.Parameters.AddWithValue("@Status", 2);
        //                            cmd.Parameters.AddWithValue("@TaxUploadDate", DATAA);
        //                            cmd.Parameters.AddWithValue("@InvoiceID", HeaderSend.InvoiceID);
        //                            cmd.ExecuteNonQuery();
        //                        }

        //                        string QueryTaxLoge = "INSERT INTO [dbo].[G_TaxLog]([TRNO],[OldStates],[NewStates],[Update_Date],[TypeAction] ) VALUES(@TrNo,@oldeStatus,@newstates,@UpdateDate,@TypeAction)";

        //                        using (var cmd2 = new System.Data.SqlClient.SqlCommand(QueryTaxLoge, con))
        //                        {
        //                            cmd2.Parameters.AddWithValue("@TrNo", HeaderSend.TrNo);
        //                            cmd2.Parameters.AddWithValue("@oldeStatus", HeaderSend.Status);
        //                            cmd2.Parameters.AddWithValue("@newstates", 2);
        //                            cmd2.Parameters.AddWithValue("@UpdateDate", DATAA);
        //                            cmd2.Parameters.AddWithValue("@TypeAction", "Upload");
        //                            cmd2.ExecuteNonQuery();
        //                        }
        //                    }

        //                    DownloadPDF(UUid, I_ControlTax);

        //                }
        //                else
        //                {

        //                }

        //            }
        //        }


        //        return Header.Count.ToString();
        //    }
        //    catch (Exception EX)
        //    {
        //        EX.InnerException.ToString();
        //        EX.Message.ToString();
        //        return EX.Message.ToString();
        //    }
        //}


        public static string RemoveCharFromString(string input, char charItem)
        {
            int indexOfChar = input.IndexOf(charItem);
            if (indexOfChar < 0)
            {
                return input;
            }
            return RemoveCharFromString(input.Remove(indexOfChar, 1), charItem);
        }

        internal static string cancelledinv(IQ_InvoiceHedar_Tax Header, I_ControlTax I_ControlTax)
        {
            DateTime CurantDate = DateTime.Now;
            RestClient client = new RestClient();


            client = new RestClient("" + Header.UUID + "/pdf?=");

            client.Timeout = -1;
            var request = new RestRequest(Method.PUT);
            request.AddHeader("Content-Type", "application/json");
            request.AddHeader("Authorization", "Bearer " + I_ControlTax.access_token + "");
            var body = @"{" + "\n" +
            @"	""status"":""cancelled""," + "\n" +
            @"	""reason"":""some reason for cancelled document""" + "\n" +
            @"}";
            request.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);

            if (response.Content != null)
            {

                string sql = @"UPDATE [I_Sls_TR_Invoice]   SET DocUUID = @UUid ,Status = @Status WHERE UUID = @UUID";

                using (var con = new System.Data.SqlClient.SqlConnection(connectionString))
                {
                    con.Open();

                    //DONE: IDisposable (SqlCommand) should be wrapped into using
                    using (var cmd = new System.Data.SqlClient.SqlCommand(sql, con))
                    {
                        //TODO: AddWithValue is often a bad choice; change to Add 
                        cmd.Parameters.AddWithValue("@UUid", Header.UUID);
                        cmd.Parameters.AddWithValue("@Status", 12);
                        cmd.Parameters.AddWithValue("@UUID", Header.UUID);

                        cmd.ExecuteNonQuery();
                    }
                    string QueryTaxLoge = "INSERT INTO [dbo].[G_TaxLog]([TRNO],[OldStates],[NewStates],[Update_Date],[TypeAction],[Remark]) VALUES(@TrNo,@oldeStatus,@newstates,@UpdateDate,@TypeAction,@Remark)";

                    using (var cmd2 = new System.Data.SqlClient.SqlCommand(QueryTaxLoge, con))
                    {
                        cmd2.Parameters.AddWithValue("@TrNo", Header.TrNo);
                        cmd2.Parameters.AddWithValue("@oldeStatus", Header.Status);
                        cmd2.Parameters.AddWithValue("@newstates", 12);
                        cmd2.Parameters.AddWithValue("@UpdateDate", CurantDate);
                        cmd2.Parameters.AddWithValue("@TypeAction", "Cancelled");
                        cmd2.Parameters.AddWithValue("@Remark", response.Content);
                        cmd2.ExecuteNonQuery();
                    }
                }

                DownloadPDF(Header.UUID, I_ControlTax);
            }
            else
            {

            }


            return response.Content;
        }

        public static byte[] GETPDF(string UUID)
        {


            var net = new System.Net.WebClient();
            var data2 = net.DownloadData(UUID);
            var content2 = new System.IO.MemoryStream(data2);
            byte[] renderdByte = content2.ToArray();

            //return Ok(new BaseResponse(CustomPDF));

            return renderdByte;
        }

        internal static void DownloadPDF(string UUID, I_ControlTax I_ControlTax)
        {
            RestClient client = new RestClient();
            client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1/documents/" + UUID + "/pdf?=");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("Authorization", "Bearer " + I_ControlTax.access_token + "");
            IRestResponse response = client.Execute(request);
            var content_ = response.Content;
            byte[] renderdByte = response.RawBytes;
            string path = I_ControlTax.DocPDFFolder;
            try
            {
                System.IO.File.WriteAllBytes(I_ControlTax.DocPDFFolder + @"\" + UUID + "" + ".pdf", renderdByte);
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        internal static List<IQ_EGTaxInvItems> GetInvItems()
        {
            List<IQ_EGTaxInvItems> InvItemsList = new List<IQ_EGTaxInvItems>();
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
                                IQ_EGTaxInvItems InvItems = new IQ_EGTaxInvItems();
                                InvItems.CurrencyCode = dt.Rows[i]["CurrencyCode"].ToString();
                                InvItems.DescA = dt.Rows[i]["DescA"].ToString();
                                InvItems.diff = Convert.ToDecimal(dt.Rows[i]["diff"]);
                                InvItems.Discount = Convert.ToDecimal(dt.Rows[i]["Discount"]);
                                InvItems.DiscountPrc = Convert.ToDecimal(dt.Rows[i]["DiscountPrc"]);
                                InvItems.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvItems.InvoiceItemID = Convert.ToInt32(dt.Rows[i]["InvoiceItemID"]);
                                InvItems.ItemCode = dt.Rows[i]["ItemCode"].ToString();
                                InvItems.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvItems.NetTotal = Convert.ToDecimal(dt.Rows[i]["NetTotal"]);
                                InvItems.OldItemCode = dt.Rows[i]["OldItemCode"].ToString();
                                InvItems.RefItemCode = dt.Rows[i]["RefItemCode"].ToString();
                                InvItems.SalesTotal = Convert.ToDecimal(dt.Rows[i]["SalesTotal"]);
                                InvItems.Serial = Convert.ToInt32(dt.Rows[i]["Serial"]);
                                InvItems.SoldQty = Convert.ToDecimal(dt.Rows[i]["SoldQty"]);
                                InvItems.TaxableFees = Convert.ToDecimal(dt.Rows[i]["TaxableFees"]);
                                InvItems.TaxSubType = dt.Rows[i]["TaxSubType"].ToString();
                                InvItems.TaxType = dt.Rows[i]["TaxType"].ToString();
                                InvItems.Total = Convert.ToDecimal(dt.Rows[i]["Total"]);
                                InvItems.Unitprice = Convert.ToDecimal(dt.Rows[i]["Unitprice"]);
                                InvItems.UomCode = dt.Rows[i]["UomCode"].ToString();
                                InvItems.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);
                                InvItems.VatPrc = Convert.ToDecimal(dt.Rows[i]["VatPrc"]);
                                InvItemsList.Add(InvItems);
                            }
                        }

                    }
                }

            }
            return InvItemsList.ToList();
        }

        internal static List<IQ_InvoiceHedar_Tax> GetInvHeader()
        {
            List<IQ_InvoiceHedar_Tax> InvHeaderList = new List<IQ_InvoiceHedar_Tax>();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                string condetion = " select * from [IQ_InvoiceHedar_Tax] Where  status <> 3 and status = 1 or status = 10 ";


                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(condetion, con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {
                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {


                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                IQ_InvoiceHedar_Tax InvHeader = new IQ_InvoiceHedar_Tax();
                                InvHeader.branchID_iss = Convert.ToInt32(dt.Rows[i]["sub_Bra_code"]);
                                InvHeader.name_iss = dt.Rows[i]["sub_Bra_Name"].ToString();
                                InvHeader.country_iss = dt.Rows[i]["Sub_Country"].ToString();
                                InvHeader.governate_iss = dt.Rows[i]["sub_governate"].ToString();
                                InvHeader.regionCity_iss = dt.Rows[i]["Sub_City"].ToString();
                                InvHeader.street_iss = dt.Rows[i]["Sub_Street"].ToString();
                                InvHeader.buildingNumber_iss = dt.Rows[i]["sub_BuildingNo"].ToString();
                                InvHeader.postalCode_iss = dt.Rows[i]["sub_PostalCode"].ToString();
                                InvHeader.floor_iss = dt.Rows[i]["sub_Floor"].ToString();
                                InvHeader.room_iss = dt.Rows[i]["sub__Room"].ToString();
                                InvHeader.landmark_iss = dt.Rows[i]["sub_LandMarks"].ToString();
                                InvHeader.additionalInformation_iss = dt.Rows[i]["sub_AdditionalInfo"].ToString();
                                InvHeader.type_iss = dt.Rows[i]["sub_Type"].ToString();
                                InvHeader.id_iss = dt.Rows[i]["sub_VatNo"].ToString();
                                InvHeader.name_iss = dt.Rows[i]["sub_Name"].ToString();
                                InvHeader.country_rec = dt.Rows[i]["Cus_Country"].ToString();
                                InvHeader.governate_rec = dt.Rows[i]["Cus_governate"].ToString();
                                InvHeader.regionCity_rec = dt.Rows[i]["Cus_City"].ToString();
                                InvHeader.street_rec = dt.Rows[i]["Cus_Street"].ToString();
                                InvHeader.buildingNumber_rec = dt.Rows[i]["Cus_BuildingNo"].ToString();
                                InvHeader.postalCode_rec = dt.Rows[i]["Cus_PostalCode"].ToString();
                                InvHeader.floor_rec = dt.Rows[i]["Cus_Floor"].ToString();
                                InvHeader.room_rec = dt.Rows[i]["Cus__Room"].ToString();
                                InvHeader.landmark_rec = dt.Rows[i]["Cus_LandMarks"].ToString();
                                InvHeader.additionalInformation_rec = dt.Rows[i]["Cus_AdditionalInfo"].ToString();
                                InvHeader.id_rec = dt.Rows[i]["Cus_VatNo"].ToString();
                                InvHeader.name_rec = dt.Rows[i]["Cus_Name"].ToString();
                                InvHeader.type_rec = dt.Rows[i]["Cus_Type"].ToString();
                                InvHeader.DiscountAmount = Convert.ToDecimal(dt.Rows[i]["DiscountAmount"]);
                                InvHeader.ItemAllowTotal = Convert.ToDecimal(dt.Rows[i]["AllowAfterVat"]);
                                InvHeader.ItemDiscountTotal = Convert.ToDecimal(dt.Rows[i]["ItemDiscountTotal"]);
                                InvHeader.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["hd_NetAmount"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["hd_TaxTotal"]);
                                InvHeader.VatType = Convert.ToInt32(dt.Rows[i]["hd_TaxTotal"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["hd_TotalAmount"]);
                                InvHeader.RoundingAmount = Convert.ToDecimal(dt.Rows[i]["RoundingAmount"]);
                                InvHeader.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvHeader.TrNo = Convert.ToInt32(dt.Rows[i]["TrNo"]);
                                InvHeader.DocType = dt.Rows[i]["inv_Type"].ToString();
                                InvHeader.TrDate = Convert.ToDateTime(dt.Rows[i]["TrDate"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);

                                InvHeaderList.Add(InvHeader);
                            }
                        }
                    }
                }
            }

            return InvHeaderList.ToList();

        }

        internal static I_ControlTax GetControlTax(int Comp)
        {

            List<I_ControlTax> ControlTaxList = new List<I_ControlTax>();
            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("SELECT * FROM I_Control where CompCode ='" + Comp + "' ", con))
                {

                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {

                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {

                            try
                            {
                                sda.Fill(dt);

                            }
                            catch (Exception ex)
                            {

                                throw;
                            }

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                I_ControlTax ControlTax = new I_ControlTax();
                                ControlTax.CompCode = Convert.ToInt32(dt.Rows[i]["CompCode"]);
                                ControlTax.ClientID = dt.Rows[i]["ClientID"].ToString();
                                ControlTax.issuerId = dt.Rows[i]["issuerId"].ToString();
                                ControlTax.ClientSecret = dt.Rows[i]["ClientSecret"].ToString();
                                ControlTax.TokenPinCode = dt.Rows[i]["TokenPinCode"].ToString();
                                ControlTax.Tokentype = dt.Rows[i]["Tokentype"].ToString();
                                ControlTax.CancelinvoicePeriod = Convert.ToInt32(dt.Rows[i]["CancelinvoicePeriod"]);
                                ControlTax.RejectInvoicePeriod = Convert.ToInt32(dt.Rows[i]["RejectInvoicePeriod"]);
                                //ControlTax.LastTaxSycnDate = Convert.ToDateTime(dt.Rows[i]["LastTaxSycnDate"]);
                                ControlTax.BranchCode = Convert.ToInt32(dt.Rows[i]["BranchCode"]);
                                ControlTax.DocPDFFolder = dt.Rows[i]["DocPDFFolder"].ToString();
                                ControlTaxList.Add(ControlTax);
                            }
                        }

                    }
                }

            }
            return ControlTaxList[0];
        }

        internal static string RecentDocumentsSengel(I_ControlTax Taxcontrol)
        {
            int RejectPeriod = Taxcontrol.RejectInvoicePeriod;
            DateTime LastTaxSycnDate = Taxcontrol.LastTaxSycnDate;
            LastTaxSycnDate = LastTaxSycnDate.AddDays(-RejectPeriod);
            string DATAA;
            DATAA = LastTaxSycnDate.Year.ToString() + "-" + LastTaxSycnDate.Day + "-" + LastTaxSycnDate.Month;
            List<CustomModel.I_Sls_TR_Invoice> Sls_TR_Invoice = new List<CustomModel.I_Sls_TR_Invoice>();
            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {
                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("SELECT * FROM I_Sls_TR_Invoice where Status=2 and CompCode='" + Taxcontrol.CompCode + "' and TaxUploadDate >'" + DATAA + "' ", con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {
                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {
                            sda.Fill(dt);
                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                CustomModel.I_Sls_TR_Invoice Sls_TR_Invoice_ = new CustomModel.I_Sls_TR_Invoice();
                                Sls_TR_Invoice_.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                Sls_TR_Invoice_.DocUUID = dt.Rows[i]["DocUUID"].ToString();
                                Sls_TR_Invoice_.Status = Convert.ToInt32(dt.Rows[i]["Status"]);
                                Sls_TR_Invoice_.TrNo = Convert.ToInt32(dt.Rows[i]["TrNo"]);
                                Sls_TR_Invoice_.TaxUploadDate = Convert.ToDateTime(dt.Rows[i]["TaxUploadDate"]);
                                Sls_TR_Invoice.Add(Sls_TR_Invoice_);
                            }
                        }
                    }
                }
            }
            if (Sls_TR_Invoice.Count > 0)
            {

                foreach (var item in Sls_TR_Invoice)
                {
                    UpdateDocuments(item, Taxcontrol);
                }
            }
            return "UpdateDocuments" + Sls_TR_Invoice.Count;
        }
        internal static void UpdateDocuments(CustomModel.I_Sls_TR_Invoice I_Sls_TR_Invoice, I_ControlTax I_ControlTax)
        {
            int oldstates_ = Convert.ToInt32(I_Sls_TR_Invoice.Status);
            int stat = 0;
            string pageNo = "1";
            var client = new RestClient("" + I_Sls_TR_Invoice.DocUUID + "/details");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("PageSize", "");
            request.AddHeader("PageNo", "");
            request.AddHeader("Authorization", "Bearer " + I_ControlTax.access_token + "");
            IRestResponse response = client.Execute(request);
            ValidationResults _ValidationResults = new ValidationResults();
            _ValidationResults = JsonConvert.DeserializeObject<ValidationResults>(response.Content);
            if (_ValidationResults.status == "Submitted")
            {
                stat = 2;
            }
            else if (_ValidationResults.status == "Valid")
            {
                stat = 3;
            }
            else if (_ValidationResults.status == "Invalid")
            {
                stat = 4;
            }
            else if (_ValidationResults.status == "Rejected")
            {
                stat = 11;
            }
            else if (_ValidationResults.status == "Cancelled")
            {
                stat = 12;
            }

            if (stat != I_Sls_TR_Invoice.Status && stat != 0)
            {
                string sql = @"UPDATE [I_Sls_TR_Invoice]   SET DocUUID = @UUid ,Status = @Status WHERE DocUUID = @UUid";
                using (var con = new System.Data.SqlClient.SqlConnection(connectionString))
                {
                    con.Open();
                    //DONE: IDisposable (SqlCommand) should be wrapped into using
                    using (var cmd = new System.Data.SqlClient.SqlCommand(sql, con))
                    {
                        DateTime TaxUploadDate = DateTime.Now;
                        string DATAA = TaxUploadDate.Year.ToString() + "-" + TaxUploadDate.Day + "-" + TaxUploadDate.Month;
                        DateTime TaxSycnDate = I_Sls_TR_Invoice.TaxUploadDate;
                        DateTime CurantDate = DateTime.Now;
                        string Result_ = (CurantDate - TaxSycnDate).ToString();
                        Result_ = Result_.Substring(0, 1);
                        int RejectPeriod = I_ControlTax.RejectInvoicePeriod;
                        if (stat == 3)
                        {
                            if (stat == 3 && I_Sls_TR_Invoice.Status != 3 && Convert.ToInt32(Result_) > RejectPeriod)
                            {
                                stat = 3;
                            }
                            else
                            {
                                stat = 2;
                            }
                        }
                        //TODO: AddWithValue is often a bad choice; change to Add 
                        cmd.Parameters.AddWithValue("@UUid", I_Sls_TR_Invoice.DocUUID);
                        cmd.Parameters.AddWithValue("@Status", stat);
                        cmd.Parameters.AddWithValue("@DocUUID", I_Sls_TR_Invoice.DocUUID);


                        cmd.ExecuteNonQuery();
                        if ((stat == 12 || stat == 11 || stat == 4) && I_Sls_TR_Invoice.Status != stat)
                        {
                            string Query = "DECLARE	@return_value int,@TrNo int,@Ok int EXEC @return_value = [dbo].[G_ProcessTrans] @Comp = @CompCode, @Branch = @BranchCode,@TrType = N'SlsInvoice', @OpMode = N'Open',@TrID = @InvoiceID,@TrNo = @TrNo OUTPUT, @Ok = @Ok OUTPUT SELECT	@TrNo as N'@TrNo',@Ok as N'@Ok' SELECT	'Return Value' = @return_value";
                            using (var cmd2 = new System.Data.SqlClient.SqlCommand(Query, con))
                            {
                                cmd2.Parameters.AddWithValue("@CompCode", I_ControlTax.CompCode);
                                cmd2.Parameters.AddWithValue("@BranchCode", I_ControlTax.BranchCode);
                                cmd2.Parameters.AddWithValue("@InvoiceID", I_Sls_TR_Invoice.InvoiceID);
                                cmd2.ExecuteNonQuery();
                            }
                        }
                        string QueryTaxLoge = "INSERT INTO [dbo].[G_TaxLog]([TRNO],[OldStates],[NewStates],[Update_Date],[TypeAction] ) VALUES(@TrNo,@oldeStatus,@newstates,@UpdateDate,@TypeAction )";

                        using (var cmd2 = new System.Data.SqlClient.SqlCommand(QueryTaxLoge, con))
                        {
                            cmd2.Parameters.AddWithValue("@TrNo", I_Sls_TR_Invoice.TrNo);
                            cmd2.Parameters.AddWithValue("@oldeStatus", oldstates_);
                            cmd2.Parameters.AddWithValue("@newstates", stat);
                            cmd2.Parameters.AddWithValue("@UpdateDate", CurantDate);
                            cmd2.Parameters.AddWithValue("@TypeAction", "UPDATE States");
                            cmd2.ExecuteNonQuery();
                        }
                    }
                }

                DownloadPDF(I_Sls_TR_Invoice.DocUUID, I_ControlTax);
            }
        }



        internal static string invocetDocument(int Optype, int InvoiceID)
        {

            string UUid = "";
            try
            {
                IQ_InvoiceHedar_Tax Header = new IQ_InvoiceHedar_Tax();
                List<IQ_InvoiceHedar_Tax> Header2 = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_InvoiceHedar_Tax> Header3 = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_EGTaxInvItems> lstInvItems = new List<IQ_EGTaxInvItems>();

                Header = GetInvHeader(InvoiceID);   // get all invoices issues or to cancel 
                lstInvItems = GetInvItems(Header.InvoiceID);



                if (Header != null)
                {
                    string access_token = ETax.CreateTokin(Header.ClientID, Header.ClientSecret);

                    DateTime TaxUploadDate = DateTime.Now;
                    string DATAA = TaxUploadDate.Year.ToString() + "-" + TaxUploadDate.Day + "-" + TaxUploadDate.Month;
                    UUid = SendDocuments(Header, lstInvItems, access_token);

                    if (UUid != "" || UUid != null)
                    {
                        //System.Data.Common and System.Data.SqlClient.


                        string sql = @"UPDATE [I_Sls_TR_Invoice]   SET DocUUID = @UUid ,Status = @Status,TaxUploadDate = @TaxUploadDate WHERE InvoiceID = @InvoiceID";
                        using (var con = new SqlConnection(connectionString))
                        {
                            con.Open();
                            //DONE: IDisposable (SqlCommand) should be wrapped into using
                            using (var cmd = new SqlCommand(sql, con))
                            {
                                //TODO: AddWithValue is often a bad choice; change to Add 
                                cmd.Parameters.AddWithValue("@UUid", UUid);
                                cmd.Parameters.AddWithValue("@Status", 2);
                                cmd.Parameters.AddWithValue("@TaxUploadDate", DATAA);
                                cmd.Parameters.AddWithValue("@InvoiceID", Header.InvoiceID);
                                cmd.ExecuteNonQuery();
                            }

                            string QueryTaxLoge = "INSERT INTO [dbo].[G_TaxLog]([TRNO],[OldStates],[NewStates],[Update_Date],[TypeAction] ) VALUES(@TrNo,@oldeStatus,@newstates,@UpdateDate,@TypeAction)";

                            using (var cmd2 = new SqlCommand(QueryTaxLoge, con))
                            {
                                cmd2.Parameters.AddWithValue("@TrNo", Header.TrNo);
                                cmd2.Parameters.AddWithValue("@oldeStatus", Header.Status);
                                cmd2.Parameters.AddWithValue("@newstates", 2);
                                cmd2.Parameters.AddWithValue("@UpdateDate", DATAA);
                                cmd2.Parameters.AddWithValue("@TypeAction", "Upload");
                                cmd2.ExecuteNonQuery();
                            }
                        }

                        DownloadPDF(UUid, Header.DocPDFFolder, access_token);

                    }
                    else
                    {

                    }

                }


                return UUid;
            }
            catch (Exception EX)
            {
                EX.InnerException.ToString();
                EX.Message.ToString();
                return EX.Message.ToString();
            }
        }

        internal static IQ_InvoiceHedar_Tax GetInvHeader(int ID)
        {
            IQ_InvoiceHedar_Tax InvHeaderList = new IQ_InvoiceHedar_Tax();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                string condetion = " select * from [IQ_InvoiceHedar_Tax] Where InvoiceID=" + ID + " and  status <> 3 and status = 1 or status = 10 ";


                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(condetion, con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {
                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {


                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                IQ_InvoiceHedar_Tax InvHeader = new IQ_InvoiceHedar_Tax();
                                InvHeader.branchID_iss = Convert.ToInt32(dt.Rows[i]["sub_Bra_code"]);
                                InvHeader.name_iss = dt.Rows[i]["sub_Bra_Name"].ToString();
                                InvHeader.country_iss = dt.Rows[i]["Sub_Country"].ToString();
                                InvHeader.governate_iss = dt.Rows[i]["sub_governate"].ToString();
                                InvHeader.regionCity_iss = dt.Rows[i]["Sub_City"].ToString();
                                InvHeader.street_iss = dt.Rows[i]["Sub_Street"].ToString();
                                InvHeader.buildingNumber_iss = dt.Rows[i]["sub_BuildingNo"].ToString();
                                InvHeader.postalCode_iss = dt.Rows[i]["sub_PostalCode"].ToString();
                                InvHeader.floor_iss = dt.Rows[i]["sub_Floor"].ToString();
                                InvHeader.room_iss = dt.Rows[i]["sub__Room"].ToString();
                                InvHeader.landmark_iss = dt.Rows[i]["sub_LandMarks"].ToString();
                                InvHeader.additionalInformation_iss = dt.Rows[i]["sub_AdditionalInfo"].ToString();
                                InvHeader.type_iss = dt.Rows[i]["sub_Type"].ToString();
                                InvHeader.id_iss = dt.Rows[i]["sub_VatNo"].ToString();
                                InvHeader.name_iss = dt.Rows[i]["sub_Name"].ToString();
                                InvHeader.country_rec = dt.Rows[i]["Cus_Country"].ToString();
                                InvHeader.governate_rec = dt.Rows[i]["Cus_governate"].ToString();
                                InvHeader.regionCity_rec = dt.Rows[i]["Cus_City"].ToString();
                                InvHeader.street_rec = dt.Rows[i]["Cus_Street"].ToString();
                                InvHeader.buildingNumber_rec = dt.Rows[i]["Cus_BuildingNo"].ToString();
                                InvHeader.postalCode_rec = dt.Rows[i]["Cus_PostalCode"].ToString();
                                InvHeader.floor_rec = dt.Rows[i]["Cus_Floor"].ToString();
                                InvHeader.room_rec = dt.Rows[i]["Cus__Room"].ToString();
                                InvHeader.landmark_rec = dt.Rows[i]["Cus_LandMarks"].ToString();
                                InvHeader.additionalInformation_rec = dt.Rows[i]["Cus_AdditionalInfo"].ToString();
                                InvHeader.id_rec = dt.Rows[i]["Cus_VatNo"].ToString();
                                InvHeader.name_rec = dt.Rows[i]["Cus_Name"].ToString();
                                InvHeader.type_rec = dt.Rows[i]["Cus_Type"].ToString();
                                InvHeader.DiscountAmount = Convert.ToDecimal(dt.Rows[i]["DiscountAmount"]);
                                InvHeader.ItemAllowTotal = Convert.ToDecimal(dt.Rows[i]["AllowAfterVat"]);
                                InvHeader.ItemDiscountTotal = Convert.ToDecimal(dt.Rows[i]["ItemDiscountTotal"]);
                                InvHeader.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["hd_NetAmount"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["hd_TaxTotal"]);
                                InvHeader.VatType = Convert.ToInt32(dt.Rows[i]["hd_TaxTotal"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["hd_TotalAmount"]);
                                InvHeader.RoundingAmount = Convert.ToDecimal(dt.Rows[i]["RoundingAmount"]);
                                InvHeader.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvHeader.TrNo = Convert.ToInt32(dt.Rows[i]["TrNo"]);
                                InvHeader.DocType = dt.Rows[i]["inv_Type"].ToString();
                                InvHeader.TrDate = Convert.ToDateTime(dt.Rows[i]["TrDate"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);

                            }
                        }
                    }
                }
            }

            return InvHeaderList;

        }
        internal static List<IQ_EGTaxInvItems> GetInvItems(int ID)
        {
            List<IQ_EGTaxInvItems> InvItemsList = new List<IQ_EGTaxInvItems>();
            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("SELECT * FROM IQ_EGTaxInvItems where InvoiceID=" + ID + "", con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {

                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {
                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                IQ_EGTaxInvItems InvItems = new IQ_EGTaxInvItems();
                                InvItems.CurrencyCode = dt.Rows[i]["CurrencyCode"].ToString();
                                InvItems.DescA = dt.Rows[i]["DescA"].ToString();
                                InvItems.diff = Convert.ToDecimal(dt.Rows[i]["diff"]);
                                InvItems.Discount = Convert.ToDecimal(dt.Rows[i]["Discount"]);
                                InvItems.DiscountPrc = Convert.ToDecimal(dt.Rows[i]["DiscountPrc"]);
                                InvItems.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvItems.InvoiceItemID = Convert.ToInt32(dt.Rows[i]["InvoiceItemID"]);
                                InvItems.ItemCode = dt.Rows[i]["ItemCode"].ToString();
                                InvItems.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvItems.NetTotal = Convert.ToDecimal(dt.Rows[i]["NetTotal"]);
                                InvItems.OldItemCode = dt.Rows[i]["OldItemCode"].ToString();
                                InvItems.RefItemCode = dt.Rows[i]["RefItemCode"].ToString();
                                InvItems.SalesTotal = Convert.ToDecimal(dt.Rows[i]["SalesTotal"]);
                                InvItems.Serial = Convert.ToInt32(dt.Rows[i]["Serial"]);
                                InvItems.SoldQty = Convert.ToDecimal(dt.Rows[i]["SoldQty"]);
                                InvItems.TaxableFees = Convert.ToDecimal(dt.Rows[i]["TaxableFees"]);
                                InvItems.TaxSubType = dt.Rows[i]["TaxSubType"].ToString();
                                InvItems.TaxType = dt.Rows[i]["TaxType"].ToString();
                                InvItems.Total = Convert.ToDecimal(dt.Rows[i]["Total"]);
                                InvItems.Unitprice = Convert.ToDecimal(dt.Rows[i]["Unitprice"]);
                                InvItems.UomCode = dt.Rows[i]["UomCode"].ToString();
                                InvItems.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);
                                InvItems.VatPrc = Convert.ToDecimal(dt.Rows[i]["VatPrc"]);
                                InvItemsList.Add(InvItems);
                            }
                        }

                    }
                }

            }
            return InvItemsList.ToList();
        }

        private static string SendDocuments(IQ_InvoiceHedar_Tax Header, List<IQ_EGTaxInvItems> lstInvItems, string access_token)
        {

            string uuid = "";
            try
            {
                List<CustomModel.IQ_EGTaxInvHeader> Header2 = new List<CustomModel.IQ_EGTaxInvHeader>();

                List<TaxTotal> lstTaxTotal = new List<TaxTotal>();
                List<TaxableItem> LstTaxableItem = new List<TaxableItem>();
                List<InvoiceLine> lstInvoiceLine = new List<InvoiceLine>();
                List<Signature> lstSignature = new List<Signature>();

                double? itemTotalTax = 0;
                string itemTaxType = "";
                foreach (var item in lstInvItems)
                {
                    //cust TaxableItem to TblTaxableItem
                    List<TaxableItem> txLst = new List<TaxableItem>();

                    TaxableItem obj = new TaxableItem();
                    obj.amount = Convert.ToDouble(item.VatAmount);
                    obj.taxType = item.TaxType;
                    obj.subType = item.TaxSubType;
                    obj.rate = Convert.ToDouble(item.VatPrc);
                    txLst.Add(obj);

                    //cust invoiceLines to InvoiceLineTblInvoiceLine
                    lstInvoiceLine.Add(new InvoiceLine
                    {
                        description = item.DescA,
                        itemType = item.RefItemCode,
                        itemCode = item.OldItemCode,
                        unitType = item.UomCode,
                        quantity = Convert.ToDouble(item.SoldQty),
                        internalCode = item.ItemCode.ToString(),
                        salesTotal = Convert.ToDouble(item.SalesTotal),
                        total = Convert.ToDouble(item.VatAmount + item.NetTotal),
                        valueDifference = Convert.ToDouble(item.TaxableFees),
                        totalTaxableFees = Convert.ToDouble(item.TaxableFees),
                        netTotal = Convert.ToDouble(item.NetTotal),
                        itemsDiscount = Convert.ToDouble(item.Discount),
                        discount = new Discount { amount = Convert.ToDouble(item.Discount), rate = Convert.ToDouble(item.DiscountPrc) },
                        unitValue = new UnitValue { amountEGP = Convert.ToDouble(item.Unitprice), currencySold = item.CurrencyCode },
                        taxableItems = txLst

                    });
                    itemTotalTax += Convert.ToDouble(item.VatAmount);
                    itemTaxType = item.TaxType;
                }

                lstTaxTotal.Add(new TaxTotal
                {
                    amount = Convert.ToDouble(Header.VatAmount),
                    taxType = itemTaxType
                });
                DateTime _getDate = string.IsNullOrWhiteSpace(Header.TrDate.ToString()) ? DateTime.Now : DateTime.Parse(Header.TrDate.ToString()).AddHours(+2);
                string _date = _getDate.ToUniversalTime().ToString("yyyy-MM-dd'T'HH:mm:ss'Z'");
                Header.name_iss = SecuritySystem.Decrypt(Header.name_iss);
                string Receiver_ID;
                if (Header.type_rec == "P" && Header.id_rec == "" || Header.id_rec == null)
                {
                    Receiver_ID = "";// Header.cus_IDNo;
                }
                else
                {
                    Receiver_ID = Header.id_rec;
                }
                var Root = new Root
                {
                    documents = new List<Document>
                {
                    new Document
                    {
                    issuer = new Issuer
                    {
                        address = new Address
                        {
                            branchID = Header.branchID_iss.ToString(),
                            country =Header.country_iss,
                            governate = Header.governate_iss,
                            regionCity = Header.regionCity_iss,
                            street =  Header.street_iss,
                            buildingNumber =  Header.buildingNumber_iss,
                            postalCode =  Header.postalCode_iss,
                            floor =  Header.floor_iss,
                            room =  Header.room_iss,
                            landmark =  Header.landmark_iss,
                            additionalInformation =  Header.additionalInformation_iss
                        },
                        type = Header.type_iss,
                        id = Header.id_iss,
                        name = Header.name_iss
                    },
                    receiver = new Receiver
                    {
                        address = new Address
                        {
                            branchID = "0",
                            country = Header.country_rec,
                            governate = Header.governate_iss,
                            regionCity =  Header.regionCity_rec,
                            street =  Header.street_rec,
                            buildingNumber = Header.buildingNumber_rec,
                            postalCode = Header.postalCode_rec,
                            floor = Header.floor_rec,
                            room = Header.room_rec,
                            landmark = Header.landmark_rec,
                            additionalInformation = Header.additionalInformation_rec,
                        },
                        type = Header.type_rec,
                        id = Receiver_ID,
                        name = Header.name_rec,
                    },
                    documentType =Header.DocType ,
                    documentTypeVersion = Header.TypeVersion,// _DocumentTypeVersion,
                    dateTimeIssued = _date,
                    taxpayerActivityCode = Header.ActivityCode,
                    internalID = Header.TrNo.ToString(),

                    payment = new Payment
                    {
                    },
                    delivery = new Delivery
                    {
                    },
                    invoiceLines = lstInvoiceLine,
                    totalDiscountAmount = Convert.ToDouble(Header.ItemDiscountTotal),
                    totalSalesAmount =Convert.ToDouble( Header.NetAfterVat),
                    netAmount =Convert.ToDouble(Header.ItemTotal),
                    taxTotals = lstTaxTotal,
                    totalAmount =Convert.ToDouble(Header.TotalAmount),
                    extraDiscountAmount =  Convert.ToDouble( Header.DiscountAmount),
                    totalItemsDiscountAmount =Convert.ToDouble( Header.ItemDiscountTotal),
                    signatures = new List<Signature>(),
                }
                }
                };

                string replacejson = JsonConvert.SerializeObject(Root);
                replacejson = replacejson.Replace(",\"signatures\":[]", "");
                JObject request = JsonConvert.DeserializeObject<JObject>(replacejson);

                var SerializeJson = Ex.Serialize(request);
                SerializeJson = SerializeJson.Remove(0, 22);

                byte[] byteData = Encoding.UTF8.GetBytes(SerializeJson);

                string SignToken = SignFromToken.SignWithCMS(byteData, Header.TokenPinCode);

                lstSignature.Add(new Signature
                {
                    signatureType = Header.Tokentype,
                    value = SignToken
                });
                Root.documents[0].signatures = lstSignature;



                Root RootObj = new Root();
                RootObj = Root;
                RestClient client = new RestClient();
                client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1/documentsubmissions");
                var requestApi = new RestRequest();
                string json = JsonConvert.SerializeObject(RootObj);
                Newtonsoft.Json.Linq.JObject request2 = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
                string body = JsonConvert.SerializeObject(RootObj);
                requestApi.Method = Method.POST;
                requestApi.Timeout = -1;
                requestApi.AddHeader("Content-Type", "application/json");
                requestApi.AddHeader("Authorization", "Bearer " + access_token + "");

                requestApi.AddParameter("application/json", body, ParameterType.RequestBody);
                IRestResponse response = client.Execute(requestApi);
                Rootcontent Rootcontent = new Rootcontent();

                if (response.IsSuccessful != false)
                {
                    Rootcontent = JsonConvert.DeserializeObject<Rootcontent>(response.Content);
                    uuid = Rootcontent.acceptedDocuments[0].uuid;


                }
                else
                {
                    uuid = response.Content.ToString();
                }

                return uuid;
            }
            catch (Exception ex)
            {

                return ""; //ex.Message.ToString();
            }
        }

        internal static void DownloadPDF(string UUID, string PDFFolder, string access_token)
        {
            RestClient client = new RestClient();
            client = new RestClient("https://api.invoicing.eta.gov.eg/api/v1/documents/" + UUID + "/pdf?=");
            client.Timeout = -1;
            var request = new RestRequest(Method.GET);
            request.AddHeader("Authorization", "Bearer " + access_token + "");
            IRestResponse response = client.Execute(request);
            var content_ = response.Content;
            byte[] renderdByte = response.RawBytes;
            try
            {
                System.IO.File.WriteAllBytes(PDFFolder + @"\" + UUID + "" + ".pdf", renderdByte);
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }

        internal static string Pushinvoce(int InvoiceID, I_ControlTax I_ControlTax)
        {

            string UUid = "";
            try
            {
                List<IQ_InvoiceHedar_Tax> Header = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_InvoiceHedar_Tax> Header2 = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_InvoiceHedar_Tax> Header3 = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_Sls_InvoiceDetail_Tax> lstInvItems = new List<IQ_Sls_InvoiceDetail_Tax>();
                List<taxableItems> taxableItems_ = new List<taxableItems>();

                Header = GetInvoiceHeader(InvoiceID);   // get all invoices issues or to cancel 
                lstInvItems = GetInvoiceItems(InvoiceID);
                for (int i = 0; i < lstInvItems.Count; i++)
                {
                    List<taxableItems> taxableItems_new = new List<taxableItems>();

                    taxableItems_new = GetTaxableItem(lstInvItems[i].InvoiceItemID);

                    for (int x = 0; x < taxableItems_new.Count; x++)
                    {
                        taxableItems_.Add(taxableItems_new[x]);

                    }

                }

                   

                if (Header.Count > 0)
                {

                    foreach (var item in Header)
                    {
                        DateTime TaxUploadDate = DateTime.Now;
                        string DATAA = TaxUploadDate.Year.ToString() + "-" + TaxUploadDate.Day + "-" + TaxUploadDate.Month;
                        IQ_InvoiceHedar_Tax HeaderSend = new IQ_InvoiceHedar_Tax();
                        HeaderSend = item;
                        List<IQ_Sls_InvoiceDetail_Tax> lstInvItemsSend = new List<IQ_Sls_InvoiceDetail_Tax>();
                        lstInvItemsSend = lstInvItems.Where(xx => xx.InvoiceID == HeaderSend.InvoiceID).ToList();
                        UUid = GetDocumentsSend(HeaderSend, lstInvItemsSend, taxableItems_, I_ControlTax);

                        if (UUid != "" || UUid != null)
                        {
                            //System.Data.Common and System.Data.SqlClient.


                            string sql = @"UPDATE [I_Sls_TR_Invoice]   SET DocUUID = @UUid ,Status = @Status,TaxUploadDate = @TaxUploadDate WHERE InvoiceID = @InvoiceID";
                            using (var con = new System.Data.SqlClient.SqlConnection(connectionString))
                            {
                                con.Open();
                                //DONE: IDisposable (SqlCommand) should be wrapped into using
                                using (var cmd = new System.Data.SqlClient.SqlCommand(sql, con))
                                {
                                    //TODO: AddWithValue is often a bad choice; change to Add 
                                    cmd.Parameters.AddWithValue("@UUid", UUid);
                                    cmd.Parameters.AddWithValue("@Status", 2);
                                    cmd.Parameters.AddWithValue("@TaxUploadDate", DATAA);
                                    cmd.Parameters.AddWithValue("@InvoiceID", HeaderSend.InvoiceID);
                                    cmd.ExecuteNonQuery();
                                }

                                string QueryTaxLoge = "INSERT INTO [dbo].[G_TaxLog]([TRNO],[OldStates],[NewStates],[Update_Date],[TypeAction] ) VALUES(@TrNo,@oldeStatus,@newstates,@UpdateDate,@TypeAction)";

                                using (var cmd2 = new System.Data.SqlClient.SqlCommand(QueryTaxLoge, con))
                                {
                                    cmd2.Parameters.AddWithValue("@TrNo", HeaderSend.TrNo);
                                    cmd2.Parameters.AddWithValue("@oldeStatus", HeaderSend.Status);
                                    cmd2.Parameters.AddWithValue("@newstates", 2);
                                    cmd2.Parameters.AddWithValue("@UpdateDate", DATAA);
                                    cmd2.Parameters.AddWithValue("@TypeAction", "Upload");
                                    cmd2.ExecuteNonQuery();
                                }
                            }

                            DownloadPDF(UUid, I_ControlTax);

                        }
                        else
                        {

                        }

                    }
                }


                return Header.Count.ToString();
            }
            catch (Exception EX)
            {
                EX.InnerException.ToString();
                EX.Message.ToString();
                return EX.Message.ToString();
            }
        }
        private static string GetDocumentsSend(IQ_InvoiceHedar_Tax Header, List<IQ_Sls_InvoiceDetail_Tax> lstInvItems, List<taxableItems> taxableItems, I_ControlTax I_ControlTax)
        {

            string uuid = "";
            try
            {
                List<CustomModel.IQ_EGTaxInvHeader> Header2 = new List<CustomModel.IQ_EGTaxInvHeader>();

                List<TaxTotal> lstTaxTotal = new List<TaxTotal>();
                List<TaxableItem> LstTaxableItem = new List<TaxableItem>();
                List<InvoiceLine> lstInvoiceLine = new List<InvoiceLine>();
                List<Signature> lstSignature = new List<Signature>();

                double? itemTotalTax = 0;
                string itemTaxType = "";
                foreach (var item in lstInvItems)
                {
                    //cust TaxableItem to TblTaxableItem
                    List<TaxableItem> txLst = new List<TaxableItem>();

                    for (int i = 0; i < taxableItems.Count; i++)
                    {
                        TaxableItem txLst2 = new TaxableItem();
                        txLst2.taxType = taxableItems[i].taxType;
                        txLst2.subType = taxableItems[i].subType;
                        txLst2.amount = taxableItems[i].amount;
                        txLst2.rate = taxableItems[i].rate;
                        txLst.Add(txLst2);

                        lstTaxTotal.Add(new TaxTotal
                        {
                            amount = Convert.ToDouble(taxableItems[i].amount),
                            taxType = taxableItems[i].taxType
                        });
                    }

                    //cust invoiceLines to InvoiceLineTblInvoiceLine
                    lstInvoiceLine.Add(new InvoiceLine
                    {
                        description = item.description,
                        itemType = item.codeType,
                        itemCode = item.itemCode,
                        unitType = item.UomCode,
                        quantity = Convert.ToDouble(item.SoldQty),
                        internalCode = item.itemCode.ToString(),
                        salesTotal = Convert.ToDouble(item.Unitprice * item.SoldQty),
                        total = Convert.ToDouble(item.NetAfterVat),
                        valueDifference = Convert.ToDouble(0),
                        totalTaxableFees = Convert.ToDouble(0),
                        netTotal = Convert.ToDouble(item.ItemTotal),
                        itemsDiscount = Convert.ToDouble(0),
                        discount = new Discount { amount = Convert.ToDouble(item.DiscountAmount), rate = Convert.ToDouble(0) },
                        unitValue = new UnitValue { amountEGP = Convert.ToDouble(item.Unitprice), currencySold ="EGP" },
                        taxableItems = txLst

                    }); ;

                }


                DateTime _getDate = string.IsNullOrWhiteSpace(Header.TrDate.ToString()) ? DateTime.Now : DateTime.Parse(Header.TrDate.ToString()).AddHours(+2);
                string _date = _getDate.ToUniversalTime().ToString("yyyy-MM-dd'T'HH:mm:ss'Z'");
                Header.name_iss =  Header.name_iss ;
                string Receiver_ID;
                if (Header.type_rec == "P" && Header.id_rec == "" || Header.id_rec == null)
                {
                    Receiver_ID = "";// Header.cus_IDNo;
                }
                else
                {
                    Receiver_ID = Header.id_rec;
                }
                var Root = new Root
                {
                    documents = new List<Document>
                {
                    new Document
                    {
                    issuer = new Issuer
                    {
                        address = new Address
                        {
                            branchID = Header.branchID_iss.ToString(),
                            country =Header.country_iss,
                            governate = Header.governate_iss,
                            regionCity = Header.regionCity_iss,
                            street =  Header.street_iss,
                            buildingNumber =  Header.buildingNumber_iss,
                            postalCode =  Header.postalCode_iss,
                            floor =  Header.floor_iss,
                            room =  Header.room_iss,
                            landmark =  Header.landmark_iss,
                            additionalInformation =  Header.additionalInformation_iss
                        },
                        type = Header.type_iss,
                        id = Header.id_iss,
                        name = Header.name_iss
                    },
                    receiver = new Receiver
                    {
                        address = new Address
                        {
                            branchID =Header.branchID_rec.ToString(),// "0",
                            country = Header.country_rec,
                            governate = Header.governate_iss,
                            regionCity =  Header.regionCity_rec,
                            street =  Header.street_rec,
                            buildingNumber = Header.buildingNumber_rec,
                            postalCode = Header.postalCode_rec,
                            floor = Header.floor_rec,
                            room = Header.room_rec,
                            landmark = Header.landmark_rec,
                            additionalInformation = Header.additionalInformation_rec,
                        },
                        type = Header.type_rec,
                        id = Receiver_ID,
                        name = Header.name_rec,
                    },
                    documentType =Header.DocType ,
                    documentTypeVersion = Header.TypeVersion,// _DocumentTypeVersion,
                    dateTimeIssued = _date,
                    taxpayerActivityCode ="6201",// ""Header.ActivityCode,
                    internalID = Header.TrNo.ToString(),

                    payment = new Payment
                    {
                    },
                    delivery = new Delivery
                    {
                    },
                    invoiceLines = lstInvoiceLine,
                    totalDiscountAmount = Convert.ToDouble(Header.ItemDiscountTotal),
                    totalSalesAmount =Convert.ToDouble( Header.TotalAmount),
                    netAmount =Convert.ToDouble(Header.ItemTotal),
                    taxTotals = lstTaxTotal,
                    totalAmount =Convert.ToDouble(Header.TotalAmount),
                    extraDiscountAmount =  Convert.ToDouble( Header.DiscountAmount),
                    totalItemsDiscountAmount =Convert.ToDouble( Header.ItemDiscountTotal),
                    signatures = new List<Signature>(),
                }
                }
                };

                string replacejson = JsonConvert.SerializeObject(Root);
                replacejson = replacejson.Replace(",\"signatures\":[]", "");
                JObject request = JsonConvert.DeserializeObject<JObject>(replacejson);

                var SerializeJson = Ex.Serialize(request);
                SerializeJson = SerializeJson.Remove(0, 22);

                byte[] byteData = Encoding.UTF8.GetBytes(SerializeJson);

                string SignToken = SignFromToken.SignWithCMS(byteData, I_ControlTax.TokenPinCode);

                lstSignature.Add(new Signature
                {
                    signatureType = "I",
                    value = SignToken
                });
                Root.documents[0].signatures = lstSignature;

                Root RootObj = new Root();
                RootObj = Root;
                RestClient client = new RestClient();
                client = new RestClient("https://api.preprod.invoicing.eta.gov.eg/api/v1/documentsubmissions");
                client.Timeout = -1;
                var requestApi = new RestRequest();
                string json = JsonConvert.SerializeObject(RootObj);
                Newtonsoft.Json.Linq.JObject request2 = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
                string body = JsonConvert.SerializeObject(RootObj);
                requestApi.Method = Method.POST;
                requestApi.Timeout = -1;
                requestApi.AddHeader("Content-Type", "application/json");
                requestApi.AddHeader("Authorization", "Bearer " + I_ControlTax.access_token + "");

                requestApi.AddParameter("application/json", body, ParameterType.RequestBody);
                IRestResponse response = client.Execute(requestApi);
                Rootcontent Rootcontent = new Rootcontent();

                if (response.IsSuccessful != false)
                {
                    Rootcontent = JsonConvert.DeserializeObject<Rootcontent>(response.Content);
                    uuid = Rootcontent.acceptedDocuments[0].uuid;


                }
                else
                {
                    uuid = response.Content.ToString();
                }

                return uuid;
            }
            catch (Exception ex)
            {

                return ""; //ex.Message.ToString();
            }
        }


        internal static List<IQ_Sls_InvoiceDetail_Tax> GetInvoiceItems(int InvoiceID)
        {
            List<IQ_Sls_InvoiceDetail_Tax> InvItemsList = new List<IQ_Sls_InvoiceDetail_Tax>();
            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("SELECT * FROM IQ_Sls_InvoiceDetail_Tax where  InvoiceID =" + InvoiceID + "", con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {

                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {
                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                IQ_Sls_InvoiceDetail_Tax InvItems = new IQ_Sls_InvoiceDetail_Tax();

                                InvItems.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvItems.InvoiceItemID = Convert.ToInt32(dt.Rows[i]["InvoiceItemID"]);
                                InvItems.ItemID = Convert.ToInt32(dt.Rows[i]["ItemID"]);
                                InvItems.UomID = Convert.ToInt32(dt.Rows[i]["UomID"]);
                                InvItems.InvoiceSoldQty = Convert.ToInt32(dt.Rows[i]["InvoiceSoldQty"]);
                                InvItems.SoldQty = Convert.ToInt32(dt.Rows[i]["SoldQty"]);
                                InvItems.Unitprice = Convert.ToInt32(dt.Rows[i]["Unitprice"]);
                                InvItems.DiscountPrc = Convert.ToInt32(dt.Rows[i]["DiscountPrc"]);
                                InvItems.DiscountAmount = Convert.ToInt32(dt.Rows[i]["DiscountAmount"]);
                                InvItems.NetUnitPrice = Convert.ToInt32(dt.Rows[i]["NetUnitPrice"]);
                                InvItems.ItemTotal = Convert.ToInt32(dt.Rows[i]["ItemTotal"]);
                                InvItems.VatPrc = Convert.ToInt32(dt.Rows[i]["VatPrc"]);
                                InvItems.VatAmount = Convert.ToInt32(dt.Rows[i]["VatAmount"]);
                                InvItems.NetAfterVat = Convert.ToInt32(dt.Rows[i]["NetAfterVat"]);
                                InvItems.StockSoldQty = Convert.ToInt32(dt.Rows[i]["StockSoldQty"]);
                                InvItems.StockUnitCost = Convert.ToInt32(dt.Rows[i]["StockUnitCost"]);
                                InvItems.VatApplied = Convert.ToInt32(dt.Rows[i]["VatApplied"]);
                                InvItems.TotRetQty = Convert.ToInt32(dt.Rows[i]["TotRetQty"]);
                                 InvItems.AllowAmount = Convert.ToInt32(dt.Rows[i]["AllowAmount"]);
                                InvItems.AllowancePrc = Convert.ToInt32(dt.Rows[i]["AllowancePrc"]);
                                InvItems.AllowanceBase = Convert.ToInt32(dt.Rows[i]["AllowanceBase"]);
                                InvItems.AllowReason = dt.Rows[i]["AllowReason"].ToString();
                                InvItems.AllowCode = Convert.ToInt32(dt.Rows[i]["AllowCode"]);
                                InvItems.BaseQty = Convert.ToInt32(dt.Rows[i]["BaseQty"]);
                                InvItems.BaseQtyUomid = Convert.ToInt32(dt.Rows[i]["BaseQtyUomid"]);
                                InvItems.BaseQtyPrice = Convert.ToInt32(dt.Rows[i]["BaseQtyPrice"]);
                                InvItems.BaseQtyDiscount = Convert.ToInt32(dt.Rows[i]["BaseQtyDiscount"]);
                                InvItems.DiscountPrcBase = Convert.ToInt32(dt.Rows[i]["DiscountPrcBase"]);
                                InvItems.DiscountVatNatID = Convert.ToInt32(dt.Rows[i]["DiscountVatNatID"]);
                                InvItems.Discountreason = dt.Rows[i]["Discountreason"].ToString();
                                InvItems.DiscountCode = Convert.ToInt32(dt.Rows[i]["DiscountCode"]);
                                InvItems.ItemNetAmount = Convert.ToInt32(dt.Rows[i]["ItemNetAmount"]);
                                InvItems.ChargeAmount = Convert.ToInt32(dt.Rows[i]["ChargeAmount"]);
                                InvItems.ChargePrc = Convert.ToInt32(dt.Rows[i]["ChargePrc"]);
                                InvItems.ChargeBase = Convert.ToInt32(dt.Rows[i]["ChargeBase"]); 
                                InvItems.ChargeVatPrc = Convert.ToInt32(dt.Rows[i]["ChargeVatPrc"]);
                                InvItems.ChargeAfterVat = Convert.ToInt32(dt.Rows[i]["ChargeAfterVat"]);
                                InvItems.ChargeReason = dt.Rows[i]["ChargeReason"].ToString();
                                InvItems.ChargeCode = Convert.ToInt32(dt.Rows[i]["ChargeCode"]);
                                InvItems.VatNatID = Convert.ToInt32(dt.Rows[i]["VatNatID"]);
                                InvItems.UnitpriceWithVat = Convert.ToInt32(dt.Rows[i]["UnitpriceWithVat"]);
                                InvItems.NetUnitPriceWithVat = Convert.ToInt32(dt.Rows[i]["NetUnitPriceWithVat"]);
                                InvItems.Itemdesc = dt.Rows[i]["Itemdesc"].ToString();
                                InvItems.itemCode = dt.Rows[i]["itemCode"].ToString();
                                InvItems.description = dt.Rows[i]["description"].ToString();
                                InvItems.UnitCode = dt.Rows[i]["UnitCode"].ToString();
                                InvItems.codeNameAr = dt.Rows[i]["codeNameAr"].ToString();
                                InvItems.codeName = dt.Rows[i]["codeName"].ToString();
                                InvItems.codeType = dt.Rows[i]["codeType"].ToString();
                                InvItems.UomCode = dt.Rows[i]["UomCode"].ToString();

                                InvItemsList.Add(InvItems);
                            }
                        }

                    }
                }

            }
            return InvItemsList.ToList();
        }

        internal static List<IQ_InvoiceHedar_Tax> GetInvoiceHeader(int InvoiceID)
        {
            List<IQ_InvoiceHedar_Tax> InvHeaderList = new List<IQ_InvoiceHedar_Tax>();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                string condetion = " select * from [IQ_InvoiceHedar_Tax] Where InvoiceID =" + InvoiceID + "";


                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(condetion, con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {
                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {


                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                IQ_InvoiceHedar_Tax InvHeader = new IQ_InvoiceHedar_Tax();
                                InvHeader.branchID_iss = Convert.ToInt32(dt.Rows[i]["branchID_iss"]);
                                InvHeader.name_iss = dt.Rows[i]["name_iss"].ToString();
                                InvHeader.country_iss = dt.Rows[i]["country_iss"].ToString();
                                InvHeader.governate_iss = dt.Rows[i]["governate_iss"].ToString();
                                InvHeader.regionCity_iss = dt.Rows[i]["regionCity_iss"].ToString();
                                InvHeader.street_iss = dt.Rows[i]["street_iss"].ToString();
                                InvHeader.buildingNumber_iss = dt.Rows[i]["buildingNumber_iss"].ToString();
                                InvHeader.postalCode_iss = dt.Rows[i]["postalCode_iss"].ToString();
                                InvHeader.floor_iss = dt.Rows[i]["floor_iss"].ToString();
                                InvHeader.room_iss = dt.Rows[i]["room_iss"].ToString();
                                InvHeader.landmark_iss = dt.Rows[i]["landmark_iss"].ToString();
                                InvHeader.additionalInformation_iss = dt.Rows[i]["additionalInformation_iss"].ToString();
                                InvHeader.type_iss = dt.Rows[i]["type_iss"].ToString();
                                InvHeader.id_iss = dt.Rows[i]["id_iss"].ToString();
                                InvHeader.name_iss = dt.Rows[i]["name_iss"].ToString();
                                InvHeader.country_rec = dt.Rows[i]["country_rec"].ToString();
                                InvHeader.governate_rec = dt.Rows[i]["governate_rec"].ToString();
                                InvHeader.regionCity_rec = dt.Rows[i]["regionCity_rec"].ToString();
                                InvHeader.street_rec = dt.Rows[i]["street_rec"].ToString();
                                InvHeader.buildingNumber_rec = dt.Rows[i]["buildingNumber_rec"].ToString();
                                InvHeader.postalCode_rec = dt.Rows[i]["postalCode_rec"].ToString();
                                InvHeader.floor_rec = dt.Rows[i]["floor_rec"].ToString();
                                InvHeader.room_rec = dt.Rows[i]["room_rec"].ToString();
                                InvHeader.landmark_rec = dt.Rows[i]["landmark_rec"].ToString();
                                InvHeader.additionalInformation_rec = dt.Rows[i]["additionalInformation_rec"].ToString();
                                InvHeader.id_rec = dt.Rows[i]["id_rec"].ToString();
                                InvHeader.name_rec = dt.Rows[i]["name_rec"].ToString();
                                InvHeader.type_rec = dt.Rows[i]["type_rec"].ToString();
                                InvHeader.DiscountAmount = Convert.ToDecimal(dt.Rows[i]["DiscountAmount"]);
                                InvHeader.ItemAllowTotal = Convert.ToDecimal(dt.Rows[i]["ItemAllowTotal"]);
                                InvHeader.ItemDiscountTotal = Convert.ToDecimal(dt.Rows[i]["ItemDiscountTotal"]);
                                InvHeader.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["TotalAmount"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);
                                InvHeader.VatType = Convert.ToInt32(dt.Rows[i]["VatType"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["TotalAmount"]);
                                InvHeader.RoundingAmount = Convert.ToDecimal(dt.Rows[i]["RoundingAmount"]);
                                InvHeader.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvHeader.TrNo = Convert.ToInt32(dt.Rows[i]["TrNo"]);
                                InvHeader.DocType = dt.Rows[i]["DocType"].ToString();
                                InvHeader.TypeVersion = dt.Rows[i]["TypeVersion"].ToString();
                                InvHeader.ActivityCode = dt.Rows[i]["ActivityCode"].ToString();
                                InvHeader.TrDate = Convert.ToDateTime(dt.Rows[i]["TrDate"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);

                                InvHeaderList.Add(InvHeader);
                            }
                        }
                    }
                }
            }

            return InvHeaderList.ToList();

        }
        internal static List<taxableItems> GetTaxableItem(int InvoiceID)
        {
            List<taxableItems> TaxableItemList = new List<taxableItems>();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                string condetion = " select * from [taxableItems] Where InvoiceID =" + InvoiceID + "";


                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(condetion, con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {
                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {


                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                taxableItems TaxableItem_ = new taxableItems();
                                TaxableItem_.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                TaxableItem_.taxType = dt.Rows[i]["taxType"].ToString();
                                TaxableItem_.subType = dt.Rows[i]["subType"].ToString();
                                TaxableItem_.rate = Convert.ToInt32(dt.Rows[i]["rate"]);
                                TaxableItem_.amount = Convert.ToInt32(dt.Rows[i]["amount"]);
                                TaxableItemList.Add(TaxableItem_);
                            }
                        }
                    }
                }
            }

            return TaxableItemList.ToList();

        }

        internal static string PushExel(string type, I_ControlTax I_ControlTax)
        {

            string UUid = "";
            try
            {
                List<IQ_InvoiceHedar_Tax> Header = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_InvoiceHedar_Tax> Header2 = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_InvoiceHedar_Tax> Header3 = new List<IQ_InvoiceHedar_Tax>();
                List<IQ_Sls_InvoiceDetail_Tax> lstInvItems = new List<IQ_Sls_InvoiceDetail_Tax>();
                List<taxableItems> taxableItems_ = new List<taxableItems>();

                Header = GetInvoiceHeaderExel(type);
                for (int i = 0; i < Header.Count; i++)
                {
                    List<IQ_Sls_InvoiceDetail_Tax> lstInvItems_ = new List<IQ_Sls_InvoiceDetail_Tax>();
                    List<taxableItems> taxableItems_2 = new List<taxableItems>();

                    lstInvItems_ = GetInvoiceItems(Header[i].InvoiceID);
                    taxableItems_2 = GetTaxableItem(Header[i].InvoiceID);

                    if (lstInvItems_.Count > 0)
                    {
                        for (int x = 0; x < lstInvItems_.Count; x++)
                        {
                            lstInvItems.Add(lstInvItems_[x]);

                        }
                    }
                  
                    if (taxableItems_2.Count > 0)
                    {
                        for (int y = 0; y < taxableItems_2.Count; y++)
                        {
                            taxableItems_.Add(taxableItems_2[y]);

                        }
                    }
                    


                }





                if (Header.Count > 0)
                {


                    DateTime TaxUploadDate = DateTime.Now;
                    string DATAA = TaxUploadDate.Year.ToString() + "-" + TaxUploadDate.Day + "-" + TaxUploadDate.Month;
                    IQ_InvoiceHedar_Tax HeaderSend = new IQ_InvoiceHedar_Tax();
                    List<IQ_Sls_InvoiceDetail_Tax> lstInvItemsSend = new List<IQ_Sls_InvoiceDetail_Tax>();
                    //lstInvItemsSend = lstInvItems.Where(xx => xx.InvoiceID == HeaderSend.InvoiceID).ToList();
                    UUid = GetDocumentsSendExel(Header, lstInvItems, taxableItems_, I_ControlTax);

                    if (UUid != "" || UUid != null)
                    {
                        //System.Data.Common and System.Data.SqlClient.


                        string sql = @"UPDATE [I_Sls_TR_Invoice]   SET DocUUID = @UUid ,Status = @Status,TaxUploadDate = @TaxUploadDate WHERE InvoiceID = @InvoiceID";
                        using (var con = new System.Data.SqlClient.SqlConnection(connectionString))
                        {
                            con.Open();
                            //DONE: IDisposable (SqlCommand) should be wrapped into using
                            using (var cmd = new System.Data.SqlClient.SqlCommand(sql, con))
                            {
                                //TODO: AddWithValue is often a bad choice; change to Add 
                                cmd.Parameters.AddWithValue("@UUid", UUid);
                                cmd.Parameters.AddWithValue("@Status", 2);
                                cmd.Parameters.AddWithValue("@TaxUploadDate", DATAA);
                                cmd.Parameters.AddWithValue("@InvoiceID", HeaderSend.InvoiceID);
                                cmd.ExecuteNonQuery();
                            }

                            string QueryTaxLoge = "INSERT INTO [dbo].[G_TaxLog]([TRNO],[OldStates],[NewStates],[Update_Date],[TypeAction] ) VALUES(@TrNo,@oldeStatus,@newstates,@UpdateDate,@TypeAction)";

                            using (var cmd2 = new System.Data.SqlClient.SqlCommand(QueryTaxLoge, con))
                            {
                                cmd2.Parameters.AddWithValue("@TrNo", HeaderSend.TrNo);
                                cmd2.Parameters.AddWithValue("@oldeStatus", HeaderSend.Status);
                                cmd2.Parameters.AddWithValue("@newstates", 2);
                                cmd2.Parameters.AddWithValue("@UpdateDate", DATAA);
                                cmd2.Parameters.AddWithValue("@TypeAction", "Upload");
                                cmd2.ExecuteNonQuery();
                            }
                        }

                        DownloadPDF(UUid, I_ControlTax);

                    }
                    else
                    {

                    }


                }


                return Header.Count.ToString();
            }
            catch (Exception EX)
            {
                EX.InnerException.ToString();
                EX.Message.ToString();
                return EX.Message.ToString();
            }
        }

        internal static List<IQ_InvoiceHedar_Tax> GetInvoiceHeaderExel(string Type)
        {
            List<IQ_InvoiceHedar_Tax> InvHeaderList = new List<IQ_InvoiceHedar_Tax>();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                string condetion = " select * from [IQ_InvoiceHedar_Tax] Where ChargeReason ='" + Type + "'";


                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand(condetion, con))
                {
                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {
                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {


                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                IQ_InvoiceHedar_Tax InvHeader = new IQ_InvoiceHedar_Tax();
                                InvHeader.branchID_iss = Convert.ToInt32(dt.Rows[i]["branchID_iss"]);
                                InvHeader.name_iss = dt.Rows[i]["name_iss"].ToString();
                                InvHeader.country_iss = dt.Rows[i]["country_iss"].ToString();
                                InvHeader.governate_iss = dt.Rows[i]["governate_iss"].ToString();
                                InvHeader.regionCity_iss = dt.Rows[i]["regionCity_iss"].ToString();
                                InvHeader.street_iss = dt.Rows[i]["street_iss"].ToString();
                                InvHeader.buildingNumber_iss = dt.Rows[i]["buildingNumber_iss"].ToString();
                                InvHeader.postalCode_iss = dt.Rows[i]["postalCode_iss"].ToString();
                                InvHeader.floor_iss = dt.Rows[i]["floor_iss"].ToString();
                                InvHeader.room_iss = dt.Rows[i]["room_iss"].ToString();
                                InvHeader.landmark_iss = dt.Rows[i]["landmark_iss"].ToString();
                                InvHeader.additionalInformation_iss = dt.Rows[i]["additionalInformation_iss"].ToString();
                                InvHeader.type_iss = dt.Rows[i]["type_iss"].ToString();
                                InvHeader.id_iss = dt.Rows[i]["id_iss"].ToString();
                                InvHeader.name_iss = dt.Rows[i]["name_iss"].ToString();
                                InvHeader.country_rec = dt.Rows[i]["country_rec"].ToString();
                                InvHeader.governate_rec = dt.Rows[i]["governate_rec"].ToString();
                                InvHeader.regionCity_rec = dt.Rows[i]["regionCity_rec"].ToString();
                                InvHeader.street_rec = dt.Rows[i]["street_rec"].ToString();
                                InvHeader.buildingNumber_rec = dt.Rows[i]["buildingNumber_rec"].ToString();
                                InvHeader.postalCode_rec = dt.Rows[i]["postalCode_rec"].ToString();
                                InvHeader.floor_rec = dt.Rows[i]["floor_rec"].ToString();
                                InvHeader.room_rec = dt.Rows[i]["room_rec"].ToString();
                                InvHeader.landmark_rec = dt.Rows[i]["landmark_rec"].ToString();
                                InvHeader.additionalInformation_rec = dt.Rows[i]["additionalInformation_rec"].ToString();
                                InvHeader.id_rec = dt.Rows[i]["id_rec"].ToString();
                                InvHeader.name_rec = dt.Rows[i]["name_rec"].ToString();
                                InvHeader.type_rec = dt.Rows[i]["type_rec"].ToString();
                                InvHeader.DiscountAmount = Convert.ToDecimal(dt.Rows[i]["DiscountAmount"]);
                                InvHeader.ItemAllowTotal = Convert.ToDecimal(dt.Rows[i]["ItemAllowTotal"]);
                                InvHeader.ItemDiscountTotal = Convert.ToDecimal(dt.Rows[i]["ItemDiscountTotal"]);
                                InvHeader.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["TotalAmount"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);
                                InvHeader.VatType = Convert.ToInt32(dt.Rows[i]["VatType"]);
                                InvHeader.TotalAmount = Convert.ToDecimal(dt.Rows[i]["TotalAmount"]);
                                InvHeader.RoundingAmount = Convert.ToDecimal(dt.Rows[i]["RoundingAmount"]);
                                InvHeader.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvHeader.TrNo = Convert.ToInt32(dt.Rows[i]["TrNo"]);
                                InvHeader.DocType = dt.Rows[i]["DocType"].ToString();
                                InvHeader.TrDate = Convert.ToDateTime(dt.Rows[i]["TrDate"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);

                                InvHeaderList.Add(InvHeader);
                            }
                        }
                    }
                }
            }

            return InvHeaderList.ToList();

        }
        private static string GetDocumentsSendExel(List<IQ_InvoiceHedar_Tax> Header, List<IQ_Sls_InvoiceDetail_Tax> lstInvItems, List<taxableItems> taxableItems, I_ControlTax I_ControlTax)
        {
             
            List<Root> RootE = new List<Root>();
            List<Document> documents = new List<Document>();
            for (int z = 0; z < Header.Count; z++)
            {
                List<IQ_Sls_InvoiceDetail_Tax> lstInvItemsSend = new List<IQ_Sls_InvoiceDetail_Tax>();
                lstInvItemsSend = lstInvItems.Where(xx => xx.InvoiceID == Header[z].InvoiceID).ToList();

                try
                {
                    List<CustomModel.IQ_EGTaxInvHeader> Header2 = new List<CustomModel.IQ_EGTaxInvHeader>();

                    List<TaxTotal> lstTaxTotal = new List<TaxTotal>();
                    List<TaxableItem> LstTaxableItem = new List<TaxableItem>();
                    List<InvoiceLine> lstInvoiceLine = new List<InvoiceLine>();
                    List<Signature> lstSignature = new List<Signature>();

                    double? itemTotalTax = 0;
                    string itemTaxType = "";
                    foreach (var item in lstInvItemsSend)
                    {
                        //cust TaxableItem to TblTaxableItem
                        List<TaxableItem> txLst = new List<TaxableItem>();

                        for (int i = 0; i < taxableItems.Count; i++)
                        {
                            TaxableItem txLst2 = new TaxableItem();
                            txLst2.taxType = taxableItems[i].taxType;
                            txLst2.subType = taxableItems[i].subType;
                            txLst2.amount = taxableItems[i].amount;
                            txLst2.rate = taxableItems[i].rate;
                            txLst.Add(txLst2);

                            lstTaxTotal.Add(new TaxTotal
                            {
                                amount = Convert.ToDouble(taxableItems[i].amount),
                                taxType = taxableItems[i].taxType
                            });
                        }

                        //cust invoiceLines to InvoiceLineTblInvoiceLine
                        lstInvoiceLine.Add(new InvoiceLine
                        {
                            description = item.DescA,
                            itemType = item.codeType,
                            itemCode = item.itemCode,
                            unitType = item.UomCode,
                            quantity = Convert.ToDouble(item.SoldQty),
                            internalCode = item.itemCode.ToString(),
                            salesTotal = Convert.ToDouble(item.Unitprice * item.SoldQty),
                            total = Convert.ToDouble(item.NetAfterVat),
                            valueDifference = Convert.ToDouble(0),
                            totalTaxableFees = Convert.ToDouble(0),
                            netTotal = Convert.ToDouble(item.ItemTotal),
                            itemsDiscount = Convert.ToDouble(0),
                            discount = new Discount { amount = Convert.ToDouble(item.DiscountAmount), rate = Convert.ToDouble(0) },
                            unitValue = new UnitValue { amountSold = Convert.ToDouble(item.Unitprice * 1), amountEGP = Convert.ToDouble(item.Unitprice), currencyExchangeRate = Convert.ToDouble(1), currencySold = "EGP" },
                            taxableItems = txLst

                        }); ;

                    }


                    DateTime _getDate = string.IsNullOrWhiteSpace(Header[z].TrDate.ToString()) ? DateTime.Now : DateTime.Parse(Header[z].TrDate.ToString()).AddHours(+2);
                    string _date = _getDate.ToUniversalTime().ToString("yyyy-MM-dd'T'HH:mm:ss'Z'");
                    ///Header[z].name_iss = SecuritySystem.Decrypt(Header[z].name_iss);
                    string Receiver_ID;
                    if (Header[z].type_rec == "P" && Header[z].id_rec == "" || Header[z].id_rec == null)
                    {
                        Receiver_ID = "";// Header.cus_IDNo;
                    }
                    else
                    {
                        Receiver_ID = Header[z].id_rec;
                    }
                   var Root = new Root
                    {
                        documents = new List<Document>
                        {
                            new Document
                            {
                                issuer = new Issuer
                                {
                                    address = new Address
                                    {
                                        branchID = Header[z].branchID_iss.ToString(),
                                        country = Header[z].country_iss,
                                        governate = Header[z].governate_iss,
                                        regionCity = Header[z].regionCity_iss,
                                        street = Header[z].street_iss,
                                        buildingNumber = Header[z].buildingNumber_iss,
                                        postalCode = Header[z].postalCode_iss,
                                        floor = Header[z].floor_iss,
                                        room = Header[z].room_iss,
                                        landmark = Header[z].landmark_iss,
                                        additionalInformation = Header[z].additionalInformation_iss
                                    },
                                    type = Header[z].type_iss,
                                    id = Header[z].id_iss,
                                    name = Header[z].name_iss
                                },
                                receiver = new Receiver
                                {
                                    address = new Address
                                    {
                                        branchID = Header[z].branchID_rec.ToString(),// "0",
                                        country = Header[z].country_rec,
                                        governate = Header[z].governate_iss,
                                        regionCity = Header[z].regionCity_rec,
                                        street = Header[z].street_rec,
                                        buildingNumber = Header[z].buildingNumber_rec,
                                        postalCode = Header[z].postalCode_rec,
                                        floor = Header[z].floor_rec,
                                        room = Header[z].room_rec,
                                        landmark = Header[z].landmark_rec,
                                        additionalInformation = Header[z].additionalInformation_rec,
                                    },
                                    type = Header[z].type_rec,
                                    id = Receiver_ID,
                                    name = Header[z].name_rec,
                                },
                                documentType = Header[z].DocType,
                                documentTypeVersion = Header[z].TypeVersion,// _DocumentTypeVersion,
                                dateTimeIssued = _date,
                                taxpayerActivityCode = Header[z].ActivityCode,
                                internalID = Header[z].TrNo.ToString(),

                                payment = new Payment
                                {
                                },
                                delivery = new Delivery
                                {
                                },
                                invoiceLines = lstInvoiceLine,
                                totalDiscountAmount = Convert.ToDouble(Header[z].ItemDiscountTotal),
                                totalSalesAmount = Convert.ToDouble(Header[z].TotalAmount),
                                netAmount = Convert.ToDouble(Header[z].ItemTotal),
                                taxTotals = lstTaxTotal,
                                totalAmount = Convert.ToDouble(Header[z].TotalAmount),
                                extraDiscountAmount = Convert.ToDouble(Header[z].DiscountAmount),
                                totalItemsDiscountAmount = Convert.ToDouble(Header[z].ItemDiscountTotal),
                                signatures = new List<Signature>(),
                            }
                        }
                    };

                    string replacejson = JsonConvert.SerializeObject(Root);
                    replacejson = replacejson.Replace(",\"signatures\":[]", "");
                    JObject request = JsonConvert.DeserializeObject<JObject>(replacejson);

                    var SerializeJson = Ex.Serialize(request);
                    SerializeJson = SerializeJson.Remove(0, 22);

                    byte[] byteData = Encoding.UTF8.GetBytes(SerializeJson);

                    string SignToken = SignFromToken.SignWithCMS(byteData, I_ControlTax.TokenPinCode);

                    lstSignature.Add(new Signature
                    {
                        signatureType = "I",
                        value = SignToken
                    });
                    Root.documents[0].signatures = lstSignature;

                    //Document documentsE = new Document();
                    //string json_ = JsonConvert.SerializeObject(Root.documents[0]);
                    //documentsE = JsonConvert.DeserializeObject<Document>(json_);

                    RootE.Add(Root);

                }
                catch (Exception ex)
                {

                    return ""; //ex.Message.ToString();
                }
            }

            Root RootObj = new Root();
            RootObj = RootE[0];
            RestClient client = new RestClient();
            client = new RestClient("");
            var requestApi = new RestRequest();
            string json = JsonConvert.SerializeObject(RootObj);
            Newtonsoft.Json.Linq.JObject request2 = JsonConvert.DeserializeObject<Newtonsoft.Json.Linq.JObject>(json);
            string body = JsonConvert.SerializeObject(RootObj);
            requestApi.Method = Method.POST;
            requestApi.Timeout = -1;
            requestApi.AddHeader("Content-Type", "application/json");
            requestApi.AddHeader("Authorization", "Bearer " + I_ControlTax.access_token + "");

            requestApi.AddParameter("application/json", body, ParameterType.RequestBody);
            IRestResponse response = client.Execute(requestApi);
            Rootcontent Rootcontent = new Rootcontent();

            if (response.IsSuccessful != false)
            {
                Rootcontent = JsonConvert.DeserializeObject<Rootcontent>(response.Content);


            }
            else
            {
            }
            return "";

        }

    }

}
