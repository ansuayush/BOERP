using Sahaj.API.BLL;
using Sahaj.API.Model; 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace Sahaj.API
{
   
   public abstract class UploadDownloadFactory
    {
        public enum UploadFactoryTypes
        {
            Common = 1,AWS, GoogleDrive,FTP
        }
        public static UploadDownloadFactory CreateFactory(UploadFactoryTypes plt)
        {
            switch (plt)
            {
                case UploadFactoryTypes.Common:
                    return new CommonFilesRepository();             


            }
            throw new System.NotSupportedException(string.Format("Drive Type: {0} is not implemented.", plt.ToString()));
        }

        public abstract Task<CustomResponseModel> FileUploadAsync(HttpPostedFile file, string jsonString);
        public abstract Task<CustomResponseModel> MultiFileUploadAsync(HttpFileCollection files, string jsonString);

        public abstract CustomResponseModel DownloadFile(FileModel objFileModel);
        public abstract CustomResponseModel DeleteFile(FileModel objFileModel, Int64 userId);
        public abstract CustomResponseModel UploadFileChunk(FileChunkModel model);
        

    }
}