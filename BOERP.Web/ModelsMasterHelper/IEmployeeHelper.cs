using SahajFramework.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.ModelsMasterHelper
{
    interface IEmployeeHelper
    {
        //List<Employee.List> GetEmployeeList(GetResponse modal);
        //Employee.RegistrationDetails GetEmployeeRegistrationDetails(GetResponse modal);
        //Employee.PersonalDetails GetEmployeePersonalDetails(GetResponse modal);
        //Employee.GeneralInfo GetEmployeeGeneralInfo(GetResponse modal);
        //Employee.IDInfo GetEmployeeIDInfoList(GetResponse modal);
        //Employee.Attachments GetEmployeeAttachments(GetResponse modal);
        //Employee.Declaration GetEmployeeDeclaration(GetResponse modal);
        //PostResponse SetEMP_Account(Employee.EMP_Account modal);
        //PostResponse SetEMP_RegistrationDetails(Employee.RegistrationDetails modal);

        //PostResponse SetMaster_Emp_Qualification(Employee.Qualification modal);
        //PostResponse SetMaster_Emp_References(Employee.References modal);
        //PostResponse SetAddress(Address modal);
        //PostResponse SetEMP_PersonalDetails(Employee.PersonalDetails modal);
        //PostResponse SetEMP_LastEmployment(Employee.EmploymentDetails model);
        //PostResponse SetAirlinePreferences(Employee.AirlinePreferences model);
        //PostResponse SetEMP_GeneralInfo(Employee.GeneralInfo model);
        //PostResponse SetEMP_Attachments(Employee.EMPAttachments model, long AttachmentID = 0);
        //PostResponse SetEMP_Insurance(Employee.EMPInsurance model);
        //Employee.LeaveBalance GetEmployeeLeaveBalance(GetResponse model);
        //PostResponse SetEmployeeLeaveBalance(Employee.LeaveBalance modal);
        //List<Employee.List> GetEmployeeLeaveBalanceList(GetResponse modal);
        Dashboard.DashboardList GetDashboardEmpInfo();

        //List<Employee.Declaration> GetEmployeeDeclartionList(GetResponse modal);
        //List<Employee.Declaration> GetUserDeclartionList(GetResponse modal);
        //List<Employee.Declaration> GetUserDeclartionApprovedList(GetResponse modal);
        //PostResponse SetDeclarationEmployee(Employee.Declaration model);
        //List<Employee.Declaration> GetEmployeeDeclartionApprovedList(GetResponse modal);

        //List<Employee.Declaration> GetUserDeclartionList(int EmpID, int LoginID);
        //List<Employee.Declaration> GetUserDeclartionApprovedList(int EmpID, int LoginID);
     
        //List<Employee.List> GetEmployeePendingApprovedList(GetResponse modal);
        //Employee.EMP_Account GetEmployeeAccountdetailsUpdateDetails(GetResponse modal);
        //Employee.PersonalDetailsnew GetEmployeePersonalDetailsNew(GetResponse modal);
        //Employee.GeneralInfo GetEmployeeGeneralInfoFlyer(GetResponse modal);
        //Employee.IDInfoNew GetEmployeeIDInfoNew(GetResponse modal);
        //Employee.AttachmentUrl GetEmployeeAttachment(GetResponse modal);
        //Employee.GeneralInfo GetEmployeeGeneralInfoMealandSeat(GetResponse modal);
        //Employee.GeneralInfo GetEmployeeGeneralInfoMasterUpdateMealandSeat(GetResponse modal);
        //Employee.EMPAddress GetEmployeeAddressCheckLock(GetResponse modal);
        //Employee.RegistrationDetails GetMappingEmployeeRegistrationDetails(GetResponse modal);
        //Employee.PersonalDetails GetMappingEmployeePersonalDetails(GetResponse modal);
        //Employee.GeneralInfo GetMappingEmployeeGeneralInfo(GetResponse modal);
        //Employee.Attachments GetMappingEmployeeAttachments(GetResponse modal);
        //Employee.IDInfo GetMappingEmployeeIDInfoList(GetResponse modal);
        //List<Employee.List> GetEmployeeListFinalReport(GetResponse modal);
        //List<Employee.Declaration> GetOnboardingDeclartionPending(GetResponse modal);
        //List<Employee.Declaration> GetOnboardingDeclartionApprove(GetResponse modal);
        //PostResponse SetHRDeclarationEmployee(Employee.Declaration model);
        //List<Employee.Declaration> GetUserDeclartionPending(GetResponse modal);
        //List<Employee.OfficePolicy> GetOfficePoliciesListList(GetResponse modal);
    }

}