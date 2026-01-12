using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace SahajFramework.CommonClass
{
    public static class HTMLHelper
    {
        public static MvcHtmlString IncludeVersionedJs(this HtmlHelper helper, string filename)
        {
            return MvcHtmlString.Create("<script type='text/javascript' src='" + filename + "?v=" + clsApplicationSetting.GetWebConfigValue("Version") + "'></script>");
        }
        public static MvcHtmlString IncludeVersionedCss(this HtmlHelper helper, string filename)
        {
            return MvcHtmlString.Create("<link href='" + filename + "?v=" + clsApplicationSetting.GetWebConfigValue("Version") + "' rel='stylesheet' />");
        }

        public static MvcHtmlString CreateAnchor(this HtmlHelper helper, string MenuID, string Link, string Text)
        {
            Link = (string.IsNullOrEmpty(MenuID) ? Link : Link + "?src=" + clsApplicationSetting.EncryptQueryString(MenuID + "*" + Link));
            return MvcHtmlString.Create("<a href='" + Link + "'>" + Text + "</a>");
        }
        public static MvcHtmlString CreateAnchor(this HtmlHelper helper, string MenuID, string Link, string Text, string ClassName)
        {
            Link = (string.IsNullOrEmpty(MenuID) ? Link : Link + "?src=" + clsApplicationSetting.EncryptQueryString(MenuID + "*" + Link));
            return MvcHtmlString.Create("<a class=\"" + ClassName + "\" href='" + Link + "'>" + Text + "</a>");
        }
        public static MvcHtmlString CreateAnchor(this HtmlHelper helper, string MenuID, string Link, string Text, string ClassName, string Tooltip)
        {
            Link = (string.IsNullOrEmpty(MenuID) ? Link : Link + "?src=" + clsApplicationSetting.EncryptQueryString(MenuID + "*" + Link));
            Tooltip = (string.IsNullOrEmpty(Tooltip) ? "" : "data-toggle='tooltip' data-original-title=\"" + Tooltip + "\"");
            return MvcHtmlString.Create("<a target=\"" + Tooltip + "\" class=\"" + ClassName + "\" href='" + Link + "'>" + Text + "</a>");
        }
        public static MvcHtmlString CreateAnchor(this HtmlHelper helper, string MenuID, string Link, string Text, string ClassName, string Tooltip, string Target)
        {
            Link = (string.IsNullOrEmpty(MenuID) ? Link : Link + "?src=" + clsApplicationSetting.EncryptQueryString(MenuID + "*" + Link));
            Tooltip = (string.IsNullOrEmpty(Tooltip) ? "" : "data-toggle='tooltip' data-original-title=\"" + Tooltip + "\"");
            return MvcHtmlString.Create("<a " + Tooltip + " target=\"" + Target + "\" class=\"" + ClassName + "\" href='" + Link + "'>" + Text + "</a>");
        }
        public static MvcHtmlString CreateAnchor(this HtmlHelper helper, string MenuID, string Link, string Text, string ClassName, string Tooltip, string FAIcons, string Target)
        {
            Link = (string.IsNullOrEmpty(MenuID) ? Link : Link + "?src=" + clsApplicationSetting.EncryptQueryString(MenuID + "*" + Link));
            Tooltip = (string.IsNullOrEmpty(Tooltip) ? "" : "data-toggle='tooltip' data-original-title=\"" + Tooltip + "\"");
            Text = (string.IsNullOrEmpty(FAIcons) ? Text : "<i class=\"" + FAIcons + "\" aria-hidden='true'></i> " + Text);
            return MvcHtmlString.Create("<a " + Tooltip + " target=\"" + Target + "\" class=\"" + ClassName + "\" href='" + Link + "'>" + Text + "</a>");
        }


        public static MvcHtmlString CreateTooltip(this HtmlHelper helper, string ClassName, string Text)
        {
            return MvcHtmlString.Create("<i class=\"" + ClassName + "\" data-toggle='tooltip' data-original-title=\"" + Text + "\" ></i>");
        }
        public static MvcHtmlString CreateTooltip(this HtmlHelper helper, string ClassName, string Text, string Name)
        {
            return MvcHtmlString.Create("<i class=\"" + ClassName + "\"  data-toggle='tooltip' data-original-title=\"" + Text + "\" >" + Name + "</i>");
        }


        public static MvcHtmlString CreateColorPopHover(this HtmlHelper helper, string ID, string ClassName, List<(string, string)> LiList)
        {
            ClassName = (string.IsNullOrEmpty(ClassName) ? "" : "class=\"" + ClassName + "\"");
            string innerHTML = "<i " + ClassName + " data-popover-content='#" + ID + "' data-toggle='popover' data-placement='right'></i>";
            innerHTML += "<div id='" + ID + "' style='display: none'>";
            innerHTML += "<div class='popover-body'>";
            innerHTML += "<button type='button' class='popover-close close'><i class='fas fa-times'></i></button>";
            innerHTML += "<ul class='colorwheel list-unstyled'>";
            if (LiList != null)
            {
                foreach (var item in LiList)
                {
                    innerHTML += "<li><span class=\"triangle-dgn " + item.Item2 + "\"></span>" + item.Item1 + "</li>";
                }
            }
            innerHTML += "</ul></div></div>";
            return MvcHtmlString.Create(innerHTML);
        }
     
     


        public static MvcHtmlString CreateImage(this HtmlHelper helper, string Link, string alt = "", string ClassName = "")
        {
            string path = "", IsbyteImage = clsApplicationSetting.GetWebConfigValue("WantImagesInBytes");
            ClassName = (string.IsNullOrEmpty(ClassName) ? "" : "class=\"" + ClassName + "\"");
            alt = (string.IsNullOrEmpty(alt) ? "" : "alt=\"" + alt + "\"");
            path = clsApplicationSetting.GetPhysicalPath("Images") + "\\" + Link;
            try
            {
                if (!System.IO.File.Exists(path))
                {
                    path = HttpContext.Current.Server.MapPath("~/assets/design/images/NoImage.png");
                }
                if (IsbyteImage == "Y")
                {
                    byte[] byteData = System.IO.File.ReadAllBytes(path);
                    string imreBase64Data = Convert.ToBase64String(byteData);
                    path = string.Format("data:image/png;base64,{0}", imreBase64Data);
                }
                else
                {
                    path = clsApplicationSetting.ReverseMapPath(path);
                }

            }
            catch (Exception ex)
            {
                path = HttpContext.Current.Server.MapPath("~/assets/design/images/NoImage.png");
                throw ex;
            }

            return MvcHtmlString.Create("<img src='" + path + "' " + ClassName + " " + alt + " />");
        }

       
    }
}