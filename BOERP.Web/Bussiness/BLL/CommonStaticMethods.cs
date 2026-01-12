using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;

namespace SahajFramework.BLL
{
    public static class CommonStaticMethods
    {
        public static byte[] GetFileContent(this Stream fileStream)
        {
            byte[] data = new byte[fileStream.Length];
            int br = fileStream.Read(data, 0, data.Length);
            if (br != fileStream.Length)
                throw new Exception();

            return data;
        }

        public static byte[] GetFileContent(this string filePath)
        {
            FileStream fs = File.OpenRead(filePath);
            byte[] data = new byte[fs.Length];
            int br = fs.Read(data, 0, data.Length);
            if (br != fs.Length)
                throw new IOException(filePath);

            return data;
        }
    }
}