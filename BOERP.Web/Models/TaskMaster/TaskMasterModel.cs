using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model
{
    public class TaskMasterModel
    {
        public int ID { get; set; }

        public DateTime TaskDate { get; set; }

        public string TaskName { get; set; }

        public string Frequency { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string TaskTime { get; set; }

        public string ExpiryDay { get; set; }

        public bool isLeverage { get; set; }

        public int Department { get; set; }

        public int Doer { get; set; }

        public int SecendoryDoer { get; set; }

        public int ProcessController { get; set; }

        public int AuditRequired { get; set; }

        public int AuditController { get; set; }

        public string EscalateEmail { get; set; }

        public int EscalationTime { get; set; }

        public int ReminderTime { get; set; }

        public bool isChecklist { get; set; }

        public int Branch { get; set; }

        public int Type { get; set; }

        public int LeverageD { get; set; }

        public int LeverageH { get; set; }

        public int LeverageM  { get; set; }

        public int isImageRequired { get; set; }

        public string ActualFilename { get; set; }

        public string NewFilename { get; set; }

        public string FileURL { get; set; }

        public bool isRemarkRequired { get; set; }

        public string Remark { get; set;}

        public int LeadDay { get; set; }

        public int LeadHour { get; set; }

        public int LeadMin { get; set; }

        public int Weightage { get; set; }

        public bool Carry { get; set; }
    }
}
