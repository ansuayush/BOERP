using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class User_Task
    {
        public class Task
        {
            public class List
            {
                public long RowNum { get; set; }
                public long TaskID { set; get; }
                public string Subject { get; set; }
                public string StatusName { get; set; }
                public string DisplayName { get; set; }
                public string StatusColor { get; set; }
                public string Message { get; set; }
                public string Remarks { get; set; }
                public string Priority { get; set; }
                public string AssigenedToIDs { get; set; }
                public string AssigenedTo_Names { get; set; }

                public string DeferredIDs { get; set; }
                public string Deferred_Names { get; set; }

                public int createdby { get; set; }
                public string createdby_Name { get; set; }
                public string createdat { get; set; }
                public int modifiedby { get; set; }
                public string modifiedat { get; set; }
                public string NextDate { set; get; }
                public string IPAddress { get; set; }
            }
            public class AddTask
            {
                public long TaskID { get; set; }
                [Required(ErrorMessage = "Subject Can't Blank")]
                public string Subject { get; set; }
                [Required(ErrorMessage = "Subject Can't Blank")]
                public string Priority { get; set; }

                public string AssigenedToIDs { get; set; }
                [Required(ErrorMessage = "Assigened To Can't Blank")]
                public long[] IDs { get; set; }

                [Required(ErrorMessage = "Message Can't Blank")]
                public string Message { get; set; }
            }


        }
        public class StatusList
        {
            public long RowNum { get; set; }
            public int StatusID { set; get; }
            [Required(ErrorMessage = "Type Can't Blank")]
            public string Type { get; set; }
            [Required(ErrorMessage = "Status Name Can't Blank")]
            public string StatusName { get; set; }
            [Required(ErrorMessage = "Display Name Can't Blank")]
            public string DisplayName { get; set; }
            [Required(ErrorMessage = "Status Color Can't Blank")]
            public string StatusColor { get; set; }
            
            public string UseFor { get; set; }
            [Required(ErrorMessage = "Use For Can't Blank")]
            public  string[] UseFor_Name { get; set; }
            public int? Priority { get; set; }
            public bool IsActive { get; set; }
            public bool ReadOnly { get; set; }
        }

        public class   Notes
        {
            public class Add
            {
                public User_Task.Task.List TaskDetails { get; set; }
                public long NotesID { set; get; }
                public long TaskID { set; get; }
                [Required(ErrorMessage = "Status Can't Blank")]
                public long StatusID { set; get; }
                public string NextDate { get; set; }
                [Required(ErrorMessage = "Remarks Can't Blank")]
                public string Remarks { get; set; }
                public string NewAssigenedToIDs { get;set; }
                public string NewDeferredIDs { get; set; }
                public long? DeferredID { set; get; }
            }
            public class List
            {
                public long RowNum { get; set; }
                public long NotesID { set; get; }
                public int StatusID { set; get; }
                public string StatusColor { get; set; }
                public string DisplayName { get; set; }
                public string NextDate { get; set; }
                public string Remarks { get; set; }

                public string createdName { get; set; }
                public string modifiedName { get; set; }
                public string createdat { get; set; }
                public string modifiedat { get; set; }
                public string IPAddress { get; set; }
            }
           
        }
        
    }
}
