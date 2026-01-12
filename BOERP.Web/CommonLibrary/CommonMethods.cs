using System;
using System.Collections.Generic;
using System.Web.Configuration;
using System.Linq;
using System.Text;
using System.Web;
using System.IO;
using System.Xml;
using System.Xml.Serialization;
using System.Security.Cryptography;
using NLog;
using System.Net.Http;

namespace Generic
{

    public class AuthResult
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public bool IsValid => UserId > 0 && RoleId > 0;
    }

    public class CommonMethods
    {
        public const string ServerPath = "~";
        public static string key = "Sahaj";
        public static string QuotationTax = "18";
        public static string Encrypt(string input)
        {
            byte[] clearBytes = Encoding.Unicode.GetBytes(input);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(key, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    input = Convert.ToBase64String(ms.ToArray());
                }
            }
            return input;
        }
        public static string Decrypt(string input)
        {
            byte[] cipherBytes = Convert.FromBase64String(input);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(key, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    input = Encoding.Unicode.GetString(ms.ToArray());
                }
            }
            return input;
        }
        public static void Error(Exception ex)
        {
            StringBuilder response = new StringBuilder();
            response.AppendLine(ex.Message);
            MitraLogger.Error(ex.Message + ex.StackTrace);
            while (ex.InnerException != null)
            {
                ex = ex.InnerException;
                response.AppendLine(ex.Message);
            }

            MitraLogger.Error(response.ToString());

        }






        public string GetXMLFromObject(object o)
        {
            StringWriter sw = new StringWriter();
            XmlTextWriter tw = null;
            try
            {
                XmlSerializer serializer = new XmlSerializer(o.GetType());
                tw = new XmlTextWriter(sw);
                serializer.Serialize(tw, o);
            }
            catch (Exception ex)
            {
                //Handle Exception Code
                throw ex;
            }
            finally
            {
                sw.Close();
                if (tw != null)
                {
                    tw.Close();
                }
            }
            return sw.ToString();
        }
        

        public static AuthResult GetAuthInfo(string headerValue)
        {             
            if (string.IsNullOrWhiteSpace(headerValue))
                return new AuthResult(); // Return invalid by default
            headerValue = clsApplicationSetting.DecryptQueryString(headerValue)[0];
            var data = Sahaj.API.CommonMethods.IsValidToken(headerValue);

            if (data.Rows.Count > 0)
            {
                var userId = Convert.ToInt32(data.Rows[0]["UserId"]);
                var roleId = Convert.ToInt32(data.Rows[0]["RoleId"]);

                return new AuthResult
                {
                    UserId = userId,
                    RoleId = roleId
                };
            }

            return new AuthResult(); // Invalid if token not found
        }


    }
}