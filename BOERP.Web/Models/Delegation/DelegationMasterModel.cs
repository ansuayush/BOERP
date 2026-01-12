using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Delegation
{
    public class DelegationMasterModel
    {
        public int ID { get; set; }
        public int DelId { get; set; }
        public DateTime DelDate { get; set; }

        public int DelegatedBy { get; set; }
        public string DelName { get; set; }
        public DateTime StartDate1 { get; set; }
        public DateTime StartDate2 { get; set; }
        public DateTime StartDate3 { get; set; }
        public int Department { get; set; }
        public int Doer { get; set; }
        public int ApprovalAuthority { get; set; }
        public string EscalateEmail { get; set; }
        public int? EscalationTime { get; set; }
        public int? ReminderTime { get; set; }
        public int? Type { get; set; }
        public int? IsImageRequired { get; set; }
        public bool? IsRemarkRequired { get; set; }
        public int? Branch { get; set; }
        public int? Weightage { get; set; }
        public int? EA { get; set; }
        public string Remarks { get; set; }

        public DateTime? FromDate { get; set; }

        public int CreatedBy { get; set; }

        public int Status { get; set; }
        public DateTime? ToDate { get; set; }

        public bool BeforeDateTask { get; set; }

        public DateTime? DoerDoneDate { get; set; }


    }
}
