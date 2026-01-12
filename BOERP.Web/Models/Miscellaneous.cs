using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using static SahajFramework.Models.AllEnum;
namespace SahajFramework.Models
{
    public class Miscellaneous
    {
       
        public string OTP { get; set; }
        public int Id { get; set; }
        public int Type { get; set; }
    }
    public class MiscUserman
    {
        public long LoginID { get; set; }
        public long EMPID { get; set; }
        public string EMPName { get; set; }
        public string EMPCode { get; set; }
        public string EMPNameCode { get; set; }
    }
    public class MiscEmployee
    {
        public long EMPID { get; set; }
        public string EMPName { get; set; }
        public string EMPCode { get; set; }
        public string Email { get; set; }
    }
    public class MiscLocation
    {
        public long LocationID { get; set; }
        public string LocationName { get; set; }
    }
    public class MiscGetTimeSheet
    {
        public long EMPID { get; set; }
        public string Date { get; set; }
        public string Type { get; set; }

    }

    public class MiscGetActiveLog
    {
        public long EMPID { get; set; }
        public string Date { get; set; }
        public string Remarks { get; set; }

        public string Type { get; set; }
    }

    public class    inputBoard
    {
        public string Approve { get; set; }
    }

    public class BoardMembershipRegister
    {
        [Required]
        public string DateAsOn { get; set; }
        [Required]
        public string Type { get; set; }
    }

    public class TempBoardShow
    {

        [Required(ErrorMessage="Member No")]
        public string memship_no { get; set; }

        public List<BoardMembersDet> membersList { get; set; }

    }

    public class BoardMembersDet
    {
        public string member_name { get; set; }
        public string memship_no { get; set; }
    }
    public class SingleMemberDetails
    {
        public string membership_type { get; set; }
        public string memship_no { get; set; }

        public string member_name { get; set; }
        public string father_name { get; set; }
        public string panno { get; set; }
        public string doj { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string mobile { get; set; }
        public string ward_accessed { get; set; }
        public string source_income { get; set; }
        public string currentdet_emp { get; set; }
        public string renewal_date { get; set; }
        public string leaving_date { get; set; }
        public string title { get; set; }
        public string dolgg { get; set; }
        public string mtitle_id { get; set; }
        public string meeting_date { get; set; }
    }


    public class ConsolidateActivityStatusList
    {
        public long EMPID { get; set; }
        
        public string Emp_Code { get; set; }
        public string Emp_name { get; set; }
        public string Supervisor { get; set; }
        public string DAL { get; set; }
        public string MAL { get; set; }
        public string AMAL { get; set; }
        public string CheckSelected { get; set; }
    }
    public class AllListModal
    {
        public long EMPID { get; set; }
        public int Approve { get; set; }

    }

    public class ReimEligibility
    {
        public double dBasic { get; set; }
        public double dHRA { get; set; }
        public double dTransport { get; set; }
        public double dLic { get; set; }
        public double dEPF { get; set; }
        public double dMedcalAmt { get; set; }
        public double dBonusAmt { get; set; }
    }
    public class   SalaryDetails
    {
        public long FinYearID { get; set; }

        public List<TempFinYearList> FinyearList { get; set; }
    }
    public class    TempFinYearList
    {
        public long ID { get; set; }
        public string year { get; set; }
        public string FromDate { get; set; }
        public string Todate { get; set; }
        public string ShowFromDate { get; set; }
        public string ShowToDate { get; set; }
    }

    public class TempDateModal
    {
        [Required(ErrorMessage = "From Date Can't be blank")]
        public string StartDate { get; set; }
        [Required(ErrorMessage = "To Date Can't be blank")]
        public string EndDate { get; set; }

    }

    public class Diem
    {
        public long DiemID { set; get; }
        [Required(ErrorMessage = "Status Can't be blank")]
        public string Status { get; set; }
        [Required(ErrorMessage = "Category Can't be blank")]
        public string Category { get; set; }
        public double PerDiemRate { get; set; }
        public double HotelRate { get; set; }
        public bool IsActive { set; get; }
        public int Priority { set; get; }
        public int createdby { get; set; }
        public string createdat { get; set; }
        public int modifiedby { get; set; }
        public string modifiedat { get; set; }
        public int deletedby { get; set; }
        public string deletedat { get; set; }
        public int isdeleted { get; set; }
        public string IPAddress { get; set; }
    }
    public class SalarySlipActivation
    {
        public string Date { get; set; }
        public MitrNonMitr? MitrUser { get; set; }
    }
    public class SalarySlipActivationEntry
    {
        public string Emptype { get; set; }
        public string Month { get; set; }
        public List<SalarySlipActivationEmp> Emplist { get; set; }
    }
    public class SalarySlipActivationEmp
    {
        public int RowNum { get; set; }
        public long id { get; set; }
        public string Checkbox { get; set; }
        public long Empid { get; set; }
        public string emp_name { get; set; }
        public string emp_code { get; set; }
        public string EmploymentTerm { get; set; }
        public string Location { get; set; }
        public string Designation { get; set; }
        public string Department { get; set; }
        public string IsActive { get; set; }
    }


}