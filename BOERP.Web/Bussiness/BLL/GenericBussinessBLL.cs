
using Sahaj.API.DAL;
using Sahaj.API.Interface;
using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Configuration;// Assuming GenericReportModel is in Models folder

namespace Sahaj.API
{
    public class GenericBussinessBLL : IGeneric
    {
        public DataSet GetFormattedDataSet(DataSet ds)
        {
            //DataSet ds = GetDataFromDatabase(); // Fetch your dataset

            foreach (DataTable table in ds.Tables)
            {
                foreach (DataRow row in table.Rows)
                {
                    foreach (DataColumn column in table.Columns)
                    {
                        if (column.DataType == typeof(DateTime) && row[column] != DBNull.Value) // Check for NULL
                        {
                            DateTime dt;
                            if (DateTime.TryParse(row[column].ToString(), out dt)) // Safe parsing
                            {
                                row[column] = dt.ToUniversalTime(); // Convert to UTC
                            }
                        }
                    }
                }
            }

            return ds; // Return updated dataset
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
                string commandText = "sp_GetScreenSP";
                SqlParameter[] param = new SqlParameter[5];

                param[0] = new SqlParameter("@RoleID", roleId);
                param[1] = new SqlParameter("@Token", "");
                param[2] = new SqlParameter("@ScreenId", screenId);
                param[3] = new SqlParameter("@Operation", operation);
                param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 5000);
                param[4].Value = "";
                param[4].Direction = ParameterDirection.Output;

                ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    errorMessage = "No data found for the provided parameters.";
                    return null;
                }
                errorMessage = Convert.ToString(param[4].Value.ToString());

                var actDetails = ds.Tables[0].AsEnumerable()

                   .Select(dataRow => new ScreenDBMappingModel
                   {
                       ProcNameAdd = string.IsNullOrWhiteSpace(dataRow.Field<string>("ProcNameAdd")) ? string.Empty : dataRow.Field<string>("ProcNameAdd").Trim(),
                       ProcNameGet = string.IsNullOrWhiteSpace(dataRow.Field<string>("ProcNameGet")) ? string.Empty : dataRow.Field<string>("ProcNameGet").Trim(),
                       ProcDelete = string.IsNullOrWhiteSpace(dataRow.Field<string>("ProcDelete")) ? string.Empty : dataRow.Field<string>("ProcDelete").Trim(),
                       ProcUpdate = string.IsNullOrWhiteSpace(dataRow.Field<string>("ProcUpdate")) ? string.Empty : dataRow.Field<string>("ProcUpdate").Trim(),
                       ProcDropdown = string.IsNullOrWhiteSpace(dataRow.Field<string>("ProcDropdown")) ? string.Empty : dataRow.Field<string>("ProcDropdown").Trim()
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

                string commandText = "sp_GetDropdownData";
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

        public async Task<CustomResponseModel> GetDropDownWithAsync(int masterTableTypeId, int? parentId, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId, string ScreenId)
        {
            DataSet ds = new DataSet();
            CustomResponseModel objResponse = new CustomResponseModel();
            string errorMessage = string.Empty;
            ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(ScreenId, 1, "Get", out errorMessage);
            string commandText = objScreenDBMappingModel.ProcDropdown;
            try
            {

                // string commandText = "sp_GetDropdownData";
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

                ds = await SqlHelper.ExecuteDatasetAsync(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);



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
        /// <summary>
        /// This is common method to perform the crud operation in database based on the parameter
        /// </summary>
        /// <param name="globalXml"></param>
        /// <param name="screenId"></param>
        /// <param name="roleId"></param>
        /// <param name="userid"></param>
        /// <param name="operation"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public CustomResponseModel PerformGenericOperation(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation, out string errorMessage)
        {
            errorMessage = string.Empty;
            CustomResponseModel objResponse = new CustomResponseModel();

            try
            {
                if (userid == 0)
                {
                    throw new Exception("Invalid userid");
                }
                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(screenId, roleId, operation, out errorMessage);
                int validateResult = 0;
                if (string.IsNullOrEmpty(errorMessage))
                {
                    DataSet ds = new DataSet();

                    string commandText = string.Empty;

                    if (operation == "A" && !string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcNameAdd))
                    {
                        commandText = objScreenDBMappingModel.ProcNameAdd;
                    }
                    if (operation == "U" && !string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcUpdate))
                    {
                        commandText = objScreenDBMappingModel.ProcUpdate;
                    }
                    if (operation == "D" && !string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcDelete))
                    {
                        commandText = objScreenDBMappingModel.ProcDelete;
                    }
                    if (commandText != string.Empty)
                    {
                        SqlParameter[] param = new SqlParameter[5];
                        param[0] = new SqlParameter("@UserID", userid);
                        param[1] = new SqlParameter("@globalxmlData", globalXml);
                        param[2] = new SqlParameter("@xmlData", xml);
                        param[3] = new SqlParameter("@validationResult", SqlDbType.Int)
                        {
                            Value = validateResult,
                            Direction = ParameterDirection.Output
                        };

                        param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 8000)
                        {
                            Value = "",
                            Direction = ParameterDirection.Output
                        };

                        param[5] = new SqlParameter("@scopeID", SqlDbType.Int)
                        {
                            Value = 0,
                            Direction = ParameterDirection.Output
                        };

                        ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                        errorMessage = Convert.ToString(param[4].Value.ToString());
                        validateResult = param[3].ToString() == "" ? 0 : Convert.ToInt32(param[3].Value.ToString());
                        objResponse.ScopeID = param[5].ToString() == "" ? 0 : Convert.ToInt32(param[5].Value.ToString());

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
                        objResponse.ValidationInput = 0;
                        objResponse.ErrorMessage = "Please provide action/screen or screen is not available.";
                        objResponse.CustomMessage = "Please provide action/screen or screen is not available.";
                        objResponse.data = null;
                        objResponse.IsSuccessStatusCode = false;
                        objResponse.CustumException = "Please provide action/screen or screen is not available.";
                        return objResponse;
                    }

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
        public CustomResponseModel GetGenericRecords(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation, out string errorMessage)
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


                    string commandText = string.Empty;
                    if (!string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcNameGet))
                    {
                        commandText = objScreenDBMappingModel.ProcNameGet;
                    }

                    if (commandText != string.Empty)
                    {
                        SqlParameter[] param = new SqlParameter[5];
                        param[0] = new SqlParameter("@UserID", userid);
                        param[1] = new SqlParameter("@globalxmlData", globalXml);
                        param[2] = new SqlParameter("@xmlData", xml);
                        param[3] = new SqlParameter("@validationResult", SqlDbType.Int)
                        {
                            Value = validateResult,
                            Direction = ParameterDirection.Output
                        };

                        param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 5000)
                        {
                            Value = "",
                            Direction = ParameterDirection.Output
                        };
                        param[5] = new SqlParameter("@scopeID", SqlDbType.Int)
                        {
                            Value = 0,
                            Direction = ParameterDirection.Output
                        };
                        ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                        errorMessage = Convert.ToString(param[4].Value.ToString());
                        validateResult = param[3].ToString() == "" ? 0 : Convert.ToInt32(param[3].Value.ToString());
                        objResponse.ScopeID = param[5].ToString() == "" ? 0 : Convert.ToInt32(param[5].Value.ToString());
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
                        objResponse.ValidationInput = 0;
                        objResponse.ErrorMessage = "Please provide action/screen or screen is not available.";
                        objResponse.CustomMessage = "Please provide action/screen or screen is not available.";
                        objResponse.data = null;
                        objResponse.IsSuccessStatusCode = false;
                        objResponse.CustumException = "Please provide action/screen or screen is not available.";
                        return objResponse;
                    }
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
        /// This is common method to perform the crud operation in database based on the parameter
        /// </summary>
        /// <param name="globalXml"></param>
        /// <param name="screenId"></param>
        /// <param name="roleId"></param>
        /// <param name="userid"></param>
        /// <param name="operation"></param>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public async Task<CustomResponseModel> PerformGenericOperationAsync(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation)
        {
            string errorMessage = string.Empty;
            CustomResponseModel objResponse = new CustomResponseModel();

            try
            {
                if(userid==0)
                {
                    throw new Exception("Invalid userid");
                }

                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(screenId, roleId, operation, out errorMessage);
                int validateResult = 0;
                if (string.IsNullOrEmpty(errorMessage))
                {
                    DataSet ds = new DataSet();

                    string commandText = string.Empty;
                    if (operation == "A" && !string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcNameAdd))
                    {
                        commandText = objScreenDBMappingModel.ProcNameAdd;
                    }
                    if (operation == "U" && !string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcUpdate))
                    {
                        commandText = objScreenDBMappingModel.ProcUpdate;
                    }
                    if (operation == "D" && !string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcDelete))
                    {
                        commandText = objScreenDBMappingModel.ProcDelete;
                    }

                    if (commandText != string.Empty)
                    {
                        SqlParameter[] param = new SqlParameter[6];
                        param[0] = new SqlParameter("@UserID", userid);
                        param[1] = new SqlParameter("@globalxmlData", globalXml);
                        param[2] = new SqlParameter("@xmlData", xml);
                        param[3] = new SqlParameter("@validationResult", SqlDbType.Int)
                        {
                            Value = validateResult,
                            Direction = ParameterDirection.Output
                        };

                        param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 8000)
                        {
                            Value = "",
                            Direction = ParameterDirection.Output
                        };
                        param[5] = new SqlParameter("@scopeID", SqlDbType.Int)
                        {
                            Value = 0,
                            Direction = ParameterDirection.Output
                        };

                        ds = await SqlHelper.ExecuteDatasetAsync(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                        errorMessage = Convert.ToString(param[4].Value.ToString());
                        validateResult = param[3].ToString() == "" ? 0 : Convert.ToInt32(param[3].Value.ToString());
                        objResponse.ScopeID = param[5].ToString() == "" ? 0 : Convert.ToInt32(param[5].Value.ToString());

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
                        objResponse.ValidationInput = 0;
                        objResponse.ErrorMessage = "Please provide action/screen or screen is not available.";
                        objResponse.CustomMessage = "Please provide action/screen or screen is not available.";
                        objResponse.data = null;
                        objResponse.IsSuccessStatusCode = false;
                        objResponse.CustumException = "Please provide action/screen or screen is not available.";
                        return objResponse;
                    }

                }
                else
                {
                    objResponse.ValidationInput = validateResult;
                    objResponse.ErrorMessage = errorMessage;
                    objResponse.CustomMessage = errorMessage;
                    objResponse.data = null;
                    objResponse.IsSuccessStatusCode = false;
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
        public async Task<CustomResponseModel> GetGenericRecordsAsync(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation)
        {
            string errorMessage = string.Empty;
            CustomResponseModel objResponse = new CustomResponseModel();
            DataSet ds = new DataSet();

            try
            {
                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(screenId, roleId, operation, out errorMessage);
                int validateResult = 0;
                if (string.IsNullOrEmpty(errorMessage))
                {

                    string commandText = string.Empty;
                    if (!string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcNameGet))
                    {
                        commandText = objScreenDBMappingModel.ProcNameGet;
                    }

                    if (commandText != string.Empty)
                    {
                        SqlParameter[] param = new SqlParameter[6];
                        param[0] = new SqlParameter("@UserID", userid);
                        param[1] = new SqlParameter("@globalxmlData", globalXml);
                        param[2] = new SqlParameter("@xmlData", xml);
                        param[3] = new SqlParameter("@validationResult", SqlDbType.Int)
                        {
                            Value = validateResult,
                            Direction = ParameterDirection.Output
                        };

                        param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 8000)
                        {
                            Value = "",
                            Direction = ParameterDirection.Output
                        };

                        param[5] = new SqlParameter("@scopeID", SqlDbType.Int)
                        {
                            Value = 0,
                            Direction = ParameterDirection.Output
                        };

                        ds = await SqlHelper.ExecuteDatasetAsync(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                        errorMessage = Convert.ToString(param[4].Value.ToString());
                        validateResult = param[3].ToString() == "" ? 0 : Convert.ToInt32(param[3].Value.ToString());
                        objResponse.ScopeID = param[5].ToString() == "" ? 0 : Convert.ToInt32(param[5].Value.ToString());
                        objResponse.ValidationInput = validateResult;
                        objResponse.ErrorMessage = errorMessage;
                        objResponse.CustomMessage = errorMessage;
                        objResponse.data = ds;
                        objResponse.DataList= DataSetToDictionary(ds);
                        objResponse.IsSuccessStatusCode = true;
                        objResponse.CustumException = null;
                        return objResponse;
                    }
                    else
                    {
                        objResponse.ValidationInput = 0;
                        objResponse.ErrorMessage = "Please provide action/screen or screen is not available.";
                        objResponse.CustomMessage = "Please provide action/screen or screen is not available.";
                        objResponse.data = null;
                        objResponse.IsSuccessStatusCode = false;
                        objResponse.CustumException = "Please provide action/screen or screen is not available.";
                        return objResponse;
                    }


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
        public async Task<CustomResponseModel> GetGenericRecordsAsyncPaging(string globalXml, string xml, string screenId, int roleId, Int64 userid, string operation)
        {
            string errorMessage = string.Empty;
            CustomResponseModel objResponse = new CustomResponseModel();
            DataSet ds = new DataSet();

            try
            {
                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(screenId, roleId, operation, out errorMessage);
                int validateResult = 0;
                if (string.IsNullOrEmpty(errorMessage))
                {

                    string commandText = string.Empty;
                    if (!string.IsNullOrWhiteSpace(objScreenDBMappingModel.ProcNameGet))
                    {
                        commandText = objScreenDBMappingModel.ProcNameGet;
                    }

                    if (commandText != string.Empty)
                    {
                        SqlParameter[] param = new SqlParameter[6];
                        param[0] = new SqlParameter("@UserID", userid);
                        param[1] = new SqlParameter("@globalxmlData", globalXml);
                        param[2] = new SqlParameter("@xmlData", xml);
                        param[3] = new SqlParameter("@validationResult", SqlDbType.Int)
                        {
                            Value = validateResult,
                            Direction = ParameterDirection.Output
                        };

                        param[4] = new SqlParameter("@errorText", SqlDbType.VarChar, 8000)
                        {
                            Value = "",
                            Direction = ParameterDirection.Output
                        };

                        param[5] = new SqlParameter("@scopeID", SqlDbType.Int)
                        {
                            Value = 0,
                            Direction = ParameterDirection.Output
                        };

                        var datta = await GetGenericDataSetLikeObjectAsync(commandText, param);
                        errorMessage = Convert.ToString(param[4].Value.ToString());
                        validateResult = param[3].ToString() == "" ? 0 : Convert.ToInt32(param[3].Value.ToString());
                        objResponse.ScopeID = param[5].ToString() == "" ? 0 : Convert.ToInt32(param[5].Value.ToString());
                        objResponse.ValidationInput = validateResult;
                        objResponse.ErrorMessage = errorMessage;
                        objResponse.CustomMessage = errorMessage;                      
                        objResponse.DataList = datta;
                        objResponse.IsSuccessStatusCode = true;
                        objResponse.CustumException = null;
                        return objResponse;
                    }
                    else
                    {
                        objResponse.ValidationInput = 0;
                        objResponse.ErrorMessage = "Please provide action/screen or screen is not available.";
                        objResponse.CustomMessage = "Please provide action/screen or screen is not available.";
                        objResponse.data = null;
                        objResponse.IsSuccessStatusCode = false;
                        objResponse.CustumException = "Please provide action/screen or screen is not available.";
                        return objResponse;
                    }


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
        public async Task<Dictionary<string, List<Dictionary<string, object>>>> GetGenericDataSetLikeObjectAsync(string storedProc, SqlParameter[] parameters)
        {
            var result = new Dictionary<string, List<Dictionary<string, object>>>();

            using (var conn = new SqlConnection(SqlHelper.GetConnectionString()))
            using (var cmd = new SqlCommand(storedProc, conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameters != null)
                    cmd.Parameters.AddRange(parameters);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    int tableIndex = 0;
                    do
                    {
                        var table = new List<Dictionary<string, object>>();

                        while (await reader.ReadAsync())
                        {
                            var row = new Dictionary<string, object>();
                            for (int i = 0; i < reader.FieldCount; i++)
                            {
                                row[reader.GetName(i)] = await reader.IsDBNullAsync(i) ? null : reader.GetValue(i);
                            }
                            table.Add(row);
                        }

                        result[$"Table{tableIndex}"] = table;
                        tableIndex++;

                    } while (await reader.NextResultAsync());
                }
            }

            return result;
        }

        public async Task<DataSet> ExecuteReportStoredProcedureAsync(GenericReportModel objGenericReportModel)
            {
            string connectionString = SqlHelper.GetConnectionString();

                using (SqlConnection sqlCon = new SqlConnection(connectionString))
                {
                    await sqlCon.OpenAsync();

                    using (SqlCommand cmd = new SqlCommand(objGenericReportModel.StoredProcedureName, sqlCon))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        // Add dynamic parameters
                        if (objGenericReportModel.Parameters != null)
                        {
                            foreach (var param in objGenericReportModel.Parameters)
                            {
                                cmd.Parameters.AddWithValue(param.Key, param.Value ?? DBNull.Value);
                            }
                        }

                        using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                        {
                            DataSet dataSet = new DataSet();
                            sda.Fill(dataSet);
                            return dataSet;
                        }
                    }
                }
            }
        public  Dictionary<string, List<Dictionary<string, object>>> DataSetToDictionary(DataSet ds)
        {
            var result = new Dictionary<string, List<Dictionary<string, object>>>();

            for (int i = 0; i < ds.Tables.Count; i++)
            {
                var table = ds.Tables[i];
                var tableName = string.IsNullOrEmpty(table.TableName) ? $"Table{i}" : table.TableName;

                var rows = new List<Dictionary<string, object>>();
                foreach (DataRow row in table.Rows)
                {
                    var rowDict = new Dictionary<string, object>();
                    foreach (DataColumn col in table.Columns)
                    {
                        rowDict[col.ColumnName] = row[col];
                    }
                    rows.Add(rowDict);
                }

                result[tableName] = rows;
            }

            return result;
        }


    }

}
