using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Net.Mail;
using System.Data;
using SahajFramework.Models;
using System.IO;

namespace SahajFramework.CommonClass
{
    public class SendMailHelper
    {
        public static bool SendAllPendingMail()
        {
            bool Result = false;
            long MailItemID = 0;
            List<PushMailItems> List = new List<PushMailItems>();
            try
            {
                List = FunctionPushMail.GetAllPendingMailItems();
                foreach (PushMailItems item in List)
                {
                    MailItemID = item.MailItemID;
                    MailMessage m = new MailMessage();
                    m.From = new MailAddress(item.FromMail);
                    m.To.Add(new MailAddress(item.ToMail));
                    if (!string.IsNullOrEmpty(item.CC))
                    {
                        if (item.CC.Contains(';'))
                        {
                            foreach (var aa in item.CC.Split(';'))
                            {
                                if (!string.IsNullOrEmpty(aa) && aa.Contains('@'))
                                {
                                    m.CC.Add(new MailAddress(aa));
                                }
                            }
                        }
                        else
                        {
                            m.CC.Add(new MailAddress(item.CC));
                        }
                    }
                    if (!string.IsNullOrEmpty(item.BCC))
                    {
                        if (item.BCC.Contains(';'))
                        {
                            foreach (var bb in item.BCC.Split(';'))
                            {
                                if (!string.IsNullOrEmpty(bb) && bb.Contains('@'))
                                {
                                    m.Bcc.Add(new MailAddress(bb));
                                }
                            }
                        }
                        else
                        {
                            m.Bcc.Add(new MailAddress(item.BCC));
                        }
                    }
                    m.Subject = item.Subject;
                    m.Body = item.MessageBody;

                    // Adding Attachment
                    if (item.PushMailItemsAttachment != null)
                    {
                        foreach (PushMailItemsAttachment MyAttach in item.PushMailItemsAttachment)
                        {
                            Attachment at = new Attachment(MyAttach.PhysicalPath);
                            m.Attachments.Add(at);
                        }
                    }
                    m.IsBodyHtml = true;
                    m.Priority = MailPriority.High;
                    SmtpClient c = new SmtpClient();
                    c.Host = item.Host;
                    c.Port = Convert.ToInt32(item.Port);
                    c.EnableSsl = item.EnableSsl;
                    c.UseDefaultCredentials = true;
                    c.DeliveryMethod = SmtpDeliveryMethod.Network;
                    c.Credentials = new NetworkCredential(item.SMTP_EMAIL, item.SMTP_PASSWORD);
                    c.Send(m);
                    clsDataBaseHelper.ExecuteNonQuery("update PushMailItems set IsMailSent=1 where MailItemID="+item.MailItemID);
                    Result = true;
                }
            }
            catch (Exception ex)
            {
                clsDataBaseHelper.ExecuteNonQuery("update PushMailItems set ErrorMessage='"+ClsCommon.EnsureString(ex.ToString()) +"', IsContainError=1 where MailItemID=" + MailItemID);
              //  ClsCommon.LogError("Error during SendAllPendingMail. The query was executed :", ex.ToString(), "Mail Is Sending to", "SendMailHelper", "SendMailHelper", "");
            }
            return Result;
        }

        //public static string SendSMS(string mobile, string Message)
        //{
        //    HttpWebRequest objWebRequest = null;
        //    HttpWebResponse objWebResponse = null;
        //    StreamWriter objStreamWriter = null;
        //    StreamReader objStreamReader = null;
        //    WebProxy objProxy1 = null;
        //    string stringResult = "";
        //    try
        //    {
        //        objWebRequest = (HttpWebRequest)WebRequest.Create("http://sms.sahajapps.com/submitsms.jsp?user=C3MITR&key=061aa0f76dXX&mobile=+91" + mobile + "&message=" + Message + "&senderid=MITRcc&accusage=1&entityid=1201159423521319033&tempid=1207162149751668281");
        //        objWebRequest.Method = "POST";
        //        if ((objProxy1 != null))
        //        {
        //            objWebRequest.Proxy = objProxy1;
        //        }
        //        objWebRequest.ContentType = "application/x-www-form-urlencoded";
        //        objStreamWriter = new StreamWriter(objWebRequest.GetRequestStream());
        //        objStreamWriter.Flush();
        //        objStreamWriter.Close();
        //        objWebResponse = (HttpWebResponse)objWebRequest.GetResponse();
        //        objStreamReader = new StreamReader(objWebResponse.GetResponseStream());
        //        stringResult = objStreamReader.ReadToEnd();
        //        objStreamReader.Close();
        //        Common_SPU.FnSetSMSLog(mobile, Message, stringResult, "");
        //    }
        //    catch (Exception ex)
        //    {
        //        ClsCommon.LogError("Error during SendMail. The query was executed :", ex.ToString(), "SMS Is Sending to -" + mobile + "", "SendMailHelper", "SendMailHelper", "");
        //    }
        //    finally
        //    {
        //        if ((objStreamWriter != null))
        //        {
        //            objStreamWriter.Close();
        //        }
        //        if ((objStreamReader != null))
        //        {
        //            objStreamReader.Close();
        //        }
        //        objWebRequest = null;
        //        objWebResponse = null;
        //        objProxy1 = null;
        //    }
        //    return stringResult;


        //}
        public static string SendSMS(string mobile, string Message)
        {
            HttpWebRequest objWebRequest = null;
            HttpWebResponse objWebResponse = null;
            StreamWriter objStreamWriter = null;
            StreamReader objStreamReader = null;
            WebProxy objProxy1 = null;
            string stringResult = "";
            try
            {
                //objWebRequest = (HttpWebRequest)WebRequest.Create("http://sms.sahajapps.com/submitsms.jsp?user=C3MITR&key=061aa0f76dXX&mobile=+91" + mobile + "&message=" + Message + "&senderid=MITRcc&accusage=1&entityid=1201159423521319033&tempid=1207162149751668281");
                // objWebRequest = (HttpWebRequest)WebRequest.Create("http://sms.sahajapps.com/submitsms.jsp?user=C3MITR&key=061aa0f76dXX&mobile=+91" + mobile + "&message=" + Message + "&senderid=ccMiTR&accusage=1&entityid=1201159423521319033&tempid=1207168957897471947");
                objWebRequest = (HttpWebRequest)WebRequest.Create("http://sms.sahajapps.com/submitsms.jsp?user=C3MITR&key=061aa0f76dXX&mobile=+91" + mobile + "&message=" + Message + "&senderid=ccMiTR&accusage=1&entityid=1201159423521319033&tempid=1207169667472306872");
                objWebRequest.Method = "POST";
                if ((objProxy1 != null))
                {
                    objWebRequest.Proxy = objProxy1;
                }
                objWebRequest.ContentType = "application/x-www-form-urlencoded";
                objStreamWriter = new StreamWriter(objWebRequest.GetRequestStream());
                objStreamWriter.Flush();
                objStreamWriter.Close();
                objWebResponse = (HttpWebResponse)objWebRequest.GetResponse();
                objStreamReader = new StreamReader(objWebResponse.GetResponseStream());
                stringResult = objStreamReader.ReadToEnd();
                objStreamReader.Close();
                Common_SPU.FnSetSMSLog(mobile, Message, stringResult, "");
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during SendMail. The query was executed :", ex.ToString(), "SMS Is Sending to -" + mobile + "", "SendMailHelper", "SendMailHelper", "");
            }
            finally
            {
                if ((objStreamWriter != null))
                {
                    objStreamWriter.Close();
                }
                if ((objStreamReader != null))
                {
                    objStreamReader.Close();
                }
                objWebRequest = null;
                objWebResponse = null;
                objProxy1 = null;
            }
            return stringResult;


        }


    }
}