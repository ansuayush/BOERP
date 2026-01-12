using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using static SahajFramework.Models.AllEnum;

namespace SahajFramework.Models
{
    public class Employee
    {
        public class List
        {
            public int RowNum { get; set; }
            public long ID { get; set; }
            public long MUID { get; set; }
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            public string emp_type { get; set; }
            public string JobTitle { get; set; }
            public string Designation { get; set; }
            public string Department { get; set; }
            public string Location { get; set; }
            public string Salary { get; set; }
            public string DateOfJoining { get; set; }
            public string DateOfResignation { get; set; }
            public string Status { get; set; }
            public string lastworking_day { get; set; }
            public string EmploymentTerm { get; set; }
            public long LeaveEntryCount { get; set; }
            public string REC_Code { get; set; }
            public string DocType { get; set; }
            public string createdat { get; set; }

        }
        public class RegistrationDetails
        {
            public long ID { get; set; }

            public long USER_ID { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            [EmailAddress]
            public string email { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]

            public string DOJ { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Contract_EndDate { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public long? DepartmentID { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string thematicarea_IDs { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public long? WorkLocationID { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public long design_id { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public long JobID { get; set; }
            public string Probation_EndDate { get; set; }

            public string doc { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public long? hod_name { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public long? SecondaryHODID { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public long? ed_name { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public long? HRID { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public long? AppraiserID { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string SkillsIDs { get; set; }
            public int NoticePeriod { get; set; }
            public string DOR { get; set; }

            public string lastworking_day { get; set; }
            public string IsMitrUser { get; set; }

            // All Enum Field

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public EmploymentTerm? EmploymentTerm { get; set; }

            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public Metropolitan? metro { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public EMPStatus? emp_status { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public YesNo? PsychometricTest { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public ResidenceType? ResidentialStatus { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public EMP_OT? co_ot { get; set; }
            public List<DropDownList> EMPList { get; set; }
            public List<DropDownList> SkillList { get; set; }
            public List<DropDownList> DepartmentList { get; set; }
            public List<DropDownList> DesignationList { get; set; }
            public List<DropDownList> LocationList { get; set; }
            public List<DropDownList> JobList { get; set; }
            public List<DropDownList> ThematicareaList { get; set; }
            public List<DropDownList> RoleList { get; set; }

            public List<DropDownList> BankList { get; set; }
            public EMP_Account SalaryAccount { get; set; }
            public EMP_Account ReimbursementAccount { get; set; }
            public UserMan.Add UserDetails { get; set; }
            public SalaryStructure lstSalaryStucture { get; set; }
            [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
            public string Personalemail { get; set; }
            public long NoticePeriodWaived { get; set; }
            public long NoticePeriodPayable { get; set; }
            public EMP_Account SalaryAccountNew { get; set; }
            public EMP_Account ReimbursementAccountNew { get; set; }
            public long LDWLeaveStatus { get; set; }
        }

        public class SalaryStructure
        {
            public string Subcategoryid { get; set; }
            public string Subcategory { get; set; }
            public string WorkingHours { get; set; }
            public string Structure { get; set; }
            public string Grade { get; set; }
            public string Step { get; set; }
            public string AnnualSalary { get; set; }
            public string Benefit { get; set; }
            public string HourlyRate { get; set; }
            public decimal CTC { get; set; }
        }
        public class PersonalDetails
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string father_name { get; set; }
            public string mother_name { get; set; }
            public long? CountryID { get; set; }
            public string SpouseName { get; set; }
            public string PartnerName { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string NomineeName { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string NomineeRelation { get; set; }
            public int? children { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string dob { get; set; }
            public string VisaValidity_Date { get; set; }
            public string VisaPermit_WorkDetail { get; set; }
            public string Visa_OtherDetails { get; set; }
            public string SSN_TIN { get; set; }
            public string ResidentialStatus { get; set; }

            public string AnyMedicalCondition { get; set; }
            public string PhysicianName { get; set; }
            public string PhysicianNumber { get; set; }
            public string PhysicianAlternate_No { get; set; }
            public string emergContact_no { get; set; }
            public string emergContact_Name { get; set; }
            public string emergContact_Relation { get; set; }

            // All Enum Field
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public MaritalStatus? marital_status { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public Gender? gender { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public Nationality? nationality { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public BloodGroup? BloodGroup { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public YesNo? SpecialAbility { get; set; }

            public List<DropDownList> CountryList { get; set; }
            public List<DropDownList> StateList { get; set; }
            public List<DropDownList> CityList { get; set; }

            public EMPAddress LocalAddress { get; set; }
            public EMPAddress PermanentAddress { get; set; }

            public List<References> ReferencesList { get; set; }
            public List<Qualification> QualificationList { get; set; }
            public string LockStatus { get; set; }
            public string MedicalLockStatus { get; set; }
            public long MUID { get; set; }
        }
        public class GeneralInfo
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            public string design_id { get; set; }
            public long? SeatPreferencesID { get; set; }
            public long? MealPreferenceID { get; set; }
            public EmploymentDetails employmentDetails { get; set; }
            public List<AirlinePreferences> AirlinePreferencesList { get; set; }
            public List<DropDownList> DesignationList { get; set; }
            public List<DropDownList> SeatPreferencesList { get; set; }
            public List<DropDownList> MealPreferencesList { get; set; }
            public string LockStatus { get; set; }
            public string FlyerLockStatus { get; set; }
            public long EMPID { get; set; }
            public long HRVSeatPreferencesID { get; set; }
            public long HRVMealPreferenceID { get; set; }
            public GeneralInfo generalInfo { get; set; }

        }
        public class IDInfo
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            public List<EMPAttachments> EMPAttachmentsList { get; set; }
            public EMPInsurance Accident { get; set; }
            public EMPInsurance Medical { get; set; }
            public string VLockStatus { get; set; }
            public string PLockStatus { get; set; }
            public string DlLockStatus { get; set; }
            public string DinLockStatus { get; set; }
            public List<ResidentStatus> ResidentStatus { get; set; }

        }
        public class ResidentStatus
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Attachments
        {
            public long id { get; set; }
            public string emp_name { get; set; }
            public string emp_code { get; set; }
            public List<EMPAttachments> EMPAttachmentsList { get; set; }

            public List<EMPAttachments> EMPOtherAttachmentsList { get; set; }
            public string VLockStatus { get; set; }
            public string PLockStatus { get; set; }
            public string DlLockStatus { get; set; }
            public string DinLockStatus { get; set; }
            public long AVId { get; set; }
            public long ADLId { get; set; }
            public long ApId { get; set; }
            public long ADinId { get; set; }

            public long AdharId { get; set; }
            public long PanId { get; set; }

        }
        public class AttachmentsNew
        {
            public AttachmentUrl AttachementVoter { get; set; }
            public AttachmentUrl AttachementDl { get; set; }
            public AttachmentUrl AttachementPassport { get; set; }
            public AttachmentUrl AttachementDin { get; set; }
            public AttachmentUrl AttachementAdhar { get; set; }
            public AttachmentUrl AttachementPan { get; set; }
            public long EMPId { get; set; }

        }
        public class AttachmentUrl
        {
            public long ID { get; set; }
            public long MUID { get; set; }
            public long HRVAttachmentID { get; set; }
            public string AttachmentURL { get; set; }
            public string filename { get; set; }
        }
        public class Declaration
        {
            public long Id { get; set; }
            public long DEId { get; set; }
            public string Declarationname { get; set; }
            public string Frequency { get; set; }
            public string DueDate { get; set; }
            public string AtOnboarding { get; set; }
            public string Remark { get; set; }
            public string Content { get; set; }
            public int Requiredremarksfield { get; set; }
            public int RequiredinhardCopy { get; set; }
            public int Active { get; set; }
            public string EmployeeType { get; set; }
            public string Attachement { get; set; }
            public string EmpAttachement { get; set; }
            public string file_Name { get; set; }
            public string fileApprove_Name { get; set; }
            public int Accept { get; set; }
            public long EmpId { get; set; }
            public long UserId { get; set; }
            public long AttachmentId { get; set; }
            public string AcceptedDate { get; set; }
            public string Status { get; set; }

            public HttpPostedFileBase UploadAttachment { get; set; }
            public List<Declaration> declarationslist { get; set; }

        }
        public class EMP_Account
        {
            public long? AccountID { get; set; }
            public string Doctype { get; set; }
            public long EMPID { get; set; }

            public long? BankID { get; set; }
            public string BankName { get; set; }
            public AccountType AccountType { get; set; }
            public string AccountName { get; set; }
            public string AccountNo { get; set; }
            public string BranchName { get; set; }
            public string BranchAddress { get; set; }
            public string IFSCCode { get; set; }
            public string SwiftCode { get; set; }
            public string OtherDetails { get; set; }
            public int? Priority { get; set; }
            public long LoginID { get; set; }
            public string IPAddress { get; set; }
            public string AccountTypeNew { get; set; }
            public long HRVBankId { get; set; }
            public long HRAccountType { get; set; }
            public long HRAccountName { get; set; }
            public long HRVAccountNo { get; set; }
            public long HRVBranchName { get; set; }
            public long HRVBranchAddress { get; set; }
            public long HRVIFSCCode { get; set; }
            public long HRVSwiftCode { get; set; }
            public long HRVOtherDetails { get; set; }
            public string LockStatus { get; set; }
            public long MUID { get; set; }
        }

        public class UserDetails
        {
            public long? ID { get; set; }
            public string user_name { get; set; }
            public string Name { get; set; }
            public string email { get; set; }
            public string password { get; set; }
            public long? RoleID { get; set; }
            public int? Priority { get; set; }
            public bool IsActive { get; set; }
        }

        public class Qualification
        {
            public long? QID { get; set; }

            public long? EMPID { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Course { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string University { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Location { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Year { get; set; }
            public int? Priority { get; set; }
            public bool IsActive { get; set; }
            public long HRVQualification { get; set; }
            public string LockStatus { get; set; }
        }
        public class References
        {
            public long? REFID { get; set; }
            public long? EMPID { get; set; }
            public string Doctype { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Name { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            [EmailAddress]
            public string EmailID { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Mobile { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string Relationship { get; set; }
            public int? Priority { get; set; }
            public bool IsActive { get; set; }
        }


        public class EmploymentDetails
        {

            public long? ID { get; set; }
            public long? EMPID { get; set; }

            public string CompanyName { get; set; }

            public string Designation { get; set; }

            public string Location { get; set; }
            public string EmploymentTerm { get; set; }

            public string DOJ { get; set; }

            public string DOR { get; set; }
            public string ShareSomething { get; set; }


            public decimal? AnnualCTC { get; set; }
            public int? TotalExperence { get; set; }
            public decimal? IncomeAmount { get; set; }
            public decimal? TDSDeduction { get; set; }


            public string IsConsiderIncome { get; set; }
            public int? Priority { get; set; }

        }

        public class AirlinePreferences
        {
            public long? AirID { get; set; }
            public long? EMPID { get; set; }



            public string AirlineName { get; set; }


            public string FlyerNumber { get; set; }
            public int? Priority { get; set; }
            public bool IsActive { get; set; }
            public long HRVFlyer { get; set; }



        }

        public class EMPAttachments
        {
            public string Chk { get; set; }
            public long? EAttachID { get; set; }
            public int EMPID { get; set; }
            public int IsOpted { get; set; }
            public string No { get; set; }
            public string Name { get; set; }
            public string OfficialName { get; set; }
            public string Remarks { get; set; }
            public string UploadRemarks { get; set; }
            public string IssueDate { get; set; }
            public string ExpiryDate { get; set; }
            public string PlaceOfIssue { get; set; }
            public int? Priority { get; set; }
            public long? AttachmentID { get; set; }
            public string AttachmentURL { get; set; }
            public HttpPostedFileBase Upload { get; set; }
            public long? OPFId { get; set; }
            public long? PIOId { get; set; }
            public long? PTaxId { get; set; }
        }

        public class EMPInsurance
        {
            public long? InsuranceID { get; set; }
            public long? EMPID { get; set; }
            public string InsuranceType { get; set; }
            public string Provider { get; set; }
            public string PolicyNo { get; set; }
            public string TPA { get; set; }
            public string TPAContactDetail { get; set; }
            public decimal? CoverageAmt { get; set; }
            public string StartDate { get; set; }
            public string RenewalDate { get; set; }
            public int? Priority { get; set; }
        }


        public class EMPAddress
        {
            public int RowNum { get; set; }
            public long? ID { get; set; }
            public long? TableID { get; set; }
            public string TableName { get; set; }
            public string Doctype { get; set; }

            public string lane1 { get; set; }
            public string lane2 { get; set; }

            public long? CountryID { get; set; }

            public long? StateID { get; set; }

            public long? CityID { get; set; }
            public string country_Name { get; set; }
            public string state_Name { get; set; }
            public string city_Name { get; set; }
            public long HRVlane1 { get; set; }
            public long HRVlane2 { get; set; }
            public long HRVzip_code { get; set; }
            public long HRVCountryID { get; set; }
            public long HRVStateID { get; set; }
            public long HRVCityID { get; set; }
            public long HRVphone_no { get; set; }
            public string LockStatus { get; set; }

            [Required(ErrorMessage = "Hey! You missed this field.")]
            [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid phone number")]
            public string phone_no { get; set; }
            [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$", ErrorMessage = "Not a valid phone number")]
            public string Alt_No { get; set; }
            public string LandlineNo { get; set; }
            public string EmailID { get; set; }
            public string zip_code { get; set; }
            public string fax { get; set; }
            public string cell { get; set; }
            public bool IsActive { get; set; }
            public int? Priority { get; set; }
        }
        public class LeaveBalance
        {
            public long ID { get; set; }
            public long srno { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public long leave_id { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string opening { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string allotted { get; set; }
            [Required(ErrorMessage = "Hey! You missed this field.")]
            public string start_date { get; set; }
            public long emp_id { get; set; }
            public List<LeaveBalanceList> lstLeaveBalanceDet { get; set; }
            public List<DropDownList> lstLeaveMaster { get; set; }
        }
        public class LeaveBalanceList
        {
            public int RowNum { get; set; }
            public long emp_id { get; set; }
            public long srno { get; set; }
            public string ID { get; set; }
            public string leave_id { get; set; }
            public string type { get; set; }
            public string opening { get; set; }
            public string allotted { get; set; }
            public string start_date { get; set; }
            public string leave_name { get; set; }
        }

        public class PersonalDetailsnew
        {
            public EMPAddress LocalAddress { get; set; }
            public EMPAddress PermanentAddress { get; set; }
            public Medical Medical { get; set; }
            public Personal Personal { get; set; }
            public List<Qualification> QualificationList { get; set; }
        }
        public class Personal
        {
            public string SpouseName { get; set; }
            public string PartnerName { get; set; }
            public string NomineeName { get; set; }
            public string NomineeRelation { get; set; }
            public long children { get; set; }
            public MaritalStatus? marital_status { get; set; }
            public Gender? gender { get; set; }
            public string marital_statusnew { get; set; }
            public string gendernew { get; set; }
            public long HRVGender { get; set; }
            public long HRVMartialStatus { get; set; }
            public long HRVSpouseName { get; set; }
            public long HRVParterName { get; set; }
            public long HRVNomineeName { get; set; }
            public long HRVNomineeRelation { get; set; }
            public long HRVChildren { get; set; }
            public long MUID { get; set; }
        }
        public class Medical
        {
            public string AnyMedicalCondition { get; set; }
            public string PhysicianName { get; set; }
            public string PhysicianNumber { get; set; }
            public string PhysicianAlternate_No { get; set; }
            public string emergContact_no { get; set; }
            public string emergContact_Name { get; set; }
            public string emergContact_Relation { get; set; }
            public string Bloodgroup { get; set; }
            public string SpecialAbility { get; set; }
            public long HRVSpecialAbility { get; set; }
            public long HRVAnyMedicalCondition { get; set; }
            public long HRVPhysicianName { get; set; }
            public long HRVBloodgroup { get; set; }
            public long HRVPhysicianNumber { get; set; }
            public long HRVPhysicianAlternate_No { get; set; }
            public long HRVemergContact_Name { get; set; }
            public long HRVemergContact_no { get; set; }
            public long HRVemergContact_Relation { get; set; }
        }
        public class IDInfoOld
        {
            public string PFnumber { get; set; }
            public string PIO { get; set; }
            public string PIOName { get; set; }
            public string Remarks { get; set; }
            public decimal Ammount { get; set; }
        }
        public class IDInfoNew
        {
            public long EMPId { get; set; }
            public string VoterId { get; set; }
            public long HRVVoterId { get; set; }
            public string PassportNo { get; set; }
            public string PassportName { get; set; }
            public string PlaceOfIssue { get; set; }
            public string PassportExpiryDate { get; set; }
            public long HRVPassportNo { get; set; }
            public long HRVPassportName { get; set; }
            public long HRVPlaceOfIssue { get; set; }
            public long HRVPassportExpiryDate { get; set; }
            public string DlNo { get; set; }
            public string DlName { get; set; }
            public string DlPlaceOfIssue { get; set; }
            public string DlExpiryDate { get; set; }
            public string IssueDate { get; set; }
            public string DlRemark { get; set; }
            public long HRVDlno { get; set; }
            public long HRVDlPlaceOfIssue { get; set; }

            public long HRVDlExpiryDate { get; set; }
            public long HRVDlName { get; set; }
            public long HRVDlRemark { get; set; }
            public string DIN { get; set; }
            public string NameonDIN { get; set; }
            public long HRVDIN { get; set; }
            public long HRVNameonDIN { get; set; }
            public long MUID { get; set; }
            public long HRVIssueDate { get; set; }

        }

        public class IdInfoAll
        {
            public IDInfoOld iDInfoOld { get; set; }
            public IDInfoNew iDInfoNew { get; set; }
        }
        public class PersonalUpdateAll
        {
            public PersonalDetailsnew PersonalDetailsnew { get; set; }
            public PersonalDetails PersonalDetails { get; set; }
        }

        public class RegistrationDetailsIOS
        {
            public long Id { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            //[MinLength(4, ErrorMessage = "The  name field must be at least 6 characters long")]
            public string EmployeeName { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string Mobile { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string CompanyName { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string DOB { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string Address { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string ZipCode { get; set; }
            //[Required(ErrorMessage = "Hey! You missed this field.")]
            public string EMail { get; set; }
            public string Status { get; set; }
            
        }

        public class PreRegistrationDetails
        {
            public UserMan.Add AddUser { get; set; }
            public Employee.RegistrationDetails RegistrationDet { get; set; }
        }
        public class OfficePolicy
        {
            public int ID { get; set; }
            public string DocumentName { get; set; }
            public int Priority { get; set; }
            public int IsActive { get; set; }
            public string ActualFileName { get; set; }
            public string NewFileName { get; set; }
            public string FileUrl { get; set; }
        }
    }
}


