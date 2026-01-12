using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class BranchModel
    {

        public int id { get; set; }

        public string BranchUserID { get; set; }

        public string BranchName { get; set; }

        public int BranchManager { get; set; }

        public string email { get; set; }

        public string phone { get; set; }

        public string Roles { get; set; }
        public string Password { get; set; }

        public string IPAddress { get; set; }

        public int Type { get; set; }

        public DateTime EMStartDate { get; set; }

        public string OTPEmail { get; set; }

        public string InTime { get; set; }

        public string OutTime { get; set; }

    }

}
