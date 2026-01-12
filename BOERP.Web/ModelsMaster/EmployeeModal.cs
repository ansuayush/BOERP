using Dapper;
using SahajFramework.CommonClass;
using SahajFramework.Models;
using SahajFramework.ModelsMasterHelper;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
namespace SahajFramework.ModelsMaster
{
    public class EmployeeModal : IEmployeeHelper
    {



    


        public Dashboard.DashboardList GetDashboardEmpInfo()
        {
            Dashboard.DashboardList result = new Dashboard.DashboardList();
            try
            {
                using (IDbConnection DBContext = new SqlConnection(ClsCommon.connectionstring()))
                {
                    var param = new DynamicParameters();
                    param.Add("@LoginID", dbType: DbType.Int32, value: clsApplicationSetting.GetSessionValue("LoginID"), direction: ParameterDirection.Input);
                    DBContext.Open();
                    using (var reader = DBContext.QueryMultiple("spu_GetEmpDashboardInfo", param: param, commandType: CommandType.StoredProcedure))
                    {
                        if (!reader.IsConsumed)
                        {
                            result.LeaveDashBoard = reader.Read<Dashboard.LeaveDashBoard>().ToList();
                        }
                        if (!reader.IsConsumed)
                        {
                            result.TravelDashBoard = reader.Read<Dashboard.TravelDashBoard>().ToList();
                        }
                        if (!reader.IsConsumed)
                        {
                            result.BirthdayDashBoard = reader.Read<Dashboard.BirthdayDashBoard>().ToList();
                        }
                        if (!reader.IsConsumed)
                        {
                            result.NewJoineesDashBoard = reader.Read<Dashboard.NewJoineesDashBoard>().ToList();

                        }
                        if (!reader.IsConsumed)
                        {
                            result.WorkanniversaryDashBoard = reader.Read<Dashboard.WorkanniversaryDashBoard>().ToList();
                        }

                    }
                    DBContext.Close();
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetLead. The query was executed :", ex.ToString(), "spu_GetTrainingWorkshopSeminar()", "BudgetMasterModal", "BudgetMasterModal", "");

            }
            return result;
        }

     
    }
}