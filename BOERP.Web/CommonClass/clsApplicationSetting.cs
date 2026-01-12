using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data;
using System.Security.Cryptography;
using System.IO;
using System.Text;
using Microsoft.VisualBasic;
using SahajFramework.Models;
using SahajFramework.CommonClass;
using TaxEncryptDecrypt;
using Newtonsoft.Json;
public class clsApplicationSetting
{
  

    public static string EncryptQueryString(string Value)
    {
        string strBuff = "";
        if (!string.IsNullOrEmpty(Value))
        {
            strBuff = EncryptFriendly(Value);
        }
        return strBuff;
    }
    public static string[] DecryptQueryString(string EncrptredValue)
    {
        string[] MyMenu = null;
        string Value = "";
        try
        {
            if (!string.IsNullOrEmpty(EncrptredValue))
            {
                Value = DecryptFriendly(EncrptredValue);
                if (Value.Contains("*"))
                {
                    MyMenu = Value.Split('*');
                }
                else
                {
                    MyMenu = new string[1];
                    MyMenu[0] = Value;
                }
            }
        }
        catch (Exception ex)
        {
            ClsCommon.LogError("Error during DecryptQueryString. The query was executed :", ex.ToString(), EncrptredValue, "ClsCommon", "ClsCommon", "");
            HttpContext.Current.Response.Redirect("~/Account/PageNotFound");
        }
        return MyMenu;

    }
    public static string EncryptFriendly(string strText)
    {
        string strBuff = "";
        if (!string.IsNullOrEmpty(strText))
        {
            strBuff = clsEncryptDecrypt.fnEncrypt(strText);
        }
        return strBuff;
    }
    public static string DecryptFriendly(string strText)
    {
        string strBuff = "";
        if (!string.IsNullOrEmpty(strText))
        {
            strBuff = clsEncryptDecrypt.fnDecrypt(strText);
        }
        return strBuff;
    }
    public static string Encrypt(string strText)
    {
        string EncryptionKey = "Sahaj$Infotech";
        int i, c;
        string strBuff = "";
        if (Strings.Len(EncryptionKey) > 0)
        {
            for (i = 1; i <= Strings.Len(strText); i++)
            {
                c = Strings.Asc(Strings.Mid(strText, i, 1));
                c = c + Strings.Asc(Strings.Mid(EncryptionKey, (i % Strings.Len(EncryptionKey)) + 1, 1));
                strBuff = strBuff + Strings.Chr(c & 0xFF);
            }
        }
        else
            strBuff = strText;

        return strBuff;
    }
    public static string Decrypt(string strText)
    {
        string EncryptionKey = "Sahaj$Infotech";
        int i, c;
        string strBuff = "";
        // Decrypt string
        if (Strings.Len(EncryptionKey) > 0)
        {
            for (i = 1; i <= Strings.Len(strText); i++)
            {
                c = Strings.Asc(Strings.Mid(strText, i, 1));
                c = c - Strings.Asc(Strings.Mid(EncryptionKey, (i % Strings.Len(EncryptionKey)) + 1, 1));
                strBuff = strBuff + Strings.Chr(c & 0xFF);
            }
        }
        else
            strBuff = strText;
        return strBuff;
    }
    public static string EncryptSecure(string clearText)
    {
        try
        {
            if (!string.IsNullOrEmpty(clearText))
            {
                string EncryptionKey = "Sahaj$Infotech";
                byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
                using (Aes encryptor = Aes.Create())
                {
                    Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                    encryptor.Key = pdb.GetBytes(32);
                    encryptor.IV = pdb.GetBytes(16);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(clearBytes, 0, clearBytes.Length);
                            cs.Close();
                        }
                        clearText = Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
        }
        catch (Exception ex)
        {
            ClsCommon.LogError("Error during EncryptSecure. The query was executed :", ex.ToString(), clearText, "clsApplicationSetting", "clsApplicationSetting", "");
            //HttpContext.Current.Response.Redirect("~/Logout");
        }
        return clearText;
    }
    public static string DecryptSecure(string cipherText)
    {
        try
        {
            if (!string.IsNullOrEmpty(cipherText))
            {

                string EncryptionKey = "Sahaj$Infotech";
                cipherText = cipherText.Replace(" ", "+");
                byte[] cipherBytes = Convert.FromBase64String(cipherText);
                using (Aes encryptor = Aes.Create())
                {
                    Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                    encryptor.Key = pdb.GetBytes(32);
                    encryptor.IV = pdb.GetBytes(16);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(cipherBytes, 0, cipherBytes.Length);
                            cs.Close();
                        }
                        cipherText = Encoding.Unicode.GetString(ms.ToArray());
                    }
                }
            }
        }
        catch (Exception ex)
        {
            ClsCommon.LogError("Error during DecryptSecure. The query was executed :", ex.ToString(), cipherText, "clsApplicationSetting", "clsApplicationSetting", "");
           // HttpContext.Current.Response.Redirect("~/Logout");
        }
        return cipherText;
    }

    public static string GetUrlQueryString(string str)
    {
        string Url = str.Replace("==ampercent==", "&").Replace("==hash==", "#").Replace("==percent==", "%").Replace("==slash==", "/").Replace("==fslash==", "\\").Replace("==star==", "*").Replace("==dot==", ".").Replace("==colon==", ":").Replace("==semicolon==", ";").Replace("==pluse==", "+");
        return Url;
    }
    public static string SetUrlQueryString(string str)
    {
        string Url = str.Replace("&", "==ampercent==").Replace("#", "==hash==").Replace("%", "==percent==").Replace("/", "==slash==").Replace("==fslash==", "\\").Replace("*", "==star==").Replace(".", "==dot==").Replace(":", "==colon==").Replace(";", "==semicolon==").Replace("+", "==pluse==");
        return Url;
    }

    public static string GetWebConfigValue(string Key)
    {
        string functionReturnValue = null;
        functionReturnValue = "";
        try
        {
            return ConfigurationManager.AppSettings[Key].ToString();
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.Write("Key " + Key + "<br>" + ex.Message);
            HttpContext.Current.Response.End();
        }
        return functionReturnValue;

    }


    public static bool SetSessionValueWithoutEncript(string SessionName, string SessionValue)
    {
        HttpCookie Cook = default(HttpCookie);

        try
        {
            string CookiesExpireTime = GetWebConfigValue("CookiesExpireTime");
            Cook = new HttpCookie(SessionName, SessionValue);
            if (!string.IsNullOrEmpty(CookiesExpireTime))
            {

                Cook.Expires = DateTime.Now.AddMinutes(Convert.ToInt32(CookiesExpireTime));
            }
            else
            {
                Cook.Expires = DateTime.Now.AddDays(1);
            }
            HttpContext.Current.Response.Cookies.Add(Cook);
            HttpContext.Current.Session.Add(SessionName, SessionValue);
            return true;
        }
        catch (Exception ex)
        {
            return false;
        }

    }


    #region Session And Cookies By Ravi
    //Maintain Session And Cookies By Ravi Start 
    public static bool SetSessionValue(string SessionName, string SessionValue)
    {
        try
        {
            string CookiesExpireTime = GetWebConfigValue("CookiesExpireTime");
            if (!string.IsNullOrEmpty(CookiesExpireTime))
            {
                HttpContext.Current.Session[SessionName] = SessionValue;
                HttpContext.Current.Session.Timeout = Convert.ToInt32(CookiesExpireTime);

            }
            else
            {
                HttpContext.Current.Session[SessionName] = SessionValue;
            }
            return true;
        }
        catch (Exception ex)
        {
            return false;
            throw ex;
        }

    }
    public static bool SetApplicationValue(string SessionName, string SessionValue)
    {
        try
        {
            HttpContext.Current.Application[SessionName] = SessionValue;
            return true;
        }
        catch (Exception ex)
        {
            return false;
            throw ex;
        }

    }
     
    public static string GetSessionValue(string sessionname)
    {
        string SessionValue = null;
        if ((HttpContext.Current.Session[sessionname] != null))
        {
            SessionValue = HttpContext.Current.Session[sessionname].ToString();
        }
        return SessionValue;

    }
    public static string GetApplicationValue(string sessionname)
    {
        string SessionValue = null;
        if ((HttpContext.Current.Application[sessionname] != null))
        {
            SessionValue = HttpContext.Current.Application[sessionname].ToString();
        }
        return SessionValue;

    }
    
    public static bool SetCookiesValue(string CookiesName, string CookiesValue)
    {
        HttpCookie Cook = default(HttpCookie);

        try
        {
            string CookiesExpireTime = GetWebConfigValue("CookiesExpireTime");
            Cook = new HttpCookie(CookiesName, EncryptSecure(CookiesValue));
            if (!string.IsNullOrEmpty(CookiesExpireTime))
            {
                Cook.Expires = DateTime.Now.AddMinutes(Convert.ToInt32(CookiesExpireTime));
            }
            else
            {
                Cook.Expires = DateTime.Now.AddDays(1);
            }
            HttpContext.Current.Response.Cookies.Add(Cook);
            HttpContext.Current.Session.Add(CookiesName, CookiesValue);
            return true;
        }
        catch (Exception ex)
        {
            return false;
        }

    }
    public static string GetCookiesValue(string sessionname)
    {
        string SessionValue = null;
        if ((HttpContext.Current.Request.Cookies[sessionname] != null))
        {
            SessionValue = DecryptSecure(HttpContext.Current.Request.Cookies[sessionname].Value.ToString());
        }
        return SessionValue;

    }

    public static string GetCookiesValueWithoutDecript(string sessionname)
    {
        string SessionValue = null;
        if ((HttpContext.Current.Request.Cookies[sessionname] != null))
        {
            SessionValue =  HttpContext.Current.Request.Cookies[sessionname].Value.ToString();
        }
        return SessionValue;

    }

    public static bool ClearCookiesValue(string SessionName)
    {
        try
        {
            if (HttpContext.Current.Request.Cookies[SessionName] != null)
            {
                HttpContext.Current.Response.Cookies[SessionName].Expires = DateTime.Now.AddDays(-1);
            }

            HttpContext.Current.Session[SessionName] = "";

        }
        catch (Exception ex)
        {
            throw ex;
        }
        return true;
    }

    public static bool ClearSessionValues()
    {

        try
        {
            if (HttpContext.Current != null)
            {
                int cookieCount = HttpContext.Current.Request.Cookies.Count;
                for (var i = 0; i < cookieCount; i++)
                {
                    var cookie = HttpContext.Current.Request.Cookies[i];
                    if (cookie != null)
                    {
                        var expiredCookie = new HttpCookie(cookie.Name)
                        {
                            Expires = DateTime.Now.AddDays(-1),
                            Domain = cookie.Domain
                        };
                        HttpContext.Current.Response.Cookies.Add(expiredCookie); // overwrite it
                    }
                }

                // clear cookies server side
                HttpContext.Current.Request.Cookies.Clear();
                HttpContext.Current.Application.Clear();
                HttpContext.Current.Session.Clear();
                HttpContext.Current.Session.RemoveAll();
                HttpContext.Current.Session.Abandon();
                

            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
        return true;

    }

    public static bool UpdateCookieValue(string CookieName, string Value)
    {
        CookieName = CookieName.ToUpper();
        HttpCookie cook = new HttpCookie(CookieName, Value);
        HttpContext.Current.Response.Cookies.Add(cook);
        HttpContext.Current.Session[CookieName] = HttpContext.Current.Request.Cookies[CookieName].Value;
        return true;
    }

    public static bool IsSessionExpired(string SessionText)
    {

        bool IsExpired = false;

        //Or HttpContext.Current.Session[SessionText] Is Nothing Then
        if (HttpContext.Current.Session[SessionText] == null || HttpContext.Current.Session[SessionText].ToString() == "")
        {
            IsExpired = true;
        }

        return IsExpired;

    }
    public static bool IsCookiesExpired(string SessionText)
    {

        bool IsExpired = false;

        //Or HttpContext.Current.Session[SessionText] Is Nothing Then
        if (HttpContext.Current.Request.Cookies[SessionText] == null || HttpContext.Current.Request.Cookies[SessionText].ToString() == "")
        {
            IsExpired = true;
        }

        return IsExpired;

    }
    // Maintain Session And Cookies By Ravi End 
    #endregion

    #region Config Setting and File upload Ravi
    // Maintain Config Setting and File upload Ravi Start
    public static string GetURL(string subpath = "")
    {
        string functionReturnValue = null;
        functionReturnValue = "";
        try
        {
            if (subpath == "WebsiteURL")
            {
                functionReturnValue += ConfigurationManager.AppSettings["WebSiteURL"] + "/Attachments/UserDetails/";

            }

            else
            {
                functionReturnValue = "";
            }
        }
        catch (Exception ex)
        {
            throw ex;
        }
        return functionReturnValue;

    }

    public static string GetPhysicalPath(string pathFor = "")
    {
        string functionReturnValue = "";
        if (pathFor.ToLower() == "json")
        {
            if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Attachments/UserDetails/Jsondata")))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Attachments/UserDetails/Jsondata"));
            }
            functionReturnValue = HttpContext.Current.Server.MapPath("/Attachments/UserDetails/Jsondata");
        }
        else if (pathFor.ToLower() == "images")
        {
            if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/assets/design/images")))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/assets/design/images"));
            }
            functionReturnValue = HttpContext.Current.Server.MapPath("/assets/design/images");
        }
        else if (pathFor.ToLower() == "grievance")
        {
            if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Attachments/Grievance")))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Attachments/Grievance"));
            }
            functionReturnValue = HttpContext.Current.Server.MapPath("/Attachments/Grievance");
        }
        else if (pathFor.ToLower() == "signatorymaster")
        {
            if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Attachments/SignatoryMaster")))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Attachments/SignatoryMaster"));
            }
            functionReturnValue = HttpContext.Current.Server.MapPath("/Attachments/SignatoryMaster");
        }
        else if (pathFor.ToLower() == "onboarding")
            {
            if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Attachments/OnboardingDocuments")))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Attachments/OnboardingDocuments"));
            }
            functionReturnValue = HttpContext.Current.Server.MapPath("/Attachments/OnboardingDocuments");
        }
        else
        {
            if (!Directory.Exists(HttpContext.Current.Server.MapPath("~/Attachments")))
            {
                Directory.CreateDirectory(HttpContext.Current.Server.MapPath("~/Attachments"));
            }
            functionReturnValue = HttpContext.Current.Server.MapPath("/Attachments");
        }

        return functionReturnValue;
    }
    public static string ReverseMapPath(string Path)
    {
        string szRoot = HttpContext.Current.Server.MapPath("~");

        if (Path.StartsWith(szRoot))
        {
            return ("/" + Path.Replace(szRoot, string.Empty).Replace(@"\", "/"));
        }
        return ("");
    }

    public static string AllowedFileSize(string Type)
    {
        double byteCount = 0;
        if (Type == "Images")
        {
            double.TryParse(clsApplicationSetting.GetWebConfigValue("AllowedImageUploadSize"), out byteCount);
        }
        else
        {
            double.TryParse(clsApplicationSetting.GetWebConfigValue("AllowedFileUploadSize"), out byteCount);
        }

        return GetFileSize(byteCount);
    }

    public static string GetFileSize(double byteCount)
    {
        string size = "0 Bytes";
        if (byteCount >= 1073741824.0)
            size = String.Format("{0:##.##}", byteCount / 1073741824.0) + " GB";
        else if (byteCount >= 1048576.0)
            size = String.Format("{0:##.##}", byteCount / 1048576.0) + " MB";
        else if (byteCount >= 1024.0)
            size = String.Format("{0:##.##}", byteCount / 1024.0) + " KB";
        else if (byteCount > 0 && byteCount < 1024.0)
            size = byteCount.ToString() + " Bytes";

        return size;
    }

    //public static FileResponse ValidateFile(HttpPostedFileBase File)
    //{
    //    FileResponse obj = new FileResponse();
    //    try
    //    {
    //        obj.FileType = File.ContentType;
    //        obj.InputStream = File.InputStream;
    //        obj.FileName = System.IO.Path.GetFileName(File.FileName);
    //        obj.FileLength = File.ContentLength;
    //        obj.FileExt = System.IO.Path.GetExtension(File.FileName).ToLower();
    //        obj.IsValid = true;
    //        string AIMGExt = GetWebConfigValue("AllowedImageUploadExtension").ToLower();
    //        string AFExt = GetWebConfigValue("AllowedFileUploadExtension").ToLower();
    //        long AIMGSize, AFSize = 0, AMaxmiumSize = 0;
    //        long.TryParse(GetWebConfigValue("AllowedImageUploadSize"), out AIMGSize);
    //        long.TryParse(GetWebConfigValue("AllowedFileUploadSize"), out AFSize);
    //        AMaxmiumSize = (AIMGSize > AFSize ? AIMGSize : AFSize);

    //        obj.ReadAbleFileSize = GetFileSize(obj.FileLength);


    //        byte[] uploadedFile = new byte[File.InputStream.Length];
    //        File.InputStream.Read(uploadedFile, 0, uploadedFile.Length);
    //        obj.FileBase64String = Convert.ToBase64String(uploadedFile);

    //        BinaryReader chkBinary = new BinaryReader(obj.InputStream);
    //        Byte[] chkbytes = chkBinary.ReadBytes(0x10);
    //        string data_as_hex = BitConverter.ToString(chkbytes);
    //        string magicCheck = data_as_hex.Substring(0, 8);
    //        Dictionary<string, string> MDict = new Dictionary<string, string>();
    //        MDict = GetMagicNumnberDictionary();
    //        if (MDict != null && MDict.Count > 0)
    //        {
    //            if ((".txt").Contains(obj.FileExt))
    //            {
    //                obj.IsValid = true;
    //            }
    //            else if (MDict.ContainsKey(obj.FileExt))
    //            {
    //                if ((".jpg,.jpeg,.png").Contains(obj.FileExt))
    //                {
    //                    if (MDict[".jpg"].Substring(0, 8).Replace(" ", "-") != magicCheck && MDict[".jpeg"].Substring(0, 8).Replace(" ", "-") != magicCheck && MDict[".png"].Substring(0, 8).Replace(" ", "-") != magicCheck)
    //                    {
    //                        obj.IsValid = false;
    //                        var myKey = MDict.FirstOrDefault(x => x.Value.Contains(magicCheck)).Key;
    //                        obj.Message = "Please Upload Valid File with Original extension," + (!string.IsNullOrEmpty(myKey) ? "It seems it is " + myKey + " file" : "");
    //                    }
    //                }
    //                else if (MDict[obj.FileExt].Substring(0, 8).Replace(" ", "-") != magicCheck)
    //                {
    //                    obj.IsValid = false;
    //                    var myKey = MDict.FirstOrDefault(x => x.Value.Contains(magicCheck)).Key;
    //                    obj.Message = "Please Upload Valid File with Original extension," + (!string.IsNullOrEmpty(myKey) ? "It seems it is " + myKey + " file" : "");
    //                }
    //            }
    //            else if (obj.IsValid)
    //            {
    //                if (!(AIMGExt.Replace("|", ",")).Contains(obj.FileExt))
    //                {
    //                    obj.IsValid = false;
    //                    obj.Message = "Can't Upload Image Extention Must Be Matched";

    //                }
    //                else if (!(AFExt.Replace("|", ",")).Contains(obj.FileExt))
    //                {
    //                    obj.IsValid = false;
    //                    obj.Message = "Can't Upload File Extention Must Be Matched";

    //                }
    //                if (obj.IsValid)
    //                {
    //                    if ((AIMGExt.Replace("|", ",")).Contains(obj.FileExt) && obj.FileLength > AIMGSize)
    //                    {
    //                        obj.IsValid = false;
    //                        obj.Message = "Can't Upload Image Size Must Be Matched";

    //                    }
    //                    else if ((AFExt.Replace("|", ",")).Contains(obj.FileExt) && obj.FileLength > AFSize)
    //                    {
    //                        obj.IsValid = false;
    //                        obj.Message = "Can't Upload File Size Must Be Matched";

    //                    }
    //                }
    //            }
    //        }
    //        else
    //        {
    //            obj.IsValid = false;
    //            obj.Message = "Please Add Magic Number Into .Txt File";
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        throw ex;
    //        //ClsCommon.LogError("Error during Problem in ValidateFile. The query was executed :", ex.ToString(), "", "ClsApplicationSetting", "ClsApplicationSetting", "");
    //    }
    //    return obj;
    //}

  
    public static Dictionary<string, string> GetMagicNumnberDictionary()
    {
        Dictionary<string, string> MagicNumnberDictionary = new Dictionary<string, string>();
        try
        {

            string GetPath = HttpContext.Current.Server.MapPath("/Attachments/UserDetails/temp");
            if (System.IO.Directory.Exists(GetPath))
            {

                if (System.IO.File.Exists(GetPath + "/MagicNumber.txt"))
                {
                    using (StreamReader r = new StreamReader(GetPath + "/MagicNumber.txt"))
                    {
                        string json = r.ReadToEnd();
                        MagicNumnberDictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(json);
                    }
                }
            }


        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.Write(ex.Message);
            HttpContext.Current.Response.End();
        }

        return MagicNumnberDictionary;
    }

    private static Dictionary<string, string> GetConfigSettingPair()
    {
        Dictionary<string, string> obj = new Dictionary<string, string>();
        foreach (var item in ClsCommon.GetConfigJson())
        {
            obj.Add(item.ConfigKey, item.ConfigValue);
        }
        return obj;
    }
    public static string GetConfigValue(string KeyName)
    {
        string ValueType = "";
        if (GetConfigSettingPair().ContainsKey(KeyName))
        {
            ValueType = GetConfigSettingPair()[KeyName];
        }
        return ValueType;
    }
    // Maintain Config Setting and File upload Ravi End
    #endregion


    //public static PageViewPermission CheckPageViewPermission(string MenuID)
    //{
    //    string RoleIDs = clsApplicationSetting.GetSessionValue("RoleIDs");
    //    RoleIDs = ("@" + RoleIDs.Replace(",", "@") + "@");

    //    long MID = 0;
    //    PageViewPermission PageViewPermission = new PageViewPermission();
    //    try
    //    {

    //        long.TryParse(MenuID, out MID);
    //        var jsonModal = ClsCommon.GetMenuJSON();
    //        jsonModal = jsonModal.Where(w => RoleIDs.Contains("@" + w.RoleID + "@")).ToList();
    //        var MenuItems = jsonModal.Where(x=>x.MenuID == MID).ToList();

    //        if (MenuItems != null)
    //        {

    //            PageViewPermission.ReadFlag = MenuItems.Any(x => x.R==true);
    //            PageViewPermission.WriteFlag = MenuItems.Any(x => x.W == true);
    //            PageViewPermission.ModifyFlag = MenuItems.Any(x => x.M == true);
    //            PageViewPermission.DeleteFlag = MenuItems.Any(x => x.D == true);
    //            PageViewPermission.ExportFlag = MenuItems.Any(x => x.E == true);

    //            SetSessionValue("Read", PageViewPermission.ReadFlag.ToString());
    //            SetSessionValue("Write", PageViewPermission.WriteFlag.ToString());
    //            SetSessionValue("Modify", PageViewPermission.ModifyFlag.ToString());
    //            SetSessionValue("Delete", PageViewPermission.DeleteFlag.ToString());
    //            SetSessionValue("Export", PageViewPermission.ExportFlag.ToString());                
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //        ClsCommon.LogError("Error during CheckPageViewPermission. The query was executed :", ex.ToString(), "CheckPageViewPermission()", "clsCommon", "clsCommon", "");
    //        return null;
    //    }
    //    return PageViewPermission;
    //}

    public static PageViewPermission CheckPageViewPermission(string MenuID, long UserId)
    {
        string RoleIDs = "1";
        DataSet UserDataSet = default(DataSet);
        if (clsApplicationSetting.GetSessionValue("RoleIDs") != null)
        {
            RoleIDs = clsApplicationSetting.GetSessionValue("RoleIDs");
            RoleIDs = ("@" + RoleIDs.Replace(",", "@") + "@");
        }
        else
        {
            UserDataSet = Common_SPU.fnGetRollId(UserId);
            RoleIDs = UserDataSet.Tables[0].Rows[0]["RolesID"].ToString();
        }


        long MID = 0;
        PageViewPermission PageViewPermission = new PageViewPermission();
        try
        {

            long.TryParse(MenuID, out MID);
            var jsonModal = ClsCommon.GetMenuJSON();
            jsonModal = jsonModal.Where(w => RoleIDs.Contains("@" + w.RoleID + "@")).ToList();
            var MenuItems = jsonModal.Where(x => x.MenuID == MID).ToList();

            if (MenuItems != null)
            {

                PageViewPermission.ReadFlag = MenuItems.Any(x => x.R == true);
                PageViewPermission.WriteFlag = MenuItems.Any(x => x.W == true);
                PageViewPermission.ModifyFlag = MenuItems.Any(x => x.M == true);
                PageViewPermission.DeleteFlag = MenuItems.Any(x => x.D == true);
                PageViewPermission.ExportFlag = MenuItems.Any(x => x.E == true);

                SetSessionValue("Read", PageViewPermission.ReadFlag.ToString());
                SetSessionValue("Write", PageViewPermission.WriteFlag.ToString());
                SetSessionValue("Modify", PageViewPermission.ModifyFlag.ToString());
                SetSessionValue("Delete", PageViewPermission.DeleteFlag.ToString());
                SetSessionValue("Export", PageViewPermission.ExportFlag.ToString());
            }
        }
        catch (Exception ex)
        {
            ClsCommon.LogError("Error during CheckPageViewPermission. The query was executed :", ex.ToString(), "CheckPageViewPermission()", "clsCommon", "clsCommon", "");
            return null;
        }
        return PageViewPermission;
    }


    public static string GetImageLink(string AttachmentID, string ContentType, string FolderName = "")
    {
        long Attach = 0;
        string path = "";
        try
        {
            long.TryParse(AttachmentID, out Attach);
            path = (string.IsNullOrEmpty(FolderName) ? "/Attachments/" : "/" + FolderName + "/");
            path = path + Attach + ContentType;
            if (!System.IO.File.Exists(HttpContext.Current.Server.MapPath(path)) || Attach == 0)
            {
                path = "/assets/design/images/no-Image.svg";
            }
        }
        catch (Exception ex)
        {
            path = "/assets/design/images/no-Image.svg"; throw ex;
        }
        return path;
    }

    public static int GetCurrentQuarter()
    {
      int  quater = 0;
        string CurrentQuarter = DateTime.Now.ToString("MMM");
        if(("APR,MAY,JUN").Contains(CurrentQuarter.ToUpper()))
        {
            quater = 1;
        }
        else if (("JUL,AUG,SEP").Contains(CurrentQuarter.ToUpper()))
        {
            quater = 2;
        }
        else if (("OCT,NOV,DEC").Contains(CurrentQuarter.ToUpper()))
        {
            quater = 3;
        }
        else if (("JAN,FEB,MAR").Contains(CurrentQuarter.ToUpper()))
        {
            quater = 4;
        }
        return quater;
    }



}
