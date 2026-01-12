using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class Dashboard
    {

        public class DashboardList
        {
            public List<LeaveDashBoard> LeaveDashBoard { get; set; }
            public List<TravelDashBoard> TravelDashBoard { get; set; }
            public List<BirthdayDashBoard> BirthdayDashBoard { get; set; }
            public List<WorkanniversaryDashBoard> WorkanniversaryDashBoard { get; set; }
            public List<NewJoineesDashBoard> NewJoineesDashBoard { get; set; }
        }
        public class LeaveDashBoard
        {
            public long ID { get; set; }
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            public string start_date { get; set; }
            public string end_date { get; set; }
            public long Approved { get; set; }
            public string Leave_Name { get; set; }
            public string status { get; set; }
            public string location_name { get; set; }
            public string design_name { get; set; }
            public string LeaveDetials { get; set; }
        }

        public class TravelDashBoard
        {
            public long ID { get; set; }
            public string TravelCity { get; set; }
            public string TravelDate { get; set; }
            public string emp_name { get; set; }
            public string location_name { get; set; }
           public string design_name { get; set; }
            public string req_no { get; set; }
            public long approved { get; set; }

        }

        public class BirthdayDashBoard
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string location_name { get; set; }
            public string design_name { get; set; }
            public string DOB { get; set; }

        }
        public class WorkanniversaryDashBoard
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string location_name { get; set; }
            public string design_name { get; set; }
            public string DOJ { get; set; }

        }

        public class NewJoineesDashBoard
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string location_name { get; set; }
            public string design_name { get; set; }
            public string DOJ { get; set; }

        }

    }

   
}