using BOERP.Web.Controllers;
using SahajFramework.CommonClass;
using SahajFramework.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Templates = SahajFramework.Models.EmailTemplate;

namespace BOERP.Web.Areas.EmailTemplates.Controllers
{
    [CustomAuthorizeAttribute]
    public class EmailTemplatesController : BaseController
    {
        // GET: EmailTemplate/EmailTemplate
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult EmailTemplate(string auth)
        {
            if (!HasPermission("19", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            ViewBag.Auth = auth;
            var Modal = Common_SPU.GetEmailTemplateList(0).ToList();
            return View(Modal);
        }
        public ActionResult EmailTemplateAdd(string auth,int templateId)
        {
            if (!HasPermission("19", "R"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            ViewBag.Auth = auth;
            //string[] GetQueryString = clsApplicationSetting.DecryptQueryString(src);
            //ViewBag.GetQueryString = GetQueryString;
            //ViewBag.MenuID = GetQueryString[0];
            //ViewBag.TemplateID = GetQueryString[2];


            Templates Modal = new  Templates();
            if (templateId > 0)
            {
                Modal = Common_SPU.GetEmailTemplateList(templateId).FirstOrDefault();
            }
            return View(Modal);
        }

        [HttpPost]
        public ActionResult EmailTemplateAdd(string auth, SahajFramework.Models.EmailTemplate Modal, string Command)
        {
            if (!HasPermission("19", "W"))
            {
                string qString = auth;
                return RedirectToAction("PageNotFound", "Account", new { area = "", auth = qString }); // or custom view
            }
            ViewBag.Auth = auth;
            long SaveID = 0;
            bool status = false;
            string Msg = "";
            TempData["Success"] = "N";
            TempData["SuccessMsg"] = "Email Template Table is not Saved";

            if (string.IsNullOrEmpty(Modal.Body))
            {
                ModelState.AddModelError("Body", "Body Can't Be Blank");
            }
            if (ModelState.IsValid)
            {
                if (Command == "Add")
                {
                    SaveID = Common_SPU.fnSetEmailTemplate(Modal.ID, Modal.GroupName, Modal.TemplateName, Modal.SMSBody, Modal.Repository, Modal.Body, Modal.Subject, Modal.CCMail, Modal.BCCMail);
                    status = true;
                    Msg = "Email Template Updated Successfully";
                }
                if (status)
                {
                    TempData["Success"] = "Y";
                    TempData["SuccessMsg"] = Msg;
                }
                return RedirectToAction("EmailTemplate", "EmailTemplates", new { area = "", auth = ViewBag.Auth });
                //return RedirectToAction("EmailTemplate", new { auth = clsApplicationSetting.EncryptQueryString(ViewBag.Auth + "*" + "/EmailTemplates/EmailTemplate&templateId=0") });
            }
            else
            {
                return View(Modal);
            }
        }
    }
}