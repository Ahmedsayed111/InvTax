using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Inv.DAL.Domain;
using Inv.API.Models;
using System.Text;
using Newtonsoft.Json.Linq;

namespace Inv.APICore.CustomModel
{

    public class Metadata
    {
        public int totalPages { get; set; }
        public int totalCount { get; set; }
    }
    public class Result
    {
        public string publicUrl { get; set; }
        public string uuid { get; set; }
        public string submissionUUID { get; set; }
        public string longId { get; set; }
        public string internalId { get; set; }
        public string typeName { get; set; }
        public string documentTypeNamePrimaryLang { get; set; }
        public string documentTypeNameSecondaryLang { get; set; }
        public string typeVersionName { get; set; }
        public string issuerId { get; set; }
        public string issuerName { get; set; }
        public string receiverId { get; set; }
        public string receiverName { get; set; }
        public DateTime dateTimeIssued { get; set; }
        public DateTime dateTimeReceived { get; set; }
        public double totalSales { get; set; }
        public double totalDiscount { get; set; }
        public double netAmount { get; set; }
        public double total { get; set; }
        public int maxPercision { get; set; }
        public object invoiceLineItemCodes { get; set; }
        public object cancelRequestDate { get; set; }
        public object rejectRequestDate { get; set; }
        public object cancelRequestDelayedDate { get; set; }
        public object rejectRequestDelayedDate { get; set; }
        public object declineCancelRequestDate { get; set; }
        public object declineRejectRequestDate { get; set; }
        public string documentStatusReason { get; set; }
        public string status { get; set; }
        public string createdByUserId { get; set; }
    }

    public class RootResult
    {
        public List<Result> result { get; set; }
        public Metadata metadata { get; set; }
    }

    public class AcceptedDocument
    {
        public string uuid { get; set; }
        public string longId { get; set; }
        public string internalId { get; set; }
        public string hashKey { get; set; }
    }

    public class Rootcontent
    {
        public string submissionId { get; set; }
        public List<AcceptedDocument> acceptedDocuments { get; set; }
        public List<object> rejectedDocuments { get; set; }
    }

    public class TkenModelView
    {
        public string access_token { get; set; }
        public int expires_in { get; set; }
        public string token_type { get; set; }
        public string scope { get; set; }
    }
    public class ValidationResults
    {
        public string status { get; set; }
        public List<ValidationStep> validationSteps { get; set; }
    }

    public class ValidationStep
    {
        public string status { get; set; }
        public object error { get; set; }
        public string stepName { get; set; }
        public string stepId { get; set; }
    }
    public static class Ex
    {
        public static string Serialize(JObject request)
        {
            return SerializeToken(request);
        }

        private static string SerializeToken(JToken request)
        {
            string x;
            string serialized = "";
            if (request.Parent is null)
            {
                SerializeToken(request.First);
            }
            else
            {
                if (request.Type == JTokenType.Property)
                {
                    string name = ((JProperty)request).Name.ToUpper();
                    serialized += "\"" + name + "\"";
                    foreach (var property in request)
                    {
                        if (property.Type == JTokenType.Object)
                        {
                            serialized += SerializeToken(property);
                        }
                        if (property.Type == JTokenType.Boolean || property.Type == JTokenType.Integer || property.Type == JTokenType.Float || property.Type == JTokenType.String || property.Type == JTokenType.Date)
                        {
                            if (property.Type == JTokenType.Date)
                            {
                                serialized += "\"" + property.Value<DateTime>().ToString("yyyy-MM-ddTHH:mm:ssZ") + "\"";
                            }
                            else if (property.Type == JTokenType.Float)
                            {
                                //x = property.Value<double?>().Round(5).ToString("##0.0####"); 
                                if (property.Value<double?>() == 0)
                                    serialized += "\"" + "0.0" + "\"";
                                else
                                    serialized += "\"" + property.Value<double?>().Round(5).ToString("##0.0####") + "\"";
                            }
                            else
                            {
                                serialized += "\"" + property.Value<string>() + "\"";
                            }
                        }
                        if (property.Type == JTokenType.Array)
                        {
                            foreach (var item in property.Children())
                            {
                                serialized += "\"" + ((JProperty)request).Name.ToUpper() + "\"";
                                serialized += SerializeToken(item);
                            }
                        }
                    }
                }

            }
            if (request.Type == JTokenType.Object)
            {
                foreach (var property in request.Children())
                {
                    if (property.Type == JTokenType.Object || property.Type == JTokenType.Property)
                    {
                        serialized += SerializeToken(property);
                    }
                }
            }
            return serialized;
        }

        public static double Round(this object x, int num)
        {
            //num = Sesstion.Setting.Round;
            if (x == null) return 0;
            var s = Math.Round(Convert.ToDouble(x), num);
            return s;
        }

        
    }
}