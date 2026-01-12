using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace SahajFramework.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("*.json");

            routes.MapRoute(
                name: "LoginRoute",
                url: "",
                defaults: new { controller = "Account", action = "Login" }
            );

            routes.MapRoute(
                name: "LogoutRoute",
                url: "Logout",
                defaults: new { controller = "Account", action = "Logout" }
            );
            routes.MapRoute(
                name: "MyProfileRoute",
                url: "MyProfile",
                defaults: new { controller = "Account", action = "MyProfile" }
            );
            
            routes.MapRoute(
                name: "ChangePasswordRoute",
                url: "ChangePassword/{Token}",
                defaults: new { controller = "Account", action = "ChangePassword", Token = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DashboardRoute",
                url: "Dashboard/{Message}",
                defaults: new { controller = "Account", action = "Dashboard", Message = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "DownloadRoute",
                url: "Download/{AttachmentID}",
                defaults: new { controller = "Image", action = "Download"}
            );
            
            routes.MapRoute(
               name: "EncryptionRoute",
               url: "Encryption/{Token}/{Value}",
               defaults: new { controller = "Account", action = "Encryption" }
           );
            routes.MapRoute(
               name: "DecryptionRoute",
               url: "Decryption/{Token}/{Value}",
               defaults: new { controller = "Account", action = "Decryption" }
           );
            
            routes.MapRoute(
                name: "GetImageRoute",
                url: "GetImage/{AttachmentID}/{ContentType}/{FolderName}",
                defaults: new { controller = "Image", action = "GetImage", FolderName = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
