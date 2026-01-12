using Sahaj.API.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Sahaj.API.Interface
{
    public interface ICommon
    {
        DataTable UserRoleBasedonToken(string tokenId);
        bool ValidateClientKeys(string clientSecret, string clientAccessKey);
        CustomResponseModel AuthenticateUser(string username, string encryptedPwd);
        CustomResponseModel GenerateToken(Int64 userId);
        DataTable GetUserPermission(int userId, string operation, string screenId);
        CustomResponseModel PerformOperation(string globalXml, string screenId, int roleId, int userid, string operation, out string errorMessage);
        CustomResponseModel GetRecords(string globalXml, string screenId, int roleId, int userid, string operation, out string errorMessage);
        ScreenDBMappingModel GetScreenSP(string screenId, int roleId, string operation, out string errorMessage);

    }
}