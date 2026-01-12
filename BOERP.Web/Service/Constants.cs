 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SahajFramework.Service
{
    public class Constants
    {
        public const int CommonUpload = 1;
        public const int AWSUpload = 2;
        public const int GoogleDriveUpload = 3;

        public const string clientSecret = "Data1";
        public const string clientAccessKey = "Data2";

        public const string GetDropDownWithAsyncAuth = "api/Generic/GetDropDownWithAsyncAuth"; 
        public const string PerformOperationAsync = "api/Generic/PerformOperationAsync";
        public const string GetRecordsAsync = "api/Generic/GetRecordsAsync";
        
        public const string DownloadFileWithAuth = "api/ContentManagement/DownloadFileWithAuth";
        public const string FileUploadAsync = "api/ContentManagement/FileUploadAsync";
        public const string DeleteFileWithAuth = "api/ContentManagement/DeleteFileWithAuth";
        public const string FileUploadAsyncWithAuth = "api/ContentManagement/FileUploadAsyncWithAuth";
                    
    }
}