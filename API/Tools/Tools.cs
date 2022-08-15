using Inv.API.Models;
using Inv.API.Tools;
using Inv.DAL.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


using Microsoft.VisualBasic;

namespace Inv.API.Tools
{
    public class Tools :BaseController
    {
        public enum DateDiffPart
        {
            Day,
            Month,
            Year,
            TotalDays,
            IsMinusDiff,
            IsValidDiff
        }
 
 
        public static string GetFilterdString(string str)
        {
            str = str.Trim();
            str = str.Replace('أ', 'ا');
            str = str.Replace('آ', 'ا');
            str = str.Replace('إ', 'ا');
            str = str.Replace('ة', 'ه');
            string[] names = str.Split(' ');
            str = "";
            for (int i = 0; i < names.Length; i++)
            {
                names[i] = names[i].Trim();
                if (names[i].Length > 0)
                    str += " " + names[i].Trim();
            }
            str = str.Replace("عبد ", "عبد");
            str = str.Replace("ابو ", "ابو");
            return str.Trim();
        }

        //public static string GenerateRandomID()
        //{
        //    return GenerateRandomID("ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890", 10);
        //}

        //public static string GenerateRandomID(string randomStringChars, int length)
        //{
        //    char[] chars = new char[randomStringChars.Length];
        //    chars = randomStringChars.ToCharArray();
        //    RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider();
        //    byte[] data = new byte[length];
        //    crypto.GetNonZeroBytes(data);
        //    StringBuilder result = new StringBuilder(length);
        //    foreach (byte b in data)
        //    {
        //        result.Append(chars[b % (chars.Length - 1)]);
        //    }
        //    return result.ToString();
        //}

        public DateTime DateGAdd(DateTime dateValue, int days, int months, int years)
        {
            dateValue = dateValue.AddDays(days);
            dateValue = dateValue.AddMonths(months);
            dateValue = dateValue.AddYears(years);
            return dateValue;
        }

 

 
        
        public int[] DateGDiff(DateTime date1, DateTime date2)
        {
            date1 = new DateTime(date1.Year, date1.Month, date1.Day);
            date2 = new DateTime(date2.Year, date2.Month, date2.Day);
            int[] dateDiff = new int[] { 0, 0, 0, 0, 0, 0 };
            TimeSpan diff = date2 - date1;
            double totalDays = diff.TotalDays;
            bool isMinus = totalDays <= -1 ? true : false;
            totalDays = totalDays <= -1 ? totalDays * -1 : totalDays;
            int Years = 0;
            int Months = 0;
            int Days = 0;
            DateTime workingDate = date1;
            while (date1 < date2)
            {
                date1 = date1.AddMonths(1);

                if (date1 < date2)
                {
                    Months++;

                    if (Months == 12)
                    {
                        workingDate = workingDate.AddYears(1);
                        Years++;
                        Months = 0;

                        date1 = workingDate;
                    }
                }

            }
            workingDate = workingDate.AddMonths(Months);
            diff = date2 - workingDate;
            Days = diff.Days;

            dateDiff[(int)DateDiffPart.Day] = Days;
            dateDiff[(int)DateDiffPart.Month] = Months;
            dateDiff[(int)DateDiffPart.Year] = Years;
            dateDiff[(int)DateDiffPart.TotalDays] = int.Parse(totalDays + "");
            dateDiff[(int)DateDiffPart.IsMinusDiff] = isMinus == true ? 1 : 0;
            dateDiff[(int)DateDiffPart.IsValidDiff] = 1;
            return dateDiff;
        }

        

 
        public static string GenerateGuid()
        {
            Guid obj = Guid.NewGuid();

            return obj.ToString();
        }












    }
}