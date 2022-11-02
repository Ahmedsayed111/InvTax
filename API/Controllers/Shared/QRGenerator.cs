
using System;
using System.Collections.Generic; 
using System.Text;
using System.IO;
using System.Drawing; 
using QRCoder;

namespace Inv.API.Controllers
{
    public class QrModel
    {
        public string CompName { get; set; }
        public string VatNo { get; set; }
        public Nullable<System.DateTime> TrDate { get; set; }
        public Nullable<decimal> Total { get; set; }
        public Nullable<decimal> Vat { get; set; }

    }

    public class QRGeneratorController
    {


        private class TLV
        {
            public byte TAG { get; set; }
            public byte Len { get; set; }
            public string Value { get; set; }
            public string HexVal { get; set; }
        }

        public static DateTime MargeTime_in_Date(DateTime dateTime, DateTime Time)
        {

            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, Time.Hour, Time.Minute, Time.Second);
        }

        public static DateTime AddTimeIndata(DateTime dateTime, string stringTime)
        {

            //string stringTime = Time.ToString();
            string[] values = stringTime.Split(':');

            return new DateTime(dateTime.Year, dateTime.Month, dateTime.Day, Convert.ToInt16(values[0]), Convert.ToInt16(values[1]), 0);
        }


        public static string QrGenerator(QrModel Model)
        {

            string Qr = ""; string Qr64;
            string st; DateTime d;
            List<TLV> TlvList = new List<TLV>();



            st = Model.CompName;
            TlvList.Add(genartateTLV(1, st));
            TlvList.Add(genartateTLV(2, Model.VatNo));

            d = Convert.ToDateTime(Model.TrDate);
            st = d.ToUniversalTime().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'ff'Z'");
            TlvList.Add(genartateTLV(3, st));
            st = Convert.ToDecimal(Model.Total + Model.Vat).ToString("#0.00");

            TlvList.Add(genartateTLV(4, st));
            st = Convert.ToDecimal(Model.Vat).ToString("#0.00");

            TlvList.Add(genartateTLV(5, st));

            foreach (var item in TlvList)
            {
                Qr = Qr + item.HexVal;
            }
            var HexArr = new byte[Qr.Length / 2];
            for (var i = 0; i < Qr.Length / 2; i++)
            {
                HexArr[i] = Convert.ToByte(Qr.Substring(i * 2, 2), 16);
            }

            Qr64 = System.Convert.ToBase64String(HexArr);

            return (Qr64);

        }
        private static TLV genartateTLV(byte tp, string Val)
        {
            TLV itm = new TLV();
            itm.TAG = tp;
            itm.Len = Convert.ToByte(Encoding.UTF8.GetBytes(Val).Length);
            itm.Value = Val;
            itm.HexVal = itm.TAG.ToString("X2") + itm.Len.ToString("X2") + ToHexString(Val);

            return (itm);
        }
        public static string ToHexString(string str)
        {
            var sb = new StringBuilder();

            var bytes = Encoding.UTF8.GetBytes(str);
            foreach (var t in bytes)
            {
                sb.Append(t.ToString("X2"));
            }

            return sb.ToString();
        }



        public static string GenerateGuid()
        {
            Guid obj = Guid.NewGuid();

            return obj.ToString();
        }

        public static string GenerateQRCode(string CompName, string VatNo, int TotalAmount, int VatAmount, string TrDate, string Path)
        {
 

            DateTime tstamp = DateTime.Now;
            DateTime data1 = DateTime.Now;


            QrModel QrRec = new QrModel();
            QrRec.CompName = CompName;
            QrRec.VatNo = VatNo;
            QrRec.Total = TotalAmount;
            QrRec.Vat = VatAmount;
            data1 = Convert.ToDateTime(TrDate);
            tstamp = QRGeneratorController.MargeTime_in_Date(data1, tstamp);

            QrRec.TrDate = tstamp;

            string QrCode = QRGeneratorController.QrGenerator(QrRec);

            string st = GenerateGuid();
            string DocUUID = st;
            string QRCode = QrCode;
            string qr = QRCode;
            QRCodeGenerator qRCodeGenerator = new QRCodeGenerator();
            QRCodeData qRCodeData = qRCodeGenerator.CreateQrCode(qr, QRCoder.QRCodeGenerator.ECCLevel.Q);
            QRCoder.QRCode qRCode = new QRCoder.QRCode(qRCodeData);
            var QRcode = "";
            var myUniqueFileName = "";
            using (Bitmap bitmap = qRCode.GetGraphic(2))
            {
                using (MemoryStream ms = new MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byte[] byteimage = ms.ToArray();

                    try
                    {
                        myUniqueFileName = string.Format(@"{0}.Png", Guid.NewGuid());

                        File.WriteAllBytes(""+ Path + "/"+ myUniqueFileName + "", byteimage);

                        
                    }
                    catch (Exception ex)
                    {
                        myUniqueFileName = "no";
                    }
                  

                    
                    QRcode = Convert.ToBase64String(byteimage);

                }
            }
            return myUniqueFileName;
        }

    }

}