using NLog;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Sahaj.API
{
    public class MitraLogger
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public static void Error(string message, Exception ex)
        {
            logger.Error(ex, message);
            return;
        }

        public static void Error(string message)
        {
            logger.Error(message);
            return;
        }

        public static void Trace(string message)
        {
            logger.Trace(message);
            return;
        }

        public static void Info(string message)
        {
            logger.Info(message);
            return;
        }

        public static void Debug(string message)
        {
            logger.Debug(message);
            return;
        }      
        public static void Warn(string message)
        {
            logger.Warn(message);
            return;
        }

    }
}