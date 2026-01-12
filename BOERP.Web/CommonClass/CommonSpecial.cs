using SahajFramework.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace SahajFramework.CommonClass
{
    public class CommonSpecial
    {

        public static int fnGetTotalMonthHours(int EMPID, DateTime dtMonth, DateTime DateofJoining, DateTime DateofLeaving)
        {
            int RetValue = 0;
            try
            {
                DateTime dtJoiningDate = DateofJoining;
                DateTime dtSMFDate = Convert.ToDateTime("1/" + dtMonth.Month + "/" + dtMonth.Year);
                DateTime dtSMEDate = dtSMFDate.AddMonths(1).AddDays(-1);
                int iWDays = dtSMEDate.Day;
                int iTotDays = dtSMEDate.Day;
                DateTime dtdate;
                int iOffDays = 0;
                bool bJMonth = false;
                bool bRMonth = false;
                DateTime dtResignDate = DateofLeaving;
                if (dtSMEDate < dtJoiningDate)
                {
                }
                else if (dtSMEDate.Month == dtJoiningDate.Month & dtSMEDate.Year == dtJoiningDate.Year)
                {
                    iWDays = iWDays - (dtJoiningDate.Day - 1);
                    bJMonth = true;
                }
                else if (dtSMEDate.Month == dtResignDate.Month & dtSMEDate.Year == dtResignDate.Year)
                {
                    iWDays = dtResignDate.Day;
                    bRMonth = true;
                }
                for (int i = 1; i <= iTotDays; i++)
                {
                    dtdate = Convert.ToDateTime(i + "/" + dtMonth.Month + "/" + dtMonth.Year);
                    string sDay = dtdate.ToString("ddd");
                    if (sDay == "Sun" | sDay == "Sat")
                    {
                        if (bJMonth == true & dtdate.Day < dtJoiningDate.Day)
                        {
                        }
                        else if (bRMonth == true & dtdate.Day > dtResignDate.Day)
                        {
                        }
                        else
                            iOffDays = iOffDays + 1;
                    }
                }
                iWDays = iWDays - iOffDays;
                int inpl = 0;
                int.TryParse(clsDataBaseHelper.ExecuteSingleResult("select npl_hours from timesheet_log where emp_id=" + EMPID + " and isdeleted=0 and month=" + dtMonth.Month + " and year=" + dtMonth.Year + ""), out inpl);

                RetValue = (iWDays * 8) - inpl;
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during fnGetTotalMonthHours. The query was executed :", ex.ToString(), "", "CommonSpecial", "CommonSpecial", "");
            }
            return RetValue;
        }


        public static double fnGetBonusAmt(int lEmpID, int FinancialYearID)
        {
            double dBonus = 0;
            try
            {

                DataSet dsFin = clsDataBaseHelper.ExecuteDataSet("select * from finyear where isdeleted=0 and id=" + FinancialYearID + "");
                if (dsFin.Tables[0].Rows.Count > 0)
                {
                    DateTime dtFDate, dtTDate, dtJoiningDate, dtResignDate;
                    DateTime.TryParse(dsFin.Tables[0].Rows[0]["from_date"].ToString(), out dtFDate);
                    DateTime.TryParse(dsFin.Tables[0].Rows[0]["to_date"].ToString(), out dtTDate);

                    DateTime.TryParse(clsDataBaseHelper.ExecuteSingleResult("select doj from master_emp where id=" + lEmpID), out dtJoiningDate);
                    DateTime.TryParse(clsDataBaseHelper.ExecuteSingleResult("select dor from master_emp where id=" + lEmpID), out dtResignDate);


                    DateTime dtEffDate;
                    double dLICAmt = 0;
                    DataSet ds = clsDataBaseHelper.ExecuteDataSet("select * from emp_salary where isdeleted=0 and emp_id=" + lEmpID + " and doc_date between '" + dtFDate.ToString("dd/MMM/yyyy") + "' and '" + dtTDate.ToString("dd/MMM/yyyy") + "' order by doc_date");
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        DateTime.TryParse(ds.Tables[0].Rows[0]["doc_date"].ToString(), out dtEffDate);
                        double.TryParse(ds.Tables[0].Rows[0]["lic_amt"].ToString(), out dLICAmt);

                    }
                    else
                    {
                        ds = clsDataBaseHelper.ExecuteDataSet("select * from emp_salary where isdeleted=0 and id in(select max(id) from emp_salary where isdeleted=0 and emp_id=" + lEmpID + ")");
                        if (ds.Tables[0].Rows.Count > 0)
                        {
                            DateTime.TryParse(ds.Tables[0].Rows[0]["doc_date"].ToString(), out dtEffDate);
                            double.TryParse(ds.Tables[0].Rows[0]["lic_amt"].ToString(), out dLICAmt);

                        }
                    }
                    if (dtFDate <= dtJoiningDate)
                        dtFDate = dtJoiningDate;
                    double dTotSalAmt = 0;
                    double dSalAmt = 0;
                    DataTable dt = new DataTable();
                    DataRow dr = null/* TODO Change to default(_) if this is not a reference type */;
                    dt.Columns.Add(new DataColumn("Month", typeof(string)));
                    dt.Columns.Add(new DataColumn("total_hours", typeof(double)));
                    dt.Columns.Add(new DataColumn("hourly_rate", typeof(double)));
                    dt.Columns.Add(new DataColumn("TotalAmt", typeof(double)));

                    bool bRegin = false;
                    if (dtResignDate.Year > 1900)
                        bRegin = true;
                    DateTime dtMonth = dtFDate;
                    if (dtJoiningDate > dtMonth)
                        dtMonth = dtJoiningDate;
                    int iTotHours = fnGetTotalMonthHours(lEmpID, dtMonth, dtJoiningDate, dtResignDate);
                    double dHourRate = 0;
                    string SQL = "select hourly_rate from emp_salary where emp_id=" + lEmpID + "  and isdeleted=0" +
                        " and id in(select max(id) from emp_salary where isdeleted=0 and emp_id=" + lEmpID + " and doc_date<='" + dtMonth.ToString("dd/MMM/yyyy") + "')";
                    double.TryParse(clsDataBaseHelper.ExecuteSingleResult(SQL), out dHourRate);

                    for (int iCount = 1; iCount <= 12; iCount++)
                    {
                        dr = dt.NewRow();
                        dr["Month"] = dtMonth.ToString("MMM/yyyy");
                        dr["total_hours"] = iTotHours;
                        dr["hourly_rate"] = dHourRate;
                        dSalAmt = Math.Round(dHourRate * iTotHours, 0, MidpointRounding.AwayFromZero);
                        dr["Totalamt"] = dSalAmt; // Math.Round(dHourRate * iTotHours, 2)
                        dTotSalAmt = dTotSalAmt + dSalAmt;
                        dt.Rows.Add(dr);
                        dtMonth = dtMonth.AddMonths(1);
                        if (dtMonth > dtTDate | bRegin == true & dtMonth > dtResignDate)
                            break;
                        iTotHours = fnGetTotalMonthHours(lEmpID, dtMonth, dtJoiningDate, dtResignDate);
                        SQL = "select hourly_rate  from emp_salary where emp_id=" + lEmpID + "" +
                            "and isdeleted=0 and id in(select max(id) from emp_salary where isdeleted=0 and emp_id=" + lEmpID + " and doc_date<='" + dtMonth.ToString("dd/MMM/yyyy") + "')";

                        double.TryParse(clsDataBaseHelper.ExecuteSingleResult(SQL), out dHourRate);
                    }
                    double dSalary = dTotSalAmt;
                    dBonus = Math.Round(dSalary * 0.0833, MidpointRounding.AwayFromZero);
                }

            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during fnGetTotalMonthHours. The query was executed :", ex.ToString(), "", "CommonSpecial", "CommonSpecial", "");
            }
            return dBonus;
        }


        public static List<MiscEmployee> GetEmployeeCompensatoryOFF()
        {
            List<MiscEmployee> List = new List<MiscEmployee>();
            DataSet TempModuleDataSet = new DataSet();
            MiscEmployee Obj = new MiscEmployee();
            string SQL = "";

            try
            {


                SQL = @"SELECT id,emp_name + ' (' + emp_code + ')' AS empName 
                                          FROM master_emp WHERE ISDELETED=0 and co_ot<>'Overtime' 
                                        and cast(hod_name as int)=" + clsApplicationSetting.GetSessionValue("EMPID") + " ";

                TempModuleDataSet = clsDataBaseHelper.ExecuteDataSet(SQL);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscEmployee();
                    Obj.EMPID = Convert.ToInt32(item["ID"]);
                    Obj.EMPName = item["empName"].ToString();
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetEmployeeCompensatoryOFF. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;

        }



        public static List<MiscEmployee> GetEmployeeOvertime()
        {
            List<MiscEmployee> List = new List<MiscEmployee>();
            DataSet TempModuleDataSet = new DataSet();
            MiscEmployee Obj = new MiscEmployee();
            string SQL = "";

            try
            {
                SQL = @"SELECT id,emp_name + ' (' + emp_code + ')' AS empName FROM master_emp WHERE ISDELETED=0 and co_ot='Overtime' 
                        and cast(hod_name as int)=" + clsApplicationSetting.GetSessionValue("EMPID") + " ";
                TempModuleDataSet = clsDataBaseHelper.ExecuteDataSet(SQL);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscEmployee();
                    Obj.EMPID = Convert.ToInt32(item["ID"]);
                    Obj.EMPName = item["empName"].ToString();
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetEmployeeOvertime. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;

        }
        public static List<MiscUserman> GetUsermanList(string WantCurrentUserInList = "N")
        {
            List<MiscUserman> List = new List<MiscUserman>();
            DataSet TempModuleDataSet = new DataSet();
            MiscUserman Obj = new MiscUserman();
            string SQL = "";
            try
            {
                TempModuleDataSet = Common_SPU.fnGetUserman(0, WantCurrentUserInList);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscUserman();
                    Obj.LoginID = Convert.ToInt32(item["ID"]);
                    Obj.EMPName = item["empname"].ToString();
                    Obj.EMPCode = item["EMPCode"].ToString();
                    Obj.EMPID = Convert.ToInt32(item["EMPID"]);
                    Obj.EMPNameCode = item["EMPNameCode"].ToString();
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetUsermanList. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;


        }

        public static List<MiscEmployee> GetAllEmployeeList()
        {
            List<MiscEmployee> List = new List<MiscEmployee>();
            DataSet TempModuleDataSet = new DataSet();
            MiscEmployee Obj = new MiscEmployee();
            string SQL = "";

            try
            {
                SQL = @"select id,emp_name,emp_code,email  from master_emp where isdeleted=0";
                TempModuleDataSet = clsDataBaseHelper.ExecuteDataSet(SQL);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscEmployee();
                    Obj.EMPID = Convert.ToInt32(item["ID"]);
                    Obj.EMPName = item["emp_name"].ToString();
                    Obj.EMPCode = item["emp_code"].ToString();
                    Obj.Email = item["email"].ToString();
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetEmployeeOvertime. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;

        }

        public static List<MiscEmployee> GetAllEmployeeOfficeList()
        {
            List<MiscEmployee> List = new List<MiscEmployee>();
            DataSet TempModuleDataSet = new DataSet();
            MiscEmployee Obj = new MiscEmployee();
            string SQL = "";

            try
            {
                SQL = @"select id,emp_name,emp_code,email  from master_emp where isdeleted=0 and Year(MASTER_EMP.lastworking_day)=1900";
                TempModuleDataSet = clsDataBaseHelper.ExecuteDataSet(SQL);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscEmployee();
                    Obj.EMPID = Convert.ToInt32(item["ID"]);
                    Obj.EMPName = item["emp_name"].ToString();
                    Obj.EMPCode = item["emp_code"].ToString();
                    Obj.Email = item["email"].ToString();
                   // Obj.EMP = Obj.EMPName + "  (" + Obj.EMPCode + ")";
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetEmployeeOvertime. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;

        }


        public static List<MiscEmployee> GetAllEmployeeOnbehalf()
        {
            List<MiscEmployee> List = new List<MiscEmployee>();
            DataSet TempModuleDataSet = new DataSet();
            MiscEmployee Obj = new MiscEmployee();
            string SQL = "";

            try
            {
              //  SQL = @"select id,emp_name,emp_code,email  from master_emp where isdeleted=0 and Year(MASTER_EMP.lastworking_day)=1900";
                TempModuleDataSet = Common_SPU.fnGetOnbehalfEMP();
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscEmployee();
                    Obj.EMPID = Convert.ToInt32(item["ID"]);
                    Obj.EMPName = item["emp_name"].ToString();
                    Obj.EMPCode = item["emp_code"].ToString();
                    Obj.Email = item["email"].ToString();
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetEmployeeOvertime. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;

        }
        public static List<MiscLocation> GetAllLocationList()
        {
            List<MiscLocation> List = new List<MiscLocation>();
            DataSet TempModuleDataSet = new DataSet();
            MiscLocation Obj = new MiscLocation();
            string SQL = "";

            try
            {
                SQL = @"select id,Location_Name  from  master_location where isdeleted=0 and isactive=1";
                TempModuleDataSet = clsDataBaseHelper.ExecuteDataSet(SQL);
                foreach (DataRow item in TempModuleDataSet.Tables[0].Rows)
                {
                    Obj = new MiscLocation();
                    Obj.LocationID = Convert.ToInt32(item["ID"]);
                    Obj.LocationName = item["Location_Name"].ToString();
                    List.Add(Obj);
                }
            }
            catch (Exception ex)
            {
                ClsCommon.LogError("Error during GetAllLocationList. The query was executed :", ex.ToString(), SQL, "CommonSpecial", "CommonSpecial", "");
            }
            return List;

        }
      



     
    }

}