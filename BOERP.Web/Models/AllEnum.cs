using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace SahajFramework.Models
{
    public class AllEnum
    {
       
        public enum Nationality
        {
            [Display(Name = "Indian")]
            Indian,
            [Display(Name = "Foreigner")]
            Foreigner,
        }

       
        public enum EMPStatus
        {
            [Display(Name = "Confirmed")]
            Confirmed,
            [Display(Name = "On Probation")]
            OnProbation,
            [Display(Name = "On Extended Probation")]
            ProbationExtended,
        }
     
        public enum ResidenceType
        {
            [Display(Name = "Resident")]
            Resident,
            [Display(Name = "Non Resident")]
            NonResident,
        }

        public enum EMP_OT
        {
            [Display(Name = "Not Applicable")]
            NA,
            [Display(Name = "Compensatory Off")]
            CompensatoryOff,
            [Display(Name = "Overtime")]
            Overtime,
        }
     
        public enum YesNo
        {
            [Display(Name = "No")]
            No,
            [Display(Name = "Yes")]
            Yes
            
        }
   
        public enum Target
        {
            [Display(Name = "_self")]
            _self,
            [Display(Name = "_blank")]
            _blank
        }

        //public enum MaritalStatus
        //{
        //    [Display(Name = "Single")]
        //    Single,
        //    [Display(Name = "Married")]
        //    Married,
        //    [Display(Name = "Partner")]
        //    Partner,
        //    [Display(Name = "Divorced")]
        //    Divorced,
        //    [Display(Name = "Widower")]
        //    Widower
        //}
        public enum MaritalStatus
        {
            [Display(Name = "Single")]
            Single,
            [Display(Name = "Married")]
            Married,
            [Display(Name = "Partner")]
            Partner,
            [Display(Name = "Divorced")]
            Divorced,
            [Display(Name = "Widower")]
            Widower,
            [Display(Name = "Widow")]
            Widow
        }
        public enum Gender
        {
            [Display(Name = "Male")]
            Male,
            [Display(Name = "Female")]
            Female,
            [Display(Name = "Others")]
            Others
        }

        public enum Metropolitan
        {
            [Display(Name = "Metro")]
            Metro,
            [Display(Name = "Non Metro")]
            NonMetro,
        }
        public enum MitrNonMitr
        {
            [Display(Name = "Generic")]
            Generic,
            [Display(Name = "Non Generic")]
            NonMitr,
        }
        public enum EmploymentTerm
        {
            [Display(Name = "Term Base")]
            TermBase,
            [Display(Name = "Core Base")]
            CoreBase,
        }
        public enum BloodGroup
        {
            [Display(Name = "O+")]
            OPositive,
            [Display(Name = "A+")]
            APositive,
            [Display(Name = "B+")]
            BPositive,
            [Display(Name = "AB+")]
            ABPositive,
            [Display(Name = "AB-")]
            ABNegative,
            [Display(Name = "A-")]
            ANegative,
            [Display(Name = "B-")]
            BNegative,
            [Display(Name = "O-")]
            ONegative

        }
      
        public enum Paymode
        {
            [Display(Name = "Bank Transfer")]
            BankTransfer,

            [Display(Name = "NEFT")]
            NEFT,
            [Display(Name = "UPI")]
            UPI,

            [Display(Name = "Cheque")]
            Cheque,
        }

        public enum AccountType
        {
            [Display(Name = "Current")]
            Current,

            [Display(Name = "Saving")]
            Saving
        }
        public enum ProspectType
        {
            [Display(Name ="UHNI")]
            UHNI,
            [Display(Name = "CSR")]
            CSR
        }
        public enum SS_CalculationType
        {
            [Display(Name = "Formula")]
            Formula,
            [Display(Name = "Amount")]
            Amount,
            [Display(Name = "Manual")]
            Manual,
        }
        public enum Other_BudgetType
        {
            [Display(Name = "Other Direct Cost")]
            OtherDirectCost,
            [Display(Name = "Other")]
            Other,
            
        }

        public enum Module_BudgetType
        {
            [Display(Name = "Training")]
            Training,
            [Display(Name = "Workshop")]
            Workshop,

        }
        public enum Module_BudgetTypeUnit
        {
            [Display(Name = "Per Event")]
            PerEvent,
            [Display(Name = "Per Day")]
            PerDay,
            [Display(Name = "Per Person")]
            PerPerson,
            [Display(Name = " Per Person Per Day")]
            PerPersonPerDay,
           
        }
        public enum Budget_Choose
        {
            [Display(Name = "Standalone Budget ")]
            StandaloneBudget,
            [Display(Name = "RFP Budget ")]
            RFPBudget,
            [Display(Name = "Budget ")]
            Budget,


        }
        public enum Budget_Ledger
        {
            [Display(Name = "Salary ")]
            Salary,
            [Display(Name = "Travel ")]
            Travel,
            [Display(Name = "Meeting ")]
            Meeting,
            [Display(Name = "Training ")]
            Training,
            [Display(Name = "Consultant ")]
            Consultant,


        }
    }

    public class DropDownList
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string ExtraValue { get; set; }
    }

}