using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOERP.Web.Bussiness.CommonLib
{
    public static class ApplicationConstants
    {
        #region TaskMaster Constants
        public enum TaskMasterConstants
        {
            TaskMasterData = 100,

                TaskMasterReport = 124
        }
        #endregion

        #region EmployeeDetail Constants
        public enum EmployeeDetailConstants
        {
            EmployeeData = 101,
            BranchData = 106,
            DepartmentData = 107,
            StateData = 108,
            DesignData = 109,
            HolidayData = 110,
            AttendanceData = 111,
            FinancialYearData = 112,
            EmployeeDashboardData = 113,
            DashboardData = 114,
            OTPLogin = 115,
            RoleData = 116,
            LoginMenuAccess = 117,
            UserPermission = 118,
            GEtExistingRoles = 119,
        }
        #endregion

        #region Doer Screen Constants
        public enum DoerScreenConstants
        {
            DoerData = 102,
            PcData = 103,
            DoerAuditData = 104,
            DoerReattemptData = 105,
        }
        #endregion

        #region Delegation Screen constants
        public enum DelegationScreenConstants
        {
            DelegationData = 120,
            MyDelegationData = 121,
            AuditDelegationData = 122,
            DelegationDashboardData = 123,
        }
        #endregion

        #region FMS Constants
        public enum FMS
        {
            Master_ConfigData = 125,
            MasterDataEntry = 126,
            FieldMaster = 127,
            FMSMaster = 128,

        }
        #endregion
    }
}
