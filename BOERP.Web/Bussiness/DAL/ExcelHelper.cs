using System;
using System.Data;
using System.Web;
using System.Text;
using System.IO;

namespace Sahaj.API.DAL
{
    /// <summary>
    /// Summary description for ExcelHelper
    /// </summary>
    public static class ExcelHelper
    {
        #region Private Variable
        //Row limits older Excel version per sheet
        const int rowLimit = 65000;
        #endregion

        #region Private Methods
        private static string getWorkbookTemplate()
        {
            StringBuilder osbTemplate = null;
            try
            {
                osbTemplate = new StringBuilder(string.Empty);
                osbTemplate.Append("<xml version>\r\n<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\r\n");
                osbTemplate.Append(" xmlns:o=\"urn:schemas-microsoft-com:office:office\"\r\n xmlns:x=\"urn:schemas- microsoft-com:office:excel\"\r\n xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\">\r\n");
                osbTemplate.Append(" <Styles>\r\n <Style ss:ID=\"Default\" ss:Name=\"Normal\">\r\n <Alignment ss:Vertical=\"Bottom\"/>\r\n <Borders/>");
                osbTemplate.Append("\r\n <Font/>\r\n <Interior/>\r\n <NumberFormat/>\r\n <Protection/>\r\n </Style>\r\n <Style ss:ID=\"BoldColumn\">\r\n <Font ");
                osbTemplate.Append("x:Family=\"Swiss\" ss:Bold=\"1\"/>\r\n </Style>\r\n <Style ss:ID=\"s62\">\r\n <NumberFormat");
                osbTemplate.Append(" ss:Format=\"@\"/>\r\n </Style>\r\n <Style ss:ID=\"Decimal\">\r\n <NumberFormat ss:Format=\"0.0000\"/>\r\n </Style>\r\n ");
                osbTemplate.Append("<Style ss:ID=\"Integer\">\r\n <NumberFormat ss:Format=\"0\"/>\r\n </Style>\r\n <Style ss:ID=\"DateLiteral\">\r\n <NumberFormat ");
                osbTemplate.Append("ss:Format=\"mm/dd/yyyy;@\"/>\r\n </Style>\r\n <Style ss:ID=\"s28\">\r\n");
                osbTemplate.Append("<Alignment ss:Horizontal=\"Left\" ss:Vertical=\"Top\" ss:ReadingOrder=\"LeftToRight\" ss:WrapText=\"1\"/>\r\n");
                osbTemplate.Append("<Font x:CharSet=\"1\" ss:Size=\"9\" ss:Color=\"#808080\" ss:Underline=\"Single\"/>\r\n");
                osbTemplate.Append("<Interior ss:Color=\"#FFFFFF\" ss:Pattern=\"Solid\"/></Style>\r\n</Styles>\r\n {0}</Workbook>");
                return osbTemplate.ToString();
            }
            finally
            {
                osbTemplate = null;
            }
        }

        private static string replaceXmlChar(string input)
        {
            input = input.Replace("&", "&amp;");
            input = input.Replace("<", "&lt;");
            input = input.Replace(">", "&gt;");
            input = input.Replace("\"", "&doub;");
            input = input.Replace("'", "&apos;");
            return input;
        }

        private static string getWorksheets(DataSet source)
        {
            StringWriter oswWorkSheet = null;
            float sheetCount = 0;
            try
            {
                oswWorkSheet = new StringWriter();
                if (source == null || source.Tables.Count == 0)
                {
                    oswWorkSheet.Write("<Worksheet ss:Name=\"Sheet1\"><Table><Row> <Cell  ss:StyleID=\"s62\"><Data ss:Type=\"String\"></Data> </Cell></Row></Table></Worksheet>");
                    return oswWorkSheet.ToString();
                }
                foreach (DataTable dt in source.Tables)
                {
                    if (dt.Rows.Count == 0)
                        oswWorkSheet.Write("<Worksheet ss:Name=\"" + replaceXmlChar(dt.TableName) + "\"><Table><Row><Cell  ss:StyleID=\"s62\"><Data ss:Type=\"String\"></Data></Cell></Row></Table></Worksheet>");
                    else
                    {
                        //write each row data
                        sheetCount = 0;
                        for (int i = 0; i < dt.Rows.Count; i++)
                        {
                            if ((i % rowLimit) == 0)
                            {
                                //add close tags for previous sheet of the same data table
                                if ((i / rowLimit) > sheetCount)
                                {
                                    oswWorkSheet.Write("</Table></Worksheet>");
                                    sheetCount = (i / rowLimit);
                                }
                                oswWorkSheet.Write("<Worksheet ss:Name=\"" + replaceXmlChar(dt.TableName) + (((i / rowLimit) == 0) ? "" : Convert.ToString(i / rowLimit)) + "\"><Table>");
                                //write column name row
                                oswWorkSheet.Write("<Row>");
                                foreach (DataColumn dc in dt.Columns)
                                    oswWorkSheet.Write(string.Format("<Cell ss:StyleID=\"BoldColumn\"><Data ss:Type=\"String\">{0}</Data></Cell>", replaceXmlChar(dc.ColumnName))); oswWorkSheet.Write("</Row>\r\n");
                            }
                            oswWorkSheet.Write("<Row>\r\n");
                            foreach (DataColumn dc in dt.Columns)
                                oswWorkSheet.Write(string.Format("<Cell ss:StyleID=\"s62\"><Data ss:Type=\"String\">{0}</Data></Cell>", replaceXmlChar(dt.Rows[i][dc.ColumnName].ToString())));
                            oswWorkSheet.Write("</Row>\r\n");
                        }
                        oswWorkSheet.Write("</Table></Worksheet>");
                    }
                }
                return oswWorkSheet.ToString();
            }
            finally
            {
                oswWorkSheet = null;
            }
        }

        private static string GetExcelXml(DataTable dtInput, string filename)
        {
            DataSet odsWorkSheet = null;
            string excelTemplate = string.Empty, worksheets = string.Empty, excelXml = string.Empty;
            try
            {
                odsWorkSheet = new DataSet();
                excelTemplate = getWorkbookTemplate();
                odsWorkSheet.Tables.Add(dtInput.Copy());
                worksheets = getWorksheets(odsWorkSheet);
                excelXml = string.Format(excelTemplate, worksheets);
                return excelXml;
            }
            finally
            {
                odsWorkSheet = null;
            }
        }

        private static string GetExcelXml(DataSet dsInput, string filename)
        {
            string excelTemplate = getWorkbookTemplate();
            string worksheets = getWorksheets(dsInput);
            string excelXml = string.Format(excelTemplate, worksheets);
            return excelXml;
        }
        #endregion

        #region Public Methods
        /// <summary>
        /// Generate multiple excel sheet for number of tables passed.
        /// </summary>
        /// <param name="dsInput">DataSet containing multiple table.</param>
        /// <param name="filename">Name of the file with .xls extension.</param>
        /// <param name="response">HttpResponse object.</param>
        //public static void ToExcel(DataSet dsInput, string filename, HttpResponse response)
        //{
        //    string excelXml = GetExcelXml(dsInput, filename);
        //    response.Clear();
        //    response.AppendHeader("Content-Type", "application/vnd.ms-excel");
        //    response.AppendHeader("Content-disposition", "attachment; filename=" + filename);
        //    response.Write(excelXml);
        //    response.Flush();
        //    response.End();
        //}
        /// <summary>
        /// Generate excel sheet for the data table passed.
        /// </summary>
        /// <param name="dtInput">DataTable whoes data needs to be displayed in the excel sheet.</param>
        /// <param name="filename">Name of the file with .xls extension.</param>
        /// <param name="response">HttpResponse object.</param>
        //public static void ToExcel(DataTable dtInput, string filename, HttpResponse response)
        //{
        //    DataSet odsToExcel = null;
        //    try
        //    {
        //        odsToExcel = new DataSet();
        //        odsToExcel.Tables.Add(dtInput.Copy());
        //        ToExcel(odsToExcel, filename, response);
        //    }
        //    finally
        //    {
        //        odsToExcel = null;
        //    }
        //}
        #endregion
    }
}
