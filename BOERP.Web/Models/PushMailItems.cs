using SahajFramework.CommonClass;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class PushMailItems
    {
        public long MailItemID { get; set; }
        public string Category { get; set; }
        public string FromMail { get; set; }
        public string ToMail { get; set; }
        public string CC { get; set; }
        public string BCC { get; set; }
        public string Subject { get; set; }
        public string MessageBody { get; set; }
        public string Priority { get; set; }
        public string Host { get; set; }
        public string Port { get; set; }
        public bool EnableSsl { get; set; }
        public bool IsMailSent { get; set; }
        public bool IsContainError { get; set; }
        public string SMTP_USER { get; set; }
        public string SMTP_PASSWORD { get; set; }
        public string SMTP_EMAIL { get; set; }
        public int isdeleted { get; set; }
        public string createdby { get; set; }
        public DateTime createdat { get; set; }
        public string IPAddress { get; set; }
        public List<PushMailItemsAttachment> PushMailItemsAttachment { get; set; }
    }

    public class PushMailItemsAttachment
    {
        public long MailAttachID { get; set; }
        public long MailItemID { get; set; }
        public string AttachName { get; set; }
        public string PhysicalPath { get; set; }
        public int isdeleted { get; set; }
        public int createdby { get; set; }
        public DateTime createdat { get; set; }
        public string IPAddress { get; set; }
    }

    public class FunctionPushMail
    {
        public static List<PushMailItems> GetAllPendingMailItems()
        {
            List<PushMailItems> List = new List<PushMailItems>();
            PushMailItems obj = new PushMailItems();
            try
            {
                DataSet TempModuleDataSet = Common_SPU.fnGetPushMailItems_Pending();
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    obj.MailItemID = Convert.ToInt32(item["MailItemID"]);
                    obj.Category = item["Category"].ToString();
                    obj.FromMail = item["FromMail"].ToString();
                    obj.ToMail = item["ToMail"].ToString();
                    obj.CC = item["CC"].ToString();
                    obj.BCC = item["BCC"].ToString();
                    obj.Subject = item["Subject"].ToString();
                    obj.MessageBody = item["MessageBody"].ToString();
                    obj.Priority = item["Priority"].ToString();
                    obj.Host = item["Host"].ToString();
                    obj.Port = item["Port"].ToString();
                    obj.EnableSsl = Convert.ToBoolean(item["EnableSsl"]);
                    obj.IsMailSent = Convert.ToBoolean(item["IsMailSent"]);
                    obj.IsContainError = Convert.ToBoolean(item["IsContainError"]);
                    obj.SMTP_EMAIL = item["SMTP_EMAIL"].ToString();
                    obj.SMTP_USER = item["SMTP_USER"].ToString();
                    obj.SMTP_PASSWORD = item["SMTP_PASSWORD"].ToString();
                    obj.PushMailItemsAttachment = GetAllPendingMailItems_Attachment(obj.MailItemID);
                    List.Add(obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetAllPendingMailItems. The query was executed :", ex.ToString(), "PushMailItems/GetAllPendingMailItems()", "PushMailItems", "PushMailItems", "");
            }
            return List;
        }


        private static List<PushMailItemsAttachment> GetAllPendingMailItems_Attachment(long MailItemID)
        {
            List<PushMailItemsAttachment> List = new List<PushMailItemsAttachment>();
            PushMailItemsAttachment obj = new PushMailItemsAttachment();
            try
            {
                DataSet TempModuleDataSet = Common_SPU.fnGetPushMailItems_Attachment(MailItemID);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    obj = new PushMailItemsAttachment();
                    obj.MailAttachID = Convert.ToInt32(item["MailAttachID"]);
                    obj.MailItemID = Convert.ToInt32(item["MailItemID"]);
                    obj.PhysicalPath = item["PhysicalPath"].ToString();
                    obj.AttachName = item["AttachName"].ToString();
                    List.Add(obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetAllPendingMailItems_Attachment. The query was executed :", ex.ToString(), "PushMailItems/GetAllPendingMailItems_Attachment()", "PushMailItems", "PushMailItems", "");
            }
            return List;
        }
    }
}