using BOERP.Web.Bussiness.BLL;
using Generic;
using Newtonsoft.Json;
using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Controllers
{
    public class CommonMethodController : Controller
    {

        //[SessionExpireFilterAttributeUserAdmin]


        [HttpGet]
        public JsonResult GetDropdown(int? ParentId, int masterTableType, bool isMasterTableType, bool isManualTable, int manualTable, int manualTableId)
        {
            ManageTaskBLL objCommonBussinessBLL = new ManageTaskBLL();
            try
            {

                string errorMessage = string.Empty;
                var data = objCommonBussinessBLL.GetDropDown(masterTableType, ParentId, isMasterTableType, isManualTable, manualTable, manualTableId);
                string jsonData = JsonConvert.SerializeObject(data);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet, MaxJsonLength = Int32.MaxValue };

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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };

            }


        }

        private void Upload(string filePathTobeSaved)
        {
            HttpContext.Request.Files[0].SaveAs(filePathTobeSaved);
        }
        private void CreateDirectoryIfNotExists(string NewDirectory)
        {
            if (!Directory.Exists(NewDirectory))
            {
                //If No any such directory then creates the new one
                Directory.CreateDirectory(NewDirectory);
            }

        }
        [HttpPost]
        public JsonResult DeleteFile(FileModel objFileModel)
        {
            try
            {

                string baseurl = HttpContext.Server.MapPath("~");
                baseurl = baseurl + '/' + objFileModel.FileUrl;
                System.IO.File.Delete(baseurl);

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "File has been deleted";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = "File has been deleted";
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        public JsonResult UploadDocument(string categoryText, string type, string SubCate)
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);
                if (categoryText.ToLower().Contains('/'))
                {
                    categoryText = categoryText.Replace("/", " ");
                }
                if (SubCate.ToLower().Contains('/'))
                {
                    SubCate = SubCate.Replace("/", " ");
                }
                baseurl = baseurl + "/" + categoryText + "/" + SubCate;
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/" + categoryText + "/" + SubCate + "/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }
        double ConvertBytesToMegabytes(long bytes)
        {
            return Math.Round(((bytes / 1024f) / 1024f), 2);
        }

        public JsonResult UploadOnBoardindDocument()
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseurl = baseurl + "/OnboardingDocuments";
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/OnboardingDocuments/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }
        public JsonResult UploadOtherDocument()
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseurl = baseurl + "/BOERPFile";
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/BOERPFile/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        public JsonResult UploadSampleDocument()
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseurl = baseurl + "/Sample";
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/Sample/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        public JsonResult UploadDelegationDocument()
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseurl = baseurl + "/Delegation";
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/Delegation/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        public JsonResult UploadCapacityDocument()
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseurl = baseurl + "/CapacityDocument";
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/CapacityDocument/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }

        public JsonResult UploadFMSControllerDocument()
        {
            try
            {

                string returrMessage = string.Empty;
                HttpFileCollectionBase files = Request.Files;
                HttpPostedFileBase file = files[0];
                string[] testfiles;
                string fname = "";
                if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                {
                    testfiles = file.FileName.Split(new char[] { '\\' });
                    fname = testfiles[testfiles.Length - 1];
                }
                else
                {
                    fname = file.FileName;
                }
                string fileName = fname;
                string newFile = Guid.NewGuid().ToString();
                string[] splString = fileName.Split('.');

                int extIndex = 1;
                if (splString.Length > 0)
                {
                    extIndex = splString.Length - 1;
                }

                string uploadNewFileName = newFile + "." + splString[extIndex];
                string filePathTobeSaved = "";
                string baseurl = HttpContext.Server.MapPath(ConfigurationManager.AppSettings["RootFolder"]);

                baseurl = baseurl + "/FMSControllerDoc";
                CreateDirectoryIfNotExists(baseurl);
                filePathTobeSaved = baseurl + "/" + uploadNewFileName;
                Upload(filePathTobeSaved);

                returrMessage = ConfigurationManager.AppSettings["RootFolder"].Replace("~", "") + "/FMSControllerDoc/" + uploadNewFileName;

                FileModel objFileModel = new FileModel();
                objFileModel.ActualFileName = fileName;
                objFileModel.NewFileName = uploadNewFileName;
                objFileModel.FileUrl = returrMessage;
                objFileModel.FileSize = ConvertBytesToMegabytes(file.ContentLength).ToString();

                CustomResponseModel objCustomResponseModel = new CustomResponseModel();
                objCustomResponseModel.ValidationInput = 0;
                objCustomResponseModel.ErrorMessage = "";
                objCustomResponseModel.data = null;
                objCustomResponseModel.CustomMessage = returrMessage;
                objCustomResponseModel.IsSuccessStatusCode = true;
                objCustomResponseModel.CustumException = "";
                objCustomResponseModel.CommomDropDownData = null;
                objCustomResponseModel.FileModel = objFileModel;

                string jsonData = JsonConvert.SerializeObject(objCustomResponseModel);
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };


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
                return new JsonResult { Data = jsonData, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            }

        }
    }
}