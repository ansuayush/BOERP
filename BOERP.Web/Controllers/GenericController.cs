using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.Shared;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NLog;
using Sahaj.API;
using Sahaj.API.BLL;
using Sahaj.API.Interface;
using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Xml.Linq;

namespace SahajFramework.API
{
    [AuthorizationRequiredAttribute]
    public class GenericController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        ICommon _iCommon;
        IGeneric _objIGeneric;
        public GenericController()
        {
            //Testing checkin
            _objIGeneric = new GenericBussinessBLL();
            _iCommon = new CommonBLL();
        }
        /// <summary>
        /// This method is used to perform common methods insert update and delete and get also.
        /// </summary>
        /// <param name="objGenericOperationModel"></param>
        /// <returns></returns>    
        /// 

        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/Generic/PerformOperationAsync")]

        public async Task<HttpResponseMessage> PerformOperationAsync(GenericOperationModel objGenericOperationModel)
        {
            logger.Debug("PerformOperationAsync started. Model: {@objGenericOperationModel}", objGenericOperationModel);

            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userid = 0;
            if (Request.Headers.Contains("Auth"))
            {
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                logger.Debug("PerformOperationAsync started. Auth Token: {@headerValue}", headerValue);
                var data = CommonMethods.IsValidToken(headerValue);
                if (data.Rows.Count > 0)
                {
                    roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                    userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                    string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                    logger.Debug("PerformOperationAsync started. Model: {@userDetails}", userDetails);
                }
                else
                {
                    logger.Debug("PerformOperationAsync started. Auth Token Expired: {@headerValue}", headerValue);
                    statusCode = "401";
                }
            }
            else
            {
                logger.Debug("PerformOperationAsync started. Blank Auth Token: {@headerValue}", "");
                statusCode = "401";
            }
            if (statusCode == "401")
            {
                var Result = new JsonResult
                {
                    Data = new { error = "Unauthorized access" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.Unauthorized, Result);
            }

            // Operation - A means Add
            // Operation - U means Update
            // Operation - D means Delete

            objGenericOperationModel.UserID = userid;
            objGenericOperationModel.RoleId = roleId;
            string xmlString = string.Empty;
            if (objGenericOperationModel.ModelData != "" || objGenericOperationModel.ModelData != null)
            {
                // Parse JSON data into JObject
                JObject json = JObject.Parse(objGenericOperationModel.ModelData);

                if (objGenericOperationModel.ScreenID == "802")
                {
                    string password = json["password"]?.ToString();
                    password = clsApplicationSetting.Encrypt(password);
                    json["password"] = password;
                }
                // Convert JSON to XML and get as an XML string
                XDocument xmlDocument = JsonConvert.DeserializeXNode(json.ToString(), "Root");

                // Convert the XML to a string
                xmlString = xmlDocument.ToString();
                objGenericOperationModel.ModelData = "";

                logger.Debug("PerformOperationAsync started. Model xml String: {@xmlString}", xmlString);
            }


            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objGenericOperationModel);
            try
            {

                logger.Debug("PerformOperationAsync started. Model Global xml String: {@stringTOXml}", stringTOXml);
                string errorMessage = string.Empty;

                var data = await _objIGeneric.PerformGenericOperationAsync(stringTOXml, xmlString, objGenericOperationModel.ScreenID, roleId, userid, objGenericOperationModel.Operation);
                string jsonData = JsonConvert.SerializeObject(data);
                logger.Debug("PerformOperationAsync started. Response Data from database: {@jsonData}", jsonData);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.OK, Result);


            }
            catch (Exception ex)
            {
                string errorMessage = string.Empty;
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.Message != null)
                    {
                        errorMessage = ex.InnerException.Message;
                    }
                }
                else
                {
                    errorMessage = ex.Message;
                }
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = errorMessage;// ex.InnerException.Message == null ? "" : ex.InnerException.Message;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);

                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Result);

            }


        }


        /// <summary>
        /// This method is used to perform common methods insert update and delete and get also.
        /// </summary>
        /// <param name="objGenericOperationModel"></param>
        /// <returns></returns>

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Generic/GetRecordsAsync")]

        public async Task<HttpResponseMessage> GetRecordsAsync(string modelData, string screenId)
        {
            int id = 0, type = 0;
            string RequestModel = "RequestModel:" + modelData + " ScreenId:" + screenId;
            logger.Debug("GetRecordsAsync started. Model: {@RequestModel}", RequestModel);
            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userid = 0;
            if (Request.Headers.Contains("Auth"))
            {
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                logger.Debug("GetRecordsAsync started. Auth Token: {@headerValue}", headerValue);
                var data = CommonMethods.IsValidToken(headerValue);
                if (data.Rows.Count > 0)
                {
                    roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                    userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                    string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                    logger.Debug("GetRecordsAsync started. Model: {@userDetails}", userDetails);
                }
                else
                {
                    logger.Debug("GetRecordsAsync started. Invalid Auth Token: {@headerValue}", headerValue);
                    statusCode = "401";
                }
            }
            else
            {
                logger.Debug("GetRecordsAsync started. Blank Auth Token: {@headerValue}", "");
                statusCode = "401";
            }
            if (statusCode == "401")
            {
                var Result = new JsonResult
                {
                    Data = new { error = "Unauthorized access" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.Unauthorized, Result);
            }

            GenericOperationModel objGenericOperationModel = new GenericOperationModel();
            objGenericOperationModel.UserID = userid;
            objGenericOperationModel.RoleId = roleId;
            objGenericOperationModel.ScreenID = screenId;
            string xmlString = string.Empty;
            if (modelData != "" || modelData != null)
            {
                // Parse JSON data into JObject
                JObject json = JObject.Parse(modelData);

                if (screenId == "802")
                {


                    // Attempt to parse "Id"
                    if (!string.IsNullOrEmpty(json["Id"]?.ToString()))
                    {
                        int.TryParse(json["Id"]?.ToString(), out id);
                    }

                    // Attempt to parse "Type"
                    if (!string.IsNullOrEmpty(json["Type"]?.ToString()))
                    {
                        int.TryParse(json["Type"]?.ToString(), out type);
                    }

                }
                // Convert JSON to XML and get as an XML string
                XDocument xmlDocument = JsonConvert.DeserializeXNode(json.ToString(), "Root");
                // Convert the XML to a string
                xmlString = xmlDocument.ToString();
                objGenericOperationModel.ModelData = "";
                logger.Debug("GetRecordsAsync started. Model xml String: {@xmlString}", xmlString);
            }


            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objGenericOperationModel);
            try
            {
                logger.Debug("GetRecordsAsync started. Model Global xml String: {@stringTOXml}", stringTOXml);
                string errorMessage = string.Empty;
                var data = await _objIGeneric.GetGenericRecordsAsync(stringTOXml, xmlString, screenId, roleId, userid, "Get");
                if (screenId == "802" && id > 0 && type == 1)
                {
                    string password = data.data.Tables[0].Rows[0]["Password"].ToString();
                    if (!string.IsNullOrEmpty(password))
                    {
                        string decriptPwd = clsApplicationSetting.Decrypt(password);
                        foreach (DataRow rw in data.data.Tables[0].Rows)
                        {
                            rw["Password"] = decriptPwd;
                            data.data.Tables[0].AcceptChanges();
                            rw.SetModified();
                        }
                    }

                }
                string jsonData = JsonConvert.SerializeObject(data);
                logger.Debug("GetRecordsAsync started. Response Data from database: {@jsonData}", jsonData);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
                return Request.CreateResponse(HttpStatusCode.OK, Result);

            }
            catch (Exception ex)
            {
                string errorMessage = string.Empty;
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.Message != null)
                    {
                        errorMessage = ex.InnerException.Message;
                    }
                }
                else
                {
                    errorMessage = ex.Message;
                }
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = errorMessage;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Result);

            }

        }



        /// <summary>
        /// This method is used to perform common methods insert update and delete and get also.
        /// </summary>
        /// <param name="objGenericOperationModel"></param>
        /// <returns></returns>

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Generic/GetPagingRecordsAsync")]

        public async Task<HttpResponseMessage> GetPagingRecordsAsync(int start, int length, string search, string orderColumn, string orderDir, string screenId, string modelData)
        {
            
            string RequestModel = "RequestModel:ScreenId:" + screenId;
            logger.Debug("GetPagingRecordsAsync started. Model: {@RequestModel}", RequestModel);
            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userid = 0;
            if (Request.Headers.Contains("Auth"))
            {
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                logger.Debug("GetPagingRecordsAsync started. Auth Token: {@headerValue}", headerValue);
                var data = CommonMethods.IsValidToken(headerValue);
                if (data.Rows.Count > 0)
                {
                    roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                    userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                    string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                    logger.Debug("GetPagingRecordsAsync started. Model: {@userDetails}", userDetails);
                }
                else
                {
                    logger.Debug("GetPagingRecordsAsync started. Invalid Auth Token: {@headerValue}", headerValue);
                    statusCode = "401";
                }
            }
            else
            {
                logger.Debug("GetRecordsAsync started. Blank Auth Token: {@headerValue}", "");
                statusCode = "401";
            }
            if (statusCode == "401")
            {
                var Result = new JsonResult
                {
                    Data = new { error = "Unauthorized access" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.Unauthorized, Result);
            }

            GenericOperationModel objGenericOperationModel = new GenericOperationModel();
            objGenericOperationModel.UserID = userid;
            objGenericOperationModel.RoleId = roleId;
            objGenericOperationModel.ScreenID = screenId;
            objGenericOperationModel.PageNumber = start;
            objGenericOperationModel.PageSize = length;
            objGenericOperationModel.OrderDir = orderDir;
            objGenericOperationModel.OrderColumn = orderColumn;
            string xmlString = string.Empty;
            if (modelData != "" || modelData != null)
            {
                // Parse JSON data into JObject
                JObject json = JObject.Parse(modelData);

                // Convert JSON to XML and get as an XML string
                XDocument xmlDocument = JsonConvert.DeserializeXNode(json.ToString(), "Root");
                // Convert the XML to a string
                xmlString = xmlDocument.ToString();
                objGenericOperationModel.ModelData = "";
                logger.Debug("GetRecordsAsync started. Model xml String: {@xmlString}", xmlString);
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objGenericOperationModel);
            try
            {
                logger.Debug("GetRecordsAsync started. Model Global xml String: {@stringTOXml}", stringTOXml);
                string errorMessage = string.Empty;
                var data = await _objIGeneric.GetGenericRecordsAsyncPaging(stringTOXml, xmlString, screenId, roleId, userid, "Get");
               
                Dictionary<string, List<Dictionary<string, object>>> DataList = data.DataList;
                CustomResponsePagingModel objData = new CustomResponsePagingModel();
                if (DataList != null && DataList.Count > 0)
                {
                    // Get the first table (e.g., "Table0") for TotalRecord
                    var table0 = DataList.ContainsKey("Table0") ? DataList["Table0"] : null;
                    var table1 = DataList.ContainsKey("Table1") ? DataList["Table1"] : null;

                    if (table0 != null && table0.Count > 0)
                    {
                        objData.TotalRecords = Convert.ToInt32(table0[0]["TotalRecord"]);
                        objData.FilteredRecords = objData.TotalRecords;
                    }

                    objData.Records = table1 ?? new List<Dictionary<string, object>>();
                }
                string jsonData = JsonConvert.SerializeObject(objData);
                logger.Debug("GetRecordsAsync started. Response Data from database: {@jsonData}", jsonData);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
                return Request.CreateResponse(HttpStatusCode.OK, Result);

            }
            catch (Exception ex)
            {
                string errorMessage = string.Empty;
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.Message != null)
                    {
                        errorMessage = ex.InnerException.Message;
                    }
                }
                else
                {
                    errorMessage = ex.Message;
                }
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = errorMessage;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Result);

            }

        }

        /// <summary>
        /// This method is used to perform common methods insert update and delete and get also.
        /// </summary>
        /// <param name="objGenericOperationModel"></param>
        /// <returns></returns>

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Generic/GetPagingRecordsAgGridAsync")]

        public async Task<HttpResponseMessage> GetPagingRecordsAgGridAsync(int start, int length, string search, string orderColumn, string orderDir, string screenId, string modelData)
        {
            int id = 0, type = 0;
            string RequestModel = "RequestModel:ScreenId:" + screenId;
            logger.Debug("GetPagingRecordsAsync started. Model: {@RequestModel}", RequestModel);
            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userid = 0;
            if (Request.Headers.Contains("Auth"))
            {
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                logger.Debug("GetPagingRecordsAsync started. Auth Token: {@headerValue}", headerValue);
                var data = CommonMethods.IsValidToken(headerValue);
                if (data.Rows.Count > 0)
                {
                    roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                    userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                    string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                    logger.Debug("GetPagingRecordsAsync started. Model: {@userDetails}", userDetails);
                }
                else
                {
                    logger.Debug("GetPagingRecordsAsync started. Invalid Auth Token: {@headerValue}", headerValue);
                    statusCode = "401";
                }
            }
            else
            {
                logger.Debug("GetRecordsAsync started. Blank Auth Token: {@headerValue}", "");
                statusCode = "401";
            }
            if (statusCode == "401")
            {
                var Result = new JsonResult
                {
                    Data = new { error = "Unauthorized access" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.Unauthorized, Result);
            }

            GenericOperationModel objGenericOperationModel = new GenericOperationModel();
            objGenericOperationModel.UserID = userid;
            objGenericOperationModel.RoleId = roleId;
            objGenericOperationModel.ScreenID = screenId;
            objGenericOperationModel.PageNumber = start;
            objGenericOperationModel.PageSize = length;
            objGenericOperationModel.OrderDir = orderDir;
            objGenericOperationModel.OrderColumn = orderColumn;
            string xmlString = string.Empty;
            if (modelData != "" || modelData != null)
            {
                // Parse JSON data into JObject
                JObject json = JObject.Parse(modelData);

                // Convert JSON to XML and get as an XML string
                XDocument xmlDocument = JsonConvert.DeserializeXNode(json.ToString(), "Root");
                // Convert the XML to a string
                xmlString = xmlDocument.ToString();
                objGenericOperationModel.ModelData = "";
                logger.Debug("GetRecordsAsync started. Model xml String: {@xmlString}", xmlString);
            }
            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objGenericOperationModel);
            try
            {
                logger.Debug("GetRecordsAsync started. Model Global xml String: {@stringTOXml}", stringTOXml);
                string errorMessage = string.Empty;
                var data = await _objIGeneric.GetGenericRecordsAsyncPaging(stringTOXml, xmlString, screenId, roleId, userid, "Get");

                Dictionary<string, List<Dictionary<string, object>>> DataList = data.DataList;
                CustomResponsePagingModel objData = new CustomResponsePagingModel();
                if (DataList != null && DataList.Count > 0)
                {
                    // Get the first table (e.g., "Table0") for TotalRecord
                    var table0 = DataList.ContainsKey("Table0") ? DataList["Table0"] : null;
                    var table1 = DataList.ContainsKey("Table1") ? DataList["Table1"] : null;
                    var table2 = DataList.ContainsKey("Table2") ? DataList["Table2"] : null;
                    if (table0 != null && table0.Count > 0)
                    {
                        objData.TotalRecords = Convert.ToInt32(table0[0]["TotalRecord"]);
                        objData.FilteredRecords = objData.TotalRecords;
                    }

                    objData.Records = table1 ?? new List<Dictionary<string, object>>();
                    objData.ColumnData = table2 ?? new List<Dictionary<string, object>>();
                }
                string jsonData = JsonConvert.SerializeObject(objData);
                logger.Debug("GetRecordsAsync started. Response Data from database: {@jsonData}", jsonData);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
                return Request.CreateResponse(HttpStatusCode.OK, Result);

            }
            catch (Exception ex)
            {
                string errorMessage = string.Empty;
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.Message != null)
                    {
                        errorMessage = ex.InnerException.Message;
                    }
                }
                else
                {
                    errorMessage = ex.Message;
                }
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = errorMessage;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Result);

            }

        }



        /// <summary>
        /// This method is used to get dropdown data with Auth token
        /// </summary>
        /// <param name="masterTableTypeId"></param>
        /// <param name="parentId"></param>
        /// <param name="isMasterTableType"></param>
        /// <param name="isManualTable"></param>
        /// <param name="manualTable"></param>
        /// <param name="manualTableId"></param>
        /// <param name="ScreenId"></param>
        /// <returns></returns>
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Generic/GetDropDownWithAsync")]

        public async Task<HttpResponseMessage> GetDropDownWithAsync(int masterTableTypeId, int? parentId, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId, string ScreenId)
        {
            string concatenatedString = $"masterTableTypeId: {masterTableTypeId}, " +
                            $"parentId: {parentId}, " +
                            $"isMasterTableType: {isMasterTableType}, " +
                            $"isManualTable: {isManualTable}, " +
                            $"manualTable: {manualTable}, " +
                            $"manualTableId: {manualTableId}, " +
                            $"ScreenId: {ScreenId}";
            logger.Debug("GetDropDownWithAsyncAuth started. Model: {@concatenatedString}", concatenatedString);
            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userid = 0;
            if (Request.Headers.Contains("Auth"))
            {
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                logger.Debug("GetDropDownWithAsyncAuth started. Auth Token: {@headerValue}", headerValue);
                var data = CommonMethods.IsValidToken(headerValue);
                if (data.Rows.Count > 0)
                {
                    roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                    userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                    string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                    logger.Debug("GetDropDownWithAsyncAuth started. Model: {@userDetails}", userDetails);
                }
                else
                {
                    logger.Debug("GetDropDownWithAsyncAuth started. Invalid Auth Token: {@headerValue}", headerValue);
                    statusCode = "401";
                }
            }
            else
            {
                logger.Debug("GetDropDownWithAsyncAuth started. Blank Auth Token: {@headerValue}", "");
                statusCode = "401";
            }
            if (statusCode == "401")
            {
                var Result = new JsonResult
                {
                    Data = new { error = "Unauthorized access" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.Unauthorized, Result);
            }

            try
            {
                string errorMessage = string.Empty;
                var data = await _objIGeneric.GetDropDownWithAsync(masterTableTypeId, parentId, isMasterTableType, isManualTable, manualTable, manualTableId, ScreenId);
                string jsonData = JsonConvert.SerializeObject(data);
                logger.Debug("GetDropDownWithAsyncAuth started. Response Data from database: {@jsonData}", jsonData);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
                return Request.CreateResponse(HttpStatusCode.OK, Result);

            }
            catch (Exception ex)
            {
                string errorMessage = string.Empty;
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.Message != null)
                    {
                        errorMessage = ex.InnerException.Message;
                    }
                }
                else
                {
                    errorMessage = ex.Message;
                }
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = errorMessage;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Result);

            }

        }


        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/Generic/DownloadReportAsync")]
        public async Task<HttpResponseMessage> DownloadReportAsync(GenericReportModel objGenericReportModel)
        {
            logger.Debug("DownloadReportAsync started. Model: {@objGenericReportModel}", objGenericReportModel);

            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userId = 0;

            if (Request.Headers.Contains("Auth"))
            {
                string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                var data = CommonMethods.IsValidToken(headerValue);
                if (data.Rows.Count > 0)
                {
                    roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                    userId = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                }
                else
                {
                    statusCode = "401";
                }
            }
            else
            {
                statusCode = "401";
            }

            if (statusCode == "401")
            {
                var unauthorizedResult = new JsonResult
                {
                    Data = new { error = "Unauthorized access" },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.Unauthorized, unauthorizedResult);
            }

            try
            {
                var dataSet = await _objIGeneric.ExecuteReportStoredProcedureAsync(objGenericReportModel);

                if (dataSet.Tables.Count == 0 || dataSet.Tables[0].Rows.Count == 0)
                {
                    throw new Exception("No data found for the report.");
                }

                ReportDocument rd = new ReportDocument();
                string reportPath = System.Web.Hosting.HostingEnvironment.MapPath(objGenericReportModel.ReportPath);

                rd.Load(reportPath);
                rd.SetDataSource(dataSet.Tables[0]);

                string docName = objGenericReportModel.FileNamePrefix + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".pdf";
                string savePath = System.Web.Hosting.HostingEnvironment.MapPath("~/Attachments/PDF/" + docName);

                // Delete if exists
                if (System.IO.File.Exists(savePath))
                {
                    System.IO.File.Delete(savePath);
                }

                rd.ExportToDisk(ExportFormatType.PortableDocFormat, savePath);
                rd.Close();
                rd.Dispose();

                var result = new JsonResult
                {
                    Data = new { FilePath = "/Attachments/PDF/" + docName },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
                return Request.CreateResponse(HttpStatusCode.OK, result);

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = ex.InnerException?.Message ?? ex.Message;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = false;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);

                var errorResult = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, errorResult);
            }
        }

        /// <summary>
        /// This method is used to perform common methods insert update and delete and get also.
        /// </summary>
        /// <param name="objGenericOperationModel"></param>
        /// <returns></returns>

        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Generic/UpdateToken")]

        public async Task<HttpResponseMessage> UpdateToken(string modelData, string screenId)
        {
            int id = 0, type = 0;
            string RequestModel = "RequestModel:" + modelData + " ScreenId:" + screenId;
            logger.Debug("GetRecordsAsync started. Model: {@RequestModel}", RequestModel);
            var statusCode = string.Empty;
            int roleId = 0;
            Int64 userid = 0;
            //if (Request.Headers.Contains("Auth"))
            //{
            //    string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
            //    logger.Debug("GetRecordsAsync started. Auth Token: {@headerValue}", headerValue);
            //    var data = CommonMethods.IsValidToken(headerValue);
            //    if (data.Rows.Count > 0)
            //    {
            //        roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
            //        userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
            //        string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
            //        logger.Debug("GetRecordsAsync started. Model: {@userDetails}", userDetails);
            //    }
            //    else
            //    {
            //        logger.Debug("GetRecordsAsync started. Invalid Auth Token: {@headerValue}", headerValue);
            //        statusCode = "401";
            //    }
            //}
            //else
            //{
            //    logger.Debug("GetRecordsAsync started. Blank Auth Token: {@headerValue}", "");
            //    statusCode = "401";
            //}
            //if (statusCode == "401")
            //{
            //    var Result = new JsonResult
            //    {
            //        Data = new { error = "Unauthorized access" },
            //        JsonRequestBehavior = JsonRequestBehavior.AllowGet
            //    };
            //    return Request.CreateResponse(HttpStatusCode.Unauthorized, Result);
            //}

            GenericOperationModel objGenericOperationModel = new GenericOperationModel();
            objGenericOperationModel.UserID = userid;
            objGenericOperationModel.RoleId = roleId;
            objGenericOperationModel.ScreenID = screenId;
            string xmlString = string.Empty;
            if (modelData != "" || modelData != null)
            {
                // Parse JSON data into JObject
                JObject json = JObject.Parse(modelData);

                
                // Convert JSON to XML and get as an XML string
                XDocument xmlDocument = JsonConvert.DeserializeXNode(json.ToString(), "Root");
                // Convert the XML to a string
                xmlString = xmlDocument.ToString();
                objGenericOperationModel.ModelData = "";
                logger.Debug("GetRecordsAsync started. Model xml String: {@xmlString}", xmlString);
            }


            CommonMethods objCommonMethods = new CommonMethods();

            string stringTOXml = objCommonMethods.GetXMLFromObject(objGenericOperationModel);
            try
            {
                logger.Debug("GetRecordsAsync started. Model Global xml String: {@stringTOXml}", stringTOXml);
                string errorMessage = string.Empty;
                var data = await _objIGeneric.GetGenericRecordsAsync(stringTOXml, xmlString, screenId, roleId, userid, "Get");                 
                string jsonData = JsonConvert.SerializeObject(data);
                logger.Debug("GetRecordsAsync started. Response Data from database: {@jsonData}", jsonData);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = Int32.MaxValue
                };
                return Request.CreateResponse(HttpStatusCode.OK, Result);

            }
            catch (Exception ex)
            {
                string errorMessage = string.Empty;
                if (ex.InnerException != null)
                {
                    if (ex.InnerException.Message != null)
                    {
                        errorMessage = ex.InnerException.Message;
                    }
                }
                else
                {
                    errorMessage = ex.Message;
                }
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = errorMessage;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                var Result = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Result);

            }

        }
    }
}