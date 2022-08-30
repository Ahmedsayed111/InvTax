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

namespace APIETAX
{



    public class HomeSendinvoce
    {

        //public static string connectionString = @"Data Source=192.168.1.50\SQL2014;Initial Catalog=TESTRAGAB;User Id=SYSUSER;Password=SYSUSER";
        public static string connectionString = "";
        private IConfiguration Configuration;

        public HomeSendinvoce(IConfiguration _configuration)
        {
            Configuration = _configuration;
            connectionString = this.Configuration.GetConnectionString("DefaultConnection");

        }




        internal static string sendinvoce(int Optype, int InvoiceID, I_ControlTax I_ControlTax)
        {

            string UUid = "";
            try
            {
                List<IQ_EGTaxInvHeader> Header = new List<IQ_EGTaxInvHeader>();
                List<IQ_EGTaxInvHeader> Header2 = new List<IQ_EGTaxInvHeader>();
                List<IQ_EGTaxInvHeader> Header3 = new List<IQ_EGTaxInvHeader>();
                List<IQ_EGTaxInvItems> lstInvItems = new List<IQ_EGTaxInvItems>();

                Header = GetInvHeader();   // get all invoices issues or to cancel 
                lstInvItems = GetInvItems();

                if (Optype == 1 || Optype == 0)  // upload invoice
                {
                    if (InvoiceID == 0)
                        Header.Where(x => x.Status == 1 && x.inv_Type == "I").ToList();
                    else
                        Header = Header.Where(x => x.InvoiceID == InvoiceID).ToList();

                }
                if (Optype == 2 || Optype == 0) // upload Cr/Db Note
                {
                    if (InvoiceID == 0)
                        Header.Where(x => x.Status == 1 && x.inv_Type == "C").ToList();
                    else
                        Header.Where(x => x.Status == 1 && x.DocUUID == "" && x.inv_Type == "C" && x.InvoiceID == InvoiceID).ToList();
                }
                if (Optype == 3 || Optype == 0) // Cancel invoice and CRDB
                {
                    if (InvoiceID == 0)
                        Header.Where(x => x.Status == 10).ToList();
                    else
                        Header.Where(x => x.Status == 10 && x.InvoiceID == InvoiceID).ToList();
                    foreach (var item in Header)
                    {
                        cancelledinv(item, I_ControlTax);
                    }
                    return "cancelled " + Header.Count;
                }
                if (Optype == 4 || Optype == 0) // Update invoice status
                {
                    string UpdateDocuments = RecentDocumentsSengel(I_ControlTax);
                    return UpdateDocuments;
                }

                if (Header.Count > 0)
                {

                    foreach (var item in Header)
                    {
                        DateTime TaxUploadDate = DateTime.Now;
                        string DATAA = TaxUploadDate.Year.ToString() + "-" + TaxUploadDate.Day + "-" + TaxUploadDate.Month;
                        IQ_EGTaxInvHeader HeaderSend = new IQ_EGTaxInvHeader();
                        HeaderSend = item;
                        List<IQ_EGTaxInvItems> lstInvItemsSend = new List<IQ_EGTaxInvItems>();
                        lstInvItemsSend = lstInvItems.Where(xx => xx.InvoiceID == HeaderSend.InvoiceID).ToList();
                        Rootcontent Rootcontent = new Rootcontent();
                        UUid = GetDocumentsSend(HeaderSend, lstInvItemsSend, I_ControlTax);

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

        private static string GetDocumentsSend(IQ_EGTaxInvHeader Header, List<IQ_EGTaxInvItems> lstInvItems, I_ControlTax I_ControlTax)
        {

            string uuid = "";
            try
            {
                List<IQ_EGTaxInvHeader> Header2 = new List<IQ_EGTaxInvHeader>();

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
                Header.sub_Name = SecuritySystem.Decrypt(Header.sub_Name);
                string Receiver_ID;
                if (Header.Cus_Type == "P" && Header.cus_IDNo == "" || Header.cus_IDNo == null)
                {
                    Receiver_ID = "";// Header.cus_IDNo;
                }
                else
                {
                    Receiver_ID = Header.Cus_VatNo;
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
                            branchID = "0",// Header.sub_Bra_code.ToString(),
                            country ="EG",// Header.Sub_Country,
                            governate = Header.sub_governate,
                            regionCity = Header.Sub_City,
                            street =  Header.Sub_Street,
                            buildingNumber =  Header.sub_BuildingNo,
                            postalCode =  Header.sub_PostalCode,
                            floor =  Header.sub_Floor,
                            room =  Header.sub__Room,
                            landmark =  Header.sub_LandMarks,
                            additionalInformation =  Header.sub_AdditionalInfo
                        },
                        type = Header.sub_Type,
                        id = Header.sub_VatNo,
                        name = Header.sub_Name
                    },
                    receiver = new Receiver
                    {
                        address = new Address
                        {
                            branchID = "0",
                            country = Header.Cus_Country,
                            governate = Header.Cus_governate,
                            regionCity =  Header.Cus_City,
                            street =  Header.Cus_Street,
                            buildingNumber = Header.Cus_BuildingNo,
                            postalCode = Header.Cus_PostalCode,
                            floor = Header.Cus_Floor,
                            room = Header.Cus__Room,
                            landmark = Header.Cus_LandMarks,
                            additionalInformation = Header.Cus_AdditionalInfo,
                        },
                        type = Header.Cus_Type,
                        id = Receiver_ID,
                        //id = Header.Cus_VatNo,
                        name = Header.Cus_Name,
                    },
                    documentType =Header.inv_Type ,
                    documentTypeVersion = Header.TaxType,// _DocumentTypeVersion,
                    dateTimeIssued = _date,
                    taxpayerActivityCode = Header.Sub_ActivityCode,
                    internalID = Header.TrNo.ToString(),
                    purchaseOrderReference = Header.PurchaseorderNo,
                    purchaseOrderDescription = Header.purchaseorderDesc,
                    salesOrderReference = Header.SalesOrderRef.ToString(),
                    salesOrderDescription = Header.SalesORderDesc,
                    proformaInvoiceNumber = Header.perofrmainvoiceno,
                    payment = new Payment
                    {
                    },
                    delivery = new Delivery
                    {
                    },
                    invoiceLines = lstInvoiceLine,
                    totalDiscountAmount = Convert.ToDouble(Header.ItemDiscountTotal),
                    totalSalesAmount =Convert.ToDouble( Header.hd_NetAmount),
                    netAmount =Convert.ToDouble(Header.ItemTotal),
                    taxTotals = lstTaxTotal,
                    totalAmount =Convert.ToDouble(Header.hd_TotalAmount),
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
                client = new RestClient(I_ControlTax.UploadDllUrl);
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

        public static string RemoveCharFromString(string input, char charItem)
        {
            int indexOfChar = input.IndexOf(charItem);
            if (indexOfChar < 0)
            {
                return input;
            }
            return RemoveCharFromString(input.Remove(indexOfChar, 1), charItem);
        }

        internal static string cancelledinv(IQ_EGTaxInvHeader Header, I_ControlTax I_ControlTax)
        {
            DateTime CurantDate = DateTime.Now;
            RestClient client = new RestClient();


            client = new RestClient(I_ControlTax.CancelDllUrl + Header.DocUUID + "/pdf?=");

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
                        cmd.Parameters.AddWithValue("@UUid", Header.DocUUID);
                        cmd.Parameters.AddWithValue("@Status", 12);
                        cmd.Parameters.AddWithValue("@UUID", Header.DocUUID);

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

                DownloadPDF(Header.DocUUID, I_ControlTax);
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
            string path = I_ControlTax.PDFFolder;
            try
            {
                System.IO.File.WriteAllBytes(I_ControlTax.PDFFolder + @"\" + UUID + "" + ".pdf", renderdByte);
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

        internal static List<IQ_EGTaxInvHeader> GetInvHeader()
        {
            List<IQ_EGTaxInvHeader> InvHeaderList = new List<IQ_EGTaxInvHeader>();

            using (System.Data.SqlClient.SqlConnection con = new System.Data.SqlClient.SqlConnection(connectionString))
            {

                string condetion = " select * from [IQ_EGTaxInvHeader] Where  status <> 3 and status = 1 or status = 10 ";


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
                                IQ_EGTaxInvHeader InvHeader = new IQ_EGTaxInvHeader();
                                InvHeader.sub_Bra_code = Convert.ToInt32(dt.Rows[i]["sub_Bra_code"]);
                                InvHeader.sub_Bra_Name = dt.Rows[i]["sub_Bra_Name"].ToString();
                                InvHeader.Sub_Country = dt.Rows[i]["Sub_Country"].ToString();
                                InvHeader.sub_governate = dt.Rows[i]["sub_governate"].ToString();
                                InvHeader.Sub_City = dt.Rows[i]["Sub_City"].ToString();
                                InvHeader.Sub_Street = dt.Rows[i]["Sub_Street"].ToString();
                                InvHeader.sub_BuildingNo = dt.Rows[i]["sub_BuildingNo"].ToString();
                                InvHeader.sub_PostalCode = dt.Rows[i]["sub_PostalCode"].ToString();
                                InvHeader.sub_Floor = dt.Rows[i]["sub_Floor"].ToString();
                                InvHeader.sub__Room = dt.Rows[i]["sub__Room"].ToString();
                                InvHeader.sub_LandMarks = dt.Rows[i]["sub_LandMarks"].ToString();
                                InvHeader.sub_AdditionalInfo = dt.Rows[i]["sub_AdditionalInfo"].ToString();
                                InvHeader.sub_Type = dt.Rows[i]["sub_Type"].ToString();
                                InvHeader.sub_VatNo = dt.Rows[i]["sub_VatNo"].ToString();
                                InvHeader.sub_Name = dt.Rows[i]["sub_Name"].ToString();
                                InvHeader.Cus_Country = dt.Rows[i]["Cus_Country"].ToString();
                                InvHeader.Cus_governate = dt.Rows[i]["Cus_governate"].ToString();
                                InvHeader.Cus_City = dt.Rows[i]["Cus_City"].ToString();
                                InvHeader.Cus_Street = dt.Rows[i]["Cus_Street"].ToString();
                                InvHeader.Cus_BuildingNo = dt.Rows[i]["Cus_BuildingNo"].ToString();
                                InvHeader.Cus_PostalCode = dt.Rows[i]["Cus_PostalCode"].ToString();
                                InvHeader.Cus_Floor = dt.Rows[i]["Cus_Floor"].ToString();
                                InvHeader.Cus__Room = dt.Rows[i]["Cus__Room"].ToString();
                                InvHeader.Cus_LandMarks = dt.Rows[i]["Cus_LandMarks"].ToString();
                                InvHeader.Cus_AdditionalInfo = dt.Rows[i]["Cus_AdditionalInfo"].ToString();
                                InvHeader.Cus_VatNo = dt.Rows[i]["Cus_VatNo"].ToString();
                                InvHeader.Cus_Name = dt.Rows[i]["Cus_Name"].ToString();
                                InvHeader.Cus_Type = dt.Rows[i]["Cus_Type"].ToString();
                                InvHeader.Sub_ActivityCode = dt.Rows[i]["Sub_ActivityCode"].ToString();
                                InvHeader.AllowAfterVat = Convert.ToDecimal(dt.Rows[i]["AllowAfterVat"]);
                                InvHeader.DiscountAmount = Convert.ToDecimal(dt.Rows[i]["DiscountAmount"]);
                                InvHeader.PurchaseorderNo = dt.Rows[i]["PurchaseorderNo"].ToString();
                                InvHeader.purchaseorderDesc = dt.Rows[i]["purchaseorderDesc"].ToString();
                                InvHeader.SalesOrderRef = Convert.ToInt32(dt.Rows[i]["SalesOrderRef"]);
                                InvHeader.SalesORderDesc = dt.Rows[i]["SalesORderDesc"].ToString();
                                InvHeader.perofrmainvoiceno = dt.Rows[i]["perofrmainvoiceno"].ToString();
                                InvHeader.ItemDiscountTotal = Convert.ToDecimal(dt.Rows[i]["ItemDiscountTotal"]);
                                InvHeader.ItemTotal = Convert.ToDecimal(dt.Rows[i]["ItemTotal"]);
                                InvHeader.hd_NetAmount = Convert.ToDecimal(dt.Rows[i]["hd_NetAmount"]);
                                InvHeader.hd_TaxTotal = Convert.ToDecimal(dt.Rows[i]["hd_TaxTotal"]);
                                InvHeader.TaxType = dt.Rows[i]["TaxType"].ToString();
                                InvHeader.hd_TotalAmount = Convert.ToDecimal(dt.Rows[i]["hd_TotalAmount"]);
                                InvHeader.RoundingAmount = Convert.ToDecimal(dt.Rows[i]["RoundingAmount"]);
                                InvHeader.InvoiceID = Convert.ToInt32(dt.Rows[i]["InvoiceID"]);
                                InvHeader.TrNo = Convert.ToInt32(dt.Rows[i]["TrNo"]);
                                InvHeader.inv_Type = dt.Rows[i]["inv_Type"].ToString();
                                InvHeader.TrDate = Convert.ToDateTime(dt.Rows[i]["TrDate"]);
                                InvHeader.VatAmount = Convert.ToDecimal(dt.Rows[i]["VatAmount"]);
                                InvHeader.cus_IDNo = dt.Rows[i]["cus_IDNo"].ToString();
                                InvHeader.cus_passportNo = dt.Rows[i]["cus_passportNo"].ToString();

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

                using (System.Data.SqlClient.SqlCommand cmd = new System.Data.SqlClient.SqlCommand("SELECT * FROM I_ControlTax where CompCode ='" + Comp + "' ", con))
                {

                    cmd.CommandType = System.Data.CommandType.Text;
                    using (System.Data.SqlClient.SqlDataAdapter sda = new System.Data.SqlClient.SqlDataAdapter(cmd))
                    {

                        using (System.Data.DataTable dt = new System.Data.DataTable())
                        {

                            sda.Fill(dt);

                            for (int i = 0; i < dt.Rows.Count; i++)
                            {
                                I_ControlTax ControlTax = new I_ControlTax();
                                ControlTax.CompCode = Convert.ToInt32(dt.Rows[i]["CompCode"]);
                                ControlTax.ClientIDProd = dt.Rows[i]["ClientIDProd"].ToString();
                                ControlTax.issuerId = dt.Rows[i]["issuerId"].ToString();
                                ControlTax.SecretIDProd = dt.Rows[i]["SecretIDProd"].ToString();
                                ControlTax.IsTaxForTest = Convert.ToBoolean(dt.Rows[i]["IsTaxForTest"]);
                                ControlTax.TokenPinCode = dt.Rows[i]["TokenPinCode"].ToString();
                                ControlTax.TokenPinType = dt.Rows[i]["TokenPinType"].ToString();
                                ControlTax.CreateTokinlDllUrl = dt.Rows[i]["CreateTokinlDllUrl"].ToString();
                                ControlTax.UploadDllUrl = dt.Rows[i]["UploadDllUrl"].ToString();
                                ControlTax.CancelDllUrl = dt.Rows[i]["CancelDllUrl"].ToString();
                                ControlTax.GetDllUrl = dt.Rows[i]["GetDllUrl"].ToString();
                                ControlTax.DownloadInterDllUrl = dt.Rows[i]["DownloadInterDllUrl"].ToString();
                                ControlTax.DownloadCustDllUrl = dt.Rows[i]["DownloadCustDllUrl"].ToString();
                                ControlTax.CancelinvoicePeriod = Convert.ToInt32(dt.Rows[i]["CancelinvoicePeriod"]);
                                ControlTax.RejectInvoicePeriod = Convert.ToInt32(dt.Rows[i]["RejectInvoicePeriod"]);
                                ControlTax.LastTaxSycnDate = Convert.ToDateTime(dt.Rows[i]["LastTaxSycnDate"]);
                                ControlTax.PageCount = Convert.ToInt32(dt.Rows[i]["PageCount"]);
                                ControlTax.BranchCode = Convert.ToInt32(dt.Rows[i]["BranchCode"]);
                                ControlTax.PDFFolder = dt.Rows[i]["PDFFolder"].ToString();
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
            List<I_Sls_TR_Invoice> Sls_TR_Invoice = new List<I_Sls_TR_Invoice>();
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
                                I_Sls_TR_Invoice Sls_TR_Invoice_ = new I_Sls_TR_Invoice();
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
        internal static void UpdateDocuments(I_Sls_TR_Invoice I_Sls_TR_Invoice, I_ControlTax I_ControlTax)
        {
            int oldstates_ = Convert.ToInt32(I_Sls_TR_Invoice.Status);
            int stat = 0;
            string pageNo = "1";
            var client = new RestClient(I_ControlTax.DownloadInterDllUrl + I_Sls_TR_Invoice.DocUUID + "/details");
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
    }

}
