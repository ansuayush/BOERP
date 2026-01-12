using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Model.Employee
{
    public class EmployeeModel
    {
        public int id { get; set; }
        public string emp_code { get; set; }
        public string emp_name { get; set; }
        public string email { get; set; }
        public int design_id { get; set; }
        public int DepartmentID { get; set; }
        public string hod_name { get; set; }
        public int stateID { get; set; }
        public string Roles { get; set; }
        public string phone { get; set; }
        public string Password { get; set; }
        public string IPAddress {  get; set; }
        public string ActualFilename { get; set; }
        public string NewFilename { get; set; }
        public string FileURL { get; set; }
        public int Type { get; set; }

        public string otpEmail { get; set; }

        public bool isEA { get; set; }

        public bool isDirector { get; set; }


    }
}
