using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class PushNotification
    {
        public int NotificationID { get; set; }
        public string MessageContent { get; set; }
        public string Category { get; set; }
        public long TableID { get; set; }
        public string GotoURL { get; set; }
        public string Status { get; set; }
        public string Subject { get; set; }
        public int Priority { get; set; }
        public bool IsStatusRead { get; set; }
        public bool IsRecent { get; set; }
        public int CreatedByID { set; get; }
        public string CreatedDate { set; get; }
        public string IPAddress { set; get; }
        public bool IsActive { set; get; }
    }
}