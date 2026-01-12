using BOERP.Web.Bussiness.Interface;
using Sahaj.API.DAL;
using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace BOERP.Web.Bussiness.BLL
{
    public class ManageTaskBLL : IManageTask
    {
        public CustomResponseModel PerformOperation(string globalXml, string screenId, int roleId, int userid, string operation, out string errorMessage)
        {
            errorMessage = string.Empty;
            CustomResponseModel objResponse = new CustomResponseModel();

            try
            {

                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(screenId, roleId, operation, out errorMessage);
                int validateResult = 0;
                if (string.IsNullOrEmpty(errorMessage))
                {
                    DataSet ds = new DataSet();
                    string commandText = objScreenDBMappingModel.ProcNameAdd;

                    SqlParameter[] param = new SqlParameter[4];
                    param[0] = new SqlParameter("@UserID", userid);
                    param[1] = new SqlParameter("@xmlData", globalXml);
                    param[2] = new SqlParameter("@validationResult", SqlDbType.Int)
                    {
                        Value = validateResult,
                        Direction = ParameterDirection.Output
                    };
                    param[3] = new SqlParameter("@errorText", SqlDbType.VarChar, 5000)
                    {
                        Value = "",
                        Direction = ParameterDirection.Output
                    };
                    ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                    errorMessage = Convert.ToString(param[3].Value.ToString());
                    validateResult = param[2].Value.ToString() == "" ? 0 : Convert.ToInt32(param[2].Value.ToString());
                    objResponse.ValidationInput = validateResult;
                    objResponse.ErrorMessage = errorMessage;
                    objResponse.data = ds;
                    objResponse.CustomMessage = errorMessage;
                    objResponse.IsSuccessStatusCode = true;
                    objResponse.CustumException = null;
                    return objResponse;

                }
                else
                {
                    objResponse.ValidationInput = validateResult;
                    objResponse.ErrorMessage = errorMessage;
                    objResponse.CustomMessage = errorMessage;
                    objResponse.data = null;
                    objResponse.IsSuccessStatusCode = true;
                    objResponse.CustumException = null;
                    return objResponse;
                }
            }

            catch (SqlException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
        /// <summary>
        /// This is common method to get record from databasde based on the input parameter
        /// </summary>
        /// <param name="globalXml"></param>
        /// <param name="screenId"></param>
        /// <param name="roleId"></param>
        /// <param name="userid"></param>
        /// <param name="operation"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public CustomResponseModel GetRecords(string globalXml, string screenId, int roleId, int userid, string operation, out string errorMessage)
        {
            errorMessage = string.Empty;
            CustomResponseModel objResponse = new CustomResponseModel();
            DataSet ds = new DataSet();

            try
            {
                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(screenId, roleId, operation, out errorMessage);
                int validateResult = 0;
                if (string.IsNullOrEmpty(errorMessage))
                {

                    string commandText = objScreenDBMappingModel.ProcNameGet;

                    SqlParameter[] param = new SqlParameter[4];
                    param[0] = new SqlParameter("@UserID", userid);
                    param[1] = new SqlParameter("@xmlData", globalXml);

                    param[2] = new SqlParameter("@validationResult", SqlDbType.Int)
                    {
                        Value = validateResult,
                        Direction = ParameterDirection.Output
                    };

                    param[3] = new SqlParameter("@errorText", SqlDbType.VarChar, 5000)
                    {
                        Value = "",
                        Direction = ParameterDirection.Output
                    };
                    ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                    errorMessage = Convert.ToString(param[3].Value.ToString());
                    validateResult = param[2].ToString() == "" ? 0 : Convert.ToInt32(param[2].Value.ToString());
                    objResponse.ValidationInput = validateResult;
                    objResponse.ErrorMessage = errorMessage;
                    objResponse.CustomMessage = errorMessage;
                    objResponse.data = ds;
                    objResponse.IsSuccessStatusCode = true;
                    objResponse.CustumException = null;
                    return objResponse;

                }
                else
                {
                    objResponse.ValidationInput = validateResult;
                    objResponse.ErrorMessage = errorMessage;
                    objResponse.CustomMessage = errorMessage;
                    objResponse.data = null;
                    objResponse.IsSuccessStatusCode = true;
                    objResponse.CustumException = null;
                    return objResponse;
                }

            }
            catch (SqlException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        /// <summary>
        /// This method is used to get the SP name based on screen Id
        /// </summary>
        /// <param name="screenId"></param>
        /// <param name="roleId"></param>
        /// <param name="operation"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public ScreenDBMappingModel GetScreenSP(string screenId, int roleId, string operation, out string errorMessage)
        {
            DataSet ds = new DataSet();

            try
            {
                string commandText = "sp_TMS_GetScreenSP";
                SqlParameter[] param = new SqlParameter[5];

                param[0] = new SqlParameter("@RoleID", roleId);
                param[1] = new SqlParameter("@Token", "");
                param[2] = new SqlParameter("@ScreenId", screenId);
                param[3] = new SqlParameter("@Operation", operation);
                param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 5000);
                param[4].Value = "";
                param[4].Direction = ParameterDirection.Output;

                ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);

                errorMessage = Convert.ToString(param[4].Value.ToString());

                var actDetails = ds.Tables[0].AsEnumerable()

                   .Select(dataRow => new ScreenDBMappingModel
                   {
                       ProcNameAdd = dataRow.Field<string>("ProcNameOperation"),
                       ProcNameGet = dataRow.Field<string>("ProcNameGet")
                     

                   }).ToList();

                if (actDetails.Count > 0)
                    return actDetails[0];
                else
                    return null;
            }
            catch (SqlException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }
        /// <summary>
        /// This is common method to bind the dropdown
        /// </summary>
        /// <param name="masterTableTypeId"></param>
        /// <param name="customDropdown"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public CustomResponseModel GetDropDown(int masterTableTypeId, int? parentId, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId)
        {
            DataSet ds = new DataSet();
            CustomResponseModel objResponse = new CustomResponseModel();


            try
            {

                string commandText = "sp_TMS_GetDropdownData";
                SqlParameter[] param = new SqlParameter[6];

                param[0] = new SqlParameter("@MasterTableTypeId", masterTableTypeId);
                if (parentId != null)
                {
                    param[1] = new SqlParameter("@ParentId", parentId);
                }
                else
                {
                    param[1] = new SqlParameter("@ParentId", DBNull.Value);
                }

                param[2] = new SqlParameter("@IsMasterTableType", isMasterTableType);

                param[3] = new SqlParameter("@IsManualTable", isManualTable);

                param[4] = new SqlParameter("@ManualTable", manualTable);

                param[5] = new SqlParameter("@ManualTableId", manualTableId);

                ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);



                var record = ds.Tables[0].AsEnumerable()

                   .Select(dataRow => new DropdownModel
                   {
                       ID = Convert.ToString(dataRow.Field<int>("ID")),
                       ValueName = dataRow.Field<string>("ValueName"),
                       ValueCode = dataRow.Field<string>("ValueCode")

                   }).ToList();

                objResponse.ValidationInput = 0;
                objResponse.ErrorMessage = "";
                objResponse.data = ds;
                objResponse.CustomMessage = "";
                objResponse.IsSuccessStatusCode = true;
                objResponse.CustumException = null;
                objResponse.CommomDropDownData = record;
                return objResponse;

            }
            catch (SqlException ex)
            {
                throw ex;
            }
            catch (Exception ex)
            {

                throw ex;
            }


        }
    }
}