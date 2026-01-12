using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace SahajFramework.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Remove XML formatter if you only want JSON
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            // Increase JSON max length
            var jsonFormatter = config.Formatters.JsonFormatter;

            jsonFormatter.SerializerSettings.MaxDepth = int.MaxValue; // Optional: deep object nesting

            // Set max content length (not part of formatter directly, but useful with hosting)
            jsonFormatter.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            jsonFormatter.SerializerSettings.PreserveReferencesHandling = Newtonsoft.Json.PreserveReferencesHandling.None;

            // Optional: Indented JSON for readability
            jsonFormatter.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.None;
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
