using BOERP.Web.Controllers;
using BOERP.Web.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOERP.Web.Areas.ManageFMSConfig.Controllers
{

    [CustomAuthorizeAttribute]
    public class ManageFMSConfigController : BaseController
    {
        // GET: ManageFMSConfig/FmsConfiguration
        public ActionResult FmsConfiguration(string auth)
        {
            if (!HasPermission("58", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }

            ViewBag.Auth = auth;
            return View();
        }



    }

}