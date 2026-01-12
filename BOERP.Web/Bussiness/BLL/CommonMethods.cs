using NLog;
using Sahaj.API.BLL;
using Sahaj.API.Interface;
using System;
using System.Data;
using System.IO;
using System.Net.Mail;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using System.Web.Security;

namespace Sahaj.API
{
    public class CommonMethods
    {

        private static Logger logger = LogManager.GetCurrentClassLogger();
        public const string ServerPath = "~";
        public static string key = "Mitr";
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
        public static void Debug(string Message)
        {

            MitraLogger.Debug(Message);


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

        /// <summary>
        /// This method is uused check the user CheckPermission
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="action"></param>
        /// <param name="screenId"></param>
        /// <returns></returns>
        public static bool CheckPermission(int userId, string action, string screenId)
        {
            ICommon _objICommon = new CommonBLL();
            bool isValid = true;
            var dt = _objICommon.GetUserPermission(userId, action, screenId);
            if (dt.Rows.Count <= 0)
            {
                isValid = false;
                string permissionData = "UserId:" + userId + " Action:" + action + "screenId:" + screenId + " This user dont have the permission to do the action.";
                logger.Debug("CheckPermission started. CheckPermission: {@permissionData}", permissionData);
            }
            return isValid;
        }

        /// <summary>
        /// This method is used to check the valid Token
        /// </summary>
        /// <param name="authHeader"></param>
        /// <returns></returns>
        public static DataTable IsValidToken(string authHeader)
        {
            authHeader = clsApplicationSetting.DecryptQueryString(authHeader)[0];           
            ICommon _objICommon = new CommonBLL();
            var data = _objICommon.UserRoleBasedonToken(authHeader);                          
            return data;
        }

        public bool SendEmail(string empName, string empEmail, string otp)
        {

            string company_server = clsDataBaseHelper.fnGetFieldName("company_email", "company_host");
            string company_email = clsDataBaseHelper.fnGetFieldName("company_email", "company_email");
            string port = clsDataBaseHelper.fnGetFieldName("company_email", "port");
            string company_username = clsDataBaseHelper.fnGetFieldName("company_email", "company_username");
            string company_password = clsDataBaseHelper.fnGetFieldName("company_email", "company_password");


            // content = emailbody;

            var filePath = HttpContext.Current.Server.MapPath("~/Attachments/HtmlTemplate/EmailOTPTemplate.html");

            System.IO.StreamReader objReader;
            objReader = new System.IO.StreamReader(filePath);
            string content = objReader.ReadToEnd();
            objReader.Close();
            content = Regex.Replace(content, "@#EMPNAME#@", empName);
            content = Regex.Replace(content, "@#OTP#@", otp);


            //data.HtmlView = content;

            try
            {

                MailMessage m = new MailMessage();
                m.From = new MailAddress(company_email);
                m.To.Add(new MailAddress(empEmail));

                m.Subject = "Your Email Verification Details";
                m.Body = content;
                m.IsBodyHtml = true;
                m.Priority = MailPriority.High;

                SmtpClient c = new SmtpClient(company_server, Convert.ToInt32(port))
                {
                    EnableSsl = true,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(company_username, company_password),
                    DeliveryMethod = SmtpDeliveryMethod.Network
                };

                c.Send(m);
                return true;
            }
            catch (Exception ex)
            {
                Error(ex);
                return false;
            }
        }
    }
}