using Newtonsoft.Json;
using NLog;
using Sahaj.API;
using Sahaj.API.BLL;
using Sahaj.API.Model;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace SahajFramework.API
{
    [AuthorizationRequiredAttribute]
    public class ContentManagementController: ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        UploadDownloadFactory _UploadDownloadFactory;
        [System.Web.Http.HttpPost]
        [System.Web.Http.Route("api/ContentManagement/MultiFileUploadAsyncWithAuth")]
        public async Task<HttpResponseMessage> MultiFileUploadAsyncWithAuth(string jsonString, int type)
        {
            try
            {
                logger.Debug("FileUploadAsyncWithAuth started. Model: {@jsonString}", jsonString);

                var statusCode = string.Empty;
                int roleId = 0;
                Int64 userid = 0;
                if (Request.Headers.Contains("Auth"))
                {

                    string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                    logger.Debug("FileUploadAsyncWithAuth started. Auth Token: {@headerValue}", headerValue);
                    var data = CommonMethods.IsValidToken(headerValue);
                    if (data.Rows.Count > 0)
                    {
                        userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                        roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                         
                        string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                        logger.Debug("FileUploadAsyncWithAuth started. Model: {@userDetails}", userDetails);
                    }
                    else
                    {
                        logger.Debug("FileUploadAsyncWithAuth started. Invalid Auth Token: {@headerValue}", headerValue);
                        statusCode = "401";
                    }
                }
                else
                {
                    logger.Debug("FileUploadAsyncWithAuth started. Blank Auth Token: {@headerValue}", "");
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
                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files;
                _UploadDownloadFactory = UploadDownloadFactory.CreateFactory((UploadDownloadFactory.UploadFactoryTypes)type);
                var respo = await _UploadDownloadFactory.MultiFileUploadAsync(postedFile, jsonString);
                string jsonData = JsonConvert.SerializeObject(respo);
                logger.Debug("FileUploadAsyncWithAuth started. Response Data from database: {@jsonData}", jsonData);
                var ResultSuccess = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.OK, ResultSuccess);

            }
            catch (Exception ex)
            {

                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
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
        [System.Web.Http.Route("api/ContentManagement/FileUploadAsyncWithAuth")]
        public async Task<HttpResponseMessage> FileUploadAsyncWithAuth(string jsonString, int type)
        {
            try
            {
                logger.Debug("FileUploadAsyncWithAuth started. Model: {@jsonString}", jsonString);

                var statusCode = string.Empty;
                int roleId = 0;
                Int64 userid = 0;
                if (Request.Headers.Contains("Auth"))
                {

                    string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                    logger.Debug("FileUploadAsyncWithAuth started. Auth Token: {@headerValue}", headerValue);
                    var data = CommonMethods.IsValidToken(headerValue);
                    if (data.Rows.Count > 0)
                    {
                        userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                        roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                        string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                        logger.Debug("FileUploadAsyncWithAuth started. Model: {@userDetails}", userDetails);
                    }
                    else
                    {
                        logger.Debug("FileUploadAsyncWithAuth started. Invalid Auth Token: {@headerValue}", headerValue);
                        statusCode = "401";
                    }
                }
                else
                {
                    logger.Debug("FileUploadAsyncWithAuth started. Blank Auth Token: {@headerValue}", "");
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
                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                _UploadDownloadFactory = UploadDownloadFactory.CreateFactory((UploadDownloadFactory.UploadFactoryTypes)type);
                var respo = await _UploadDownloadFactory.FileUploadAsync(postedFile, jsonString);
                string jsonData = JsonConvert.SerializeObject(respo);
                logger.Debug("FileUploadAsyncWithAuth started. Response Data from database: {@jsonData}", jsonData);
                var ResultSuccess = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.OK, ResultSuccess);

            }
            catch (Exception ex)
            {

                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
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
        [System.Web.Http.Route("api/ContentManagement/DeleteFileWithAuth")]
        public  HttpResponseMessage DeleteFileWithAuth(FileModel objFileModel)
        {
            try
            {               

                logger.Debug("DeleteFileWithAuth started. Model: {@objFileModel}", objFileModel);

                var statusCode = string.Empty;
                int roleId = 0;
                Int64 userid = 0;
                if (Request.Headers.Contains("Auth"))
                {
                    string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                    logger.Debug("DeleteFileWithAuth started. Auth Token: {@headerValue}", headerValue);
                    var data = CommonMethods.IsValidToken(headerValue);
                    if (data.Rows.Count > 0)
                    {
                        roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                        userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                        string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                        logger.Debug("DeleteFileWithAuth started. Model: {@userDetails}", userDetails);
                        MitraLogger.Info("DeleteFileWithAuth started. Model:"+userDetails);
                    }
                    else
                    {
                        logger.Debug("DeleteFileWithAuth started. Invalid Auth Token: {@headerValue}", headerValue);
                        statusCode = "401";
                    }
                }
                else
                {
                    logger.Debug("DeleteFileWithAuth started. Blank Auth Token: {@headerValue}", "");
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
                _UploadDownloadFactory = UploadDownloadFactory.CreateFactory((UploadDownloadFactory.UploadFactoryTypes)objFileModel.Type);
                var respo = _UploadDownloadFactory.DeleteFile(objFileModel, userid);
                string jsonData = JsonConvert.SerializeObject(respo);
                logger.Debug("DeleteFileWithAuth started. Response Data from database: {@jsonData}", jsonData);
                var ResultSuccess = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.OK, ResultSuccess);

            }
            catch (Exception ex)
            {

                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
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
        [System.Web.Http.Route("api/ContentManagement/FileUploadAsync")]
        public async Task<HttpResponseMessage> FileUploadAsync(string jsonString, int type)
        {
            try
            {
                logger.Debug("FileUploadAsync started. Model: {@jsonString}", jsonString);

                var httpRequest = HttpContext.Current.Request;
                var postedFile = httpRequest.Files[0];
                _UploadDownloadFactory = UploadDownloadFactory.CreateFactory((UploadDownloadFactory.UploadFactoryTypes)type);
                var respo = await _UploadDownloadFactory.FileUploadAsync(postedFile, jsonString);
                string jsonData = JsonConvert.SerializeObject(respo);
                logger.Debug("FileUploadAsync started. Response Data from database: {@jsonData}", jsonData);
                var ResultSuccess = new JsonResult
                {
                    Data = jsonData,
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet
                };
                return Request.CreateResponse(HttpStatusCode.OK, ResultSuccess);

            }
            catch (Exception ex)
            {

                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
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
        [System.Web.Http.Route("api/ContentManagement/DownloadFileWithAuth")]
        public HttpResponseMessage DownloadFileWithAuth(FileModel objFileModel)
        {
            try
            {

                logger.Debug("DownloadFileWithAuth started. Model: {@objFileModel}", objFileModel);
                
                var statusCode = string.Empty;
                int roleId = 0;
                Int64 userid = 0;
                if (Request.Headers.Contains("Auth"))
                {
                    string headerValue = Request.Headers.GetValues("Auth").FirstOrDefault();
                    logger.Debug("DownloadFileWithAuth started. Auth Token: {@headerValue}", headerValue);
                    var data = CommonMethods.IsValidToken(headerValue);
                    if (data.Rows.Count > 0)
                    {
                        userid = Convert.ToInt64(data.Rows[0]["UserId"].ToString());
                        roleId = Convert.ToInt32(data.Rows[0]["RoleId"].ToString());
                        string userDetails = "UserId:" + userid.ToString() + "RoleId:" + roleId.ToString();
                        logger.Debug("DownloadFileWithAuth started. Model: {@userDetails}", userDetails);
                        MitraLogger.Info("DownloadFileWithAuth started. Model:" + userDetails);
                    }
                    else
                    {
                        logger.Debug("DownloadFileWithAuth started. Invalid Auth Token: {@headerValue}", headerValue);
                        statusCode = "401";
                    }
                }
                else
                {
                    logger.Debug("DownloadFileWithAuth started. Blank Auth Token: {@headerValue}", "");
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
                _UploadDownloadFactory = UploadDownloadFactory.CreateFactory((UploadDownloadFactory.UploadFactoryTypes)objFileModel.Type);
                var respo = _UploadDownloadFactory.DownloadFile(objFileModel);
                if (respo.IsFileExists)
                {

                    string jsonData = JsonConvert.SerializeObject(respo);
                    logger.Debug("DownloadFileWithAuth started. Response Data from database: {@jsonData}", jsonData);
                    var ResultSuccess = new JsonResult
                    {
                        Data = jsonData,
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                    return Request.CreateResponse(HttpStatusCode.OK, ResultSuccess);
                }
                else
                {
                    var Result = new JsonResult
                    {
                        Data = new { error = "File not exists" },
                        JsonRequestBehavior = JsonRequestBehavior.AllowGet
                    };
                    return Request.CreateResponse(HttpStatusCode.BadRequest, Result);
                }
            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
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