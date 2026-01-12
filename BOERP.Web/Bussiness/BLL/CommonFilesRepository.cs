using Sahaj.API.Model;
using Microsoft.SqlServer.Server;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Remoting.Messaging;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Sahaj.API.DAL;
using System.Data.SqlClient;
using System.Data;

namespace Sahaj.API.BLL
{
    public class CommonFilesRepository : UploadDownloadFactory
    {
        double ConvertBytesToMegabytes(long bytes)
        {
            return Math.Round(((bytes / 1024f) / 1024f), 2);
        }
        public override async Task<CustomResponseModel> FileUploadAsync(HttpPostedFile file, string jsonString)
        {
            try
            {
                // Deserialize the JSON string into the CommonUpload object
                var objContentRequestDetails = JsonConvert.DeserializeObject<CommonUpload>(jsonString);

                string returrMessage = string.Empty;
                string fname = file.FileName;
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');
                int extIndex = splString.Length > 0 ? splString.Length - 1 : 1;

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathToBeSaved = "";
                string baseUrl = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseUrl = Path.Combine(baseUrl, objContentRequestDetails.FolderNames);

                // Ensure the directory exists
                CreateDirectoryIfNotExists(baseUrl);

                filePathToBeSaved = Path.Combine(baseUrl, uploadNewFileName);

                // Asynchronous file upload
                await SaveFileAsync(file, filePathToBeSaved);

                returrMessage = Path.Combine(ConfigurationManager.AppSettings["RootFolder"].Replace("~", ""), objContentRequestDetails.FolderNames, uploadNewFileName);

                // Create the FileModel object
                var objFileModel = new FileModel
                {
                    ActualFileName = fileName,
                    NewFileName = uploadNewFileName,
                    FileUrl = returrMessage,
                    FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString()
                };

                // Create the CustomResponseModel
                var objCustomResponseModel = new CustomResponseModel
                {
                    ValidationInput = 0,
                    ErrorMessage = "File Uploaded",
                    data = null,
                    CustomMessage = returrMessage,
                    IsSuccessStatusCode = true,
                    CustumException = "",
                    CommomDropDownData = null,
                    FileModel = objFileModel
                };

                return objCustomResponseModel;
            }
            catch (Exception ex)
            {
                // Log and return the error response
                CommonMethods.Error(ex);

                return new CustomResponseModel
                {
                    ValidationInput = 0,
                    ErrorMessage = ex.Message + " " + ex.StackTrace,
                    data = null,
                    CustomMessage = "",
                    IsSuccessStatusCode = true,
                    CustumException = ex.Message + " " + ex.StackTrace,
                    CommomDropDownData = null
                };
            }
        }

        public override async Task<CustomResponseModel> MultiFileUploadAsync(HttpFileCollection files, string jsonString)
        {
            try
            {
                List<FileModel> fileModelList = new List<FileModel>();
                // Deserialize the JSON string into the CommonUpload object
                var objContentRequestDetails = JsonConvert.DeserializeObject<CommonUpload>(jsonString);
                for (int i = 0; i < files.Count; i++)
                {
                    HttpPostedFile file = files[i];

                    string returrMessage = string.Empty;
                    string fname = file.FileName;
                    string fileName = fname;
                    string newFile = Guid.NewGuid().ToString();
                    string[] splString = fileName.Split('.');
                    int extIndex = splString.Length > 0 ? splString.Length - 1 : 1;

                    string uploadNewFileName = newFile + "." + splString[extIndex];
                    string filePathToBeSaved = "";
                    string baseUrl = HttpContext.Current.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                    baseUrl = Path.Combine(baseUrl, objContentRequestDetails.FolderNames);

                    // Ensure the directory exists
                    CreateDirectoryIfNotExists(baseUrl);

                    filePathToBeSaved = Path.Combine(baseUrl, uploadNewFileName);

                    fileName = file.FileName; // Gets the uploaded file's name
                    string fileType = file.ContentType.Split('/')[0]; // Extracts the main type (e.g., "image", "video")
                    string typeDetails = file.ContentType; // Gets the full MIME type (e.g., "image/png")

                    // Asynchronous file upload
                    await SaveFileAsync(file, filePathToBeSaved);

                    returrMessage = Path.Combine(ConfigurationManager.AppSettings["RootFolder"].Replace("~", ""), objContentRequestDetails.FolderNames, uploadNewFileName);

                    // Create the FileModel object
                    var objFileModel = new FileModel
                    {
                        TypeDetails= typeDetails,
                        FileType= fileType,
                        FolderNames = objContentRequestDetails.FolderNames,
                        ActualFileName = fileName,
                        NewFileName = uploadNewFileName,
                        FileUrl = returrMessage,
                        FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString()
                    };
                    fileModelList.Add(objFileModel);
                }


                // Create the CustomResponseModel
                var objCustomResponseModel = new CustomResponseModel
                {
                    ValidationInput = 0,
                    ErrorMessage = "File Uploaded",
                    data = null,
                    CustomMessage = "File Uploaded",
                    IsSuccessStatusCode = true,
                    CustumException = "",
                    CommomDropDownData = null,
                    FileModelList = fileModelList
                };

                return objCustomResponseModel;
            }
            catch (Exception ex)
            {
                // Log and return the error response
                CommonMethods.Error(ex);

                return new CustomResponseModel
                {
                    ValidationInput = 0,
                    ErrorMessage = ex.Message + " " + ex.StackTrace,
                    data = null,
                    CustomMessage = "",
                    IsSuccessStatusCode = true,
                    CustumException = ex.Message + " " + ex.StackTrace,
                    CommomDropDownData = null
                };
            }
        }


        private void Upload(string filePathTobeSaved)
        {
            HttpContext.Current.Request.Files[0].SaveAs(filePathTobeSaved);
        }
        private void CreateDirectoryIfNotExists(string NewDirectory)
        {
            if (!Directory.Exists(NewDirectory))
            {
                //If No any such directory then creates the new one
                Directory.CreateDirectory(NewDirectory);
            }

        }

        public override CustomResponseModel DeleteFile(FileModel objFileModel, Int64 userId)
        {
            try
            {
                int validateResult = 0;
                string errorMessage = "";
                string baseurl = HttpContext.Current.Server.MapPath("~");
                baseurl = baseurl + '/' + objFileModel.FileUrl;
                DataSet ds = new DataSet();
                ScreenDBMappingModel objScreenDBMappingModel = GetScreenSP(objFileModel.ScreenId, 1, "Get", out errorMessage);
                string commandText = objScreenDBMappingModel.ProcDelete;                
                SqlParameter[] param = new SqlParameter[4];
                param[0] = new SqlParameter("@UserId", userId);
                param[1] = new SqlParameter("@AttachmentId", objFileModel.Id);
                param[2] = new SqlParameter("@validationResult", SqlDbType.Int)
                {
                    Value = validateResult,
                    Direction = ParameterDirection.Output
                };
                param[3] = new SqlParameter("@errorText", SqlDbType.VarChar, 8000)
                {
                    Value = "",
                    Direction = ParameterDirection.Output
                };
                ds = SqlHelper.ExecuteDataset(SqlHelper.GetConnectionString(), CommandType.StoredProcedure, commandText, param);
                validateResult = param[2].ToString() == "" ? 0 : Convert.ToInt32(param[2].Value.ToString());
                errorMessage = Convert.ToString(param[3].Value.ToString());
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                if (validateResult>0)
                {
                    if (objFileModel.FileUrl!= "")
                    {                       
                        string fileName = baseurl.Split('/').Last(s => !string.IsNullOrEmpty(s));
                        objFileModel.NewFileName = fileName;
                        System.IO.File.Delete(baseurl);
                    }
                    objCustomResponseModel.ValidationInput = 1;
                    objCustomResponseModel.ErrorMessage = errorMessage;
                    objCustomResponseModel.data = null;
                    objCustomResponseModel.FileModel = objFileModel;
                    objCustomResponseModel.CustomMessage = errorMessage;
                    objCustomResponseModel.IsSuccessStatusCode = true;
                    objCustomResponseModel.CustumException = "";
                    objCustomResponseModel.CommomDropDownData = null;
                }
                else
                {
                    objCustomResponseModel.ValidationInput = 0;
                    objCustomResponseModel.ErrorMessage = errorMessage;
                    objCustomResponseModel.data = null;
                    objCustomResponseModel.FileModel = objFileModel;
                    objCustomResponseModel.CustomMessage = errorMessage;
                    objCustomResponseModel.IsSuccessStatusCode = true;
                    objCustomResponseModel.CustumException = errorMessage;
                    objCustomResponseModel.CommomDropDownData = null;
                }              
               
                return objCustomResponseModel;


            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                return objCustomResponseModel;
            }
        }
        public override CustomResponseModel UploadFileChunk(FileChunkModel model)
        {
            try
            {

                // Directory to store the uploaded chunks
                var uploadDir = Path.Combine(model.FolderNames, model.FileName);
                if (!Directory.Exists(uploadDir))
                    Directory.CreateDirectory(uploadDir);

                // Save the chunk to disk
                var chunkFilePath = Path.Combine(uploadDir, $"{model.ChunkIndex}.chunk");
                using (var stream = new FileStream(chunkFilePath, FileMode.Create))
                {
                    model.FileChunk.CopyToAsync(stream);
                }
                var finalFilePath = string.Empty;
                // If it's the last chunk, assemble the file
                if (model.ChunkIndex == model.TotalChunks - 1)
                {
                    finalFilePath = Path.Combine(model.FolderNames, model.FileName);

                    using (var finalFileStream = new FileStream(finalFilePath, FileMode.Create))
                    {
                        var chunkFiles = Directory.GetFiles(uploadDir)
                                                  .OrderBy(f => int.Parse(Path.GetFileNameWithoutExtension(f)))
                                                  .ToList();

                        foreach (var chunkFile in chunkFiles)
                        {
                            using (var chunkStream = new FileStream(chunkFile, FileMode.Open))
                            {
                                chunkStream.CopyToAsync(finalFileStream);
                            }
                            File.Delete(chunkFile); // Optionally delete chunk after combining
                        }
                    }

                    Directory.Delete(uploadDir); // Clean up chunk directory
                }
                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = model.FileName;
                objFileModel.NewFileName = model.FileName;
                objFileModel.FileUrl = finalFilePath;
                objFileModel.FileSize = ConvertBytesToMegabytes(model.FileSize).ToString();


                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "File Uploaded";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "File Uploaded";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                return objCustomResponseModel;
            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                return objCustomResponseModel;
            }
        }
        public override CustomResponseModel DownloadFile(FileModel objFileModel)
        {
            try
            {
                string base64File = string.Empty;

                bool IsFileExists = true;
                // Construct the file path based on the FileModel properties
                // Convert the relative path to a physical server path
                string serverPath = HttpContext.Current.Server.MapPath(objFileModel.FileUrl);
                // Check if the file exists
                if (!File.Exists(serverPath))
                {
                    IsFileExists = false;
                }
                if (IsFileExists)
                {
                    // Read the file into a byte array
                    var fileBytes = File.ReadAllBytes(serverPath);
                    // Convert the file to Base64 string (if returning as string response)
                    base64File = Convert.ToBase64String(fileBytes);
                }


                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileStream = base64File;
                objCustomResponseModel.FileModel = objFileModel;
                objCustomResponseModel.IsFileExists = IsFileExists;
                return objCustomResponseModel;

            }
            catch (Exception ex)
            {
                CommonMethods.Error(ex);
                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = ex.Message + " " + ex.StackTrace;
                objCustomResponseModel.CommomDropDownData = null;
                return objCustomResponseModel;
            }
        }

        private async Task SaveFileAsync(HttpPostedFile file, string filePath)
        {
            using (var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, true))
            {
                await file.InputStream.CopyToAsync(fileStream);
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

    }
}