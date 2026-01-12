using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

public class clsDataBaseHelper
{
    private static string connectionstring;
    //private static string connectionstring_EWAMS;
    static clsDataBaseHelper()
    {
        string conn = GetConnectionStringFromAuth();
        if (!string.IsNullOrWhiteSpace(conn))
        {
            connectionstring = conn;
        }
        else
        {
            connectionstring = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
        }
    }
    public static string getConnectionStr()
    {
        string conn = GetConnectionStringFromAuth();
        if (!string.IsNullOrWhiteSpace(conn))
        {
            connectionstring = conn;
        }
        else
        {
            connectionstring = ConfigurationManager.ConnectionStrings["connectionstring"].ToString();
        }
        return connectionstring;
    }
    public static string fnGetOther_FieldName(string sTableName, string sRetColName, string sConColName, string sConColValue, string sExtraQuery)
    {
        string sQuery = "SELECT " + sRetColName + " AS RET_VAL FROM " + sTableName + " WHERE " + sConColName + " ='" + sConColValue + "'" + sExtraQuery;
        DataSet ds = ExecuteDataSet(sQuery);
        if (ds.Tables[0].Rows.Count > 0)
        {
            return Convert.ToString(ds.Tables[0].Rows[0]["RET_VAL"]);
        }
        else
        {
            return "";
        }

    }
    private static string GetConnectionStringFromAuth()
    {
        try
        {
            var context = HttpContext.Current;
            if (context != null && context.Request != null)
            {
                string authToken = context.Request.QueryString["auth"];

                if (!string.IsNullOrWhiteSpace(authToken))
                {
                    // 🧠 You can implement your own logic here
                    // Example: pull from configuration, or decrypt and derive from token
                    return clsApplicationSetting.DecryptQueryString(authToken)[3];
                }
            }
        }
        catch
        {
            // log error if needed
        }

        return null;
    }
    

    public static string fnGetFieldName(string sTableName, string sRetColName)
    {
        string sQuery = "SELECT " + sRetColName + " AS RET_VAL FROM " + sTableName;
        DataSet ds = ExecuteDataSet(sQuery);
        if (ds.Tables[0].Rows.Count > 0)
        {
            return Convert.ToString(ds.Tables[0].Rows[0]["RET_VAL"]);
        }
        else
        {
            return "";
        }

    }

    public static string fnGetFieldNameWithString(string sTableName, string sRetColName)
    {
        string sQuery = "SELECT " + sRetColName + " AS RET_VAL FROM " + sTableName;
        DataSet ds = ExecuteDataSet(sQuery);
        if (ds.Tables[0].Rows.Count > 0)
        {
            return Convert.ToString(ds.Tables[0].Rows[0]["RET_VAL"]);
        }
        else
        {
            return "";
        }

    }
    public static int ExecuteSclar(string sql)
    {
        SqlConnection con = new SqlConnection(getConnectionStr());
        con.Open();
        try
        {
            SqlCommand cmd = new SqlCommand(sql, con);
            cmd.CommandTimeout = 5000;
            int retval = Convert.ToInt32(cmd.ExecuteScalar());
            con.Close();
            return retval;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con.State == ConnectionState.Open)
            {
                con.Close();
            }
        }
    }
    public static int ExecuteNonQuery(string sql)
    {

        SqlConnection con = new SqlConnection(getConnectionStr());
        con.Open();
        try
        {
            SqlCommand cmd = new SqlCommand(sql, con);
            cmd.CommandTimeout = 5000;
            int retval = cmd.ExecuteNonQuery();
            con.Close();
            return retval;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con.State == ConnectionState.Open)
            {
                con.Close();
            }
        }
    }

    public static int ExecuteNonQueryWithConString(string sql, string constr)
    {

        SqlConnection con = new SqlConnection(constr);
        con.Open();
        try
        {
            SqlCommand cmd = new SqlCommand(sql, con);
            cmd.CommandTimeout = 5000;
            int retval = cmd.ExecuteNonQuery();
            con.Close();
            return retval;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con.State == ConnectionState.Open)
            {
                con.Close();
            }
        }
    }

    public static int ExecuteNonQueryReturnMax(string sql)
    {

        SqlConnection con = new SqlConnection(getConnectionStr());
        con.Open();
        try
        {
            SqlCommand cmd = new SqlCommand(sql, con);
            cmd.CommandTimeout = 5000;
            cmd.ExecuteNonQuery();
            cmd.CommandText = "Select isnull(Scope_identity(),0)";
            int retval = 0;
            retval = Convert.ToInt32(cmd.ExecuteScalar());
            con.Close();
            return retval;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (con.State == ConnectionState.Open)
            {
                con.Close();
            }
        }
    }

    public static DataSet ExecuteDataSetByOtherConnection(string sql, string ConnectionString)
    {
        DataSet ds = new DataSet();
        SqlDataAdapter da;
        da = new SqlDataAdapter(sql, ConnectionString);
        da.SelectCommand.CommandTimeout = 0;
        da.Fill(ds);
        return ds;
    }

    public static DataSet ExecuteDataSet(string sql)
    {
        DataSet ds = new DataSet();
        try
        {
            SqlDataAdapter da;
            da = new SqlDataAdapter(sql, getConnectionStr());
            da.SelectCommand.CommandTimeout = 0;
            da.Fill(ds);
        }
        catch (Exception ex)
        {

            throw;
        }

        return ds;
    }


    public static DataSet ExecuteDataSet(string sql, SqlParameter[] @params)
    {
        DataSet ds = new DataSet();
        SqlDataAdapter da = new SqlDataAdapter(sql, getConnectionStr());
        da.SelectCommand.CommandType = CommandType.StoredProcedure;
        da.SelectCommand.CommandTimeout = 0;
        for (int i = 0; i <= @params.Length - 1; i++)
        {
            da.SelectCommand.Parameters.AddWithValue(@params[i].ParameterName, @params[i].Value);
        }
        da.Fill(ds);
        return ds;

    }
    public static DataSet ExecuteDataSetWithCon(string sql, SqlParameter[] @params, string Con)
    {
        DataSet ds = new DataSet();
        SqlDataAdapter da = new SqlDataAdapter(sql, Con);
        da.SelectCommand.CommandType = CommandType.StoredProcedure;
        da.SelectCommand.CommandTimeout = 0;
        for (int i = 0; i <= @params.Length - 1; i++)
        {
            da.SelectCommand.Parameters.AddWithValue(@params[i].ParameterName, @params[i].Value);
        }
        da.Fill(ds);
        return ds;

    }    
    public static DataTable ExecuteDataTable(string sql, string TableName)
    {

        DataTable dt = new DataTable();
        DataSet ds = new DataSet();
        SqlDataAdapter da = new SqlDataAdapter(sql, getConnectionStr());
        dt.TableName = TableName;
        da.Fill(dt);
        return dt;
    }
    public static int CheckRecord(string str)
    {

        SqlConnection cnn = new SqlConnection(getConnectionStr());
        SqlCommand cmd = new SqlCommand(str, cnn);
        int check = 0;
        SqlDataReader dr = default(SqlDataReader);

        cmd.CommandTimeout = 5000;
        cnn.Open();
        dr = cmd.ExecuteReader();

        if (dr.HasRows == false)
        {
            check = 0;
        }
        else
        {
            check = 1;
        }

        dr.Close();
        cnn.Close();

        return check;

    }


    public static string ExecuteSingleResult(string query)
    {
        string functionReturnValue = null;
        functionReturnValue = "";
        SqlConnection cnn = new SqlConnection(getConnectionStr());
        SqlCommand cmd = new SqlCommand(query, cnn);
        cmd.CommandTimeout = 5000;

        string result = "";
        SqlDataReader dr = default(SqlDataReader);
        cnn.Open();
        dr = cmd.ExecuteReader();

        try
        {
            if (dr.HasRows)
            {
                dr.Read();
                if (!dr.IsDBNull(0))
                {
                    result = Convert.ToString(dr[0]);
                }
            }
            else
            {
                result = "";
            }

            dr.Close();
            cnn.Close();
            return result;
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (cnn.State == ConnectionState.Open)
            {
                cnn.Close();
            }
        }
        return functionReturnValue;

    }
    public static SqlConnection getConnection()
    {
        SqlConnection con = new SqlConnection(getConnectionStr());
        return con;
    }

    public static string ExecuteSingleResultScalar(string query)
    {
        SqlConnection cnn = default(SqlConnection);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandTimeout = 5000;
        //int check = 0;
        object result = null;
        //  Dim dr As SqlDataReader
        cnn = clsDataBaseHelper.getConnection();
        cnn.Open();
        cmd.Connection = cnn;
        cmd.CommandText = query;
        try
        {
            result = cmd.ExecuteScalar();
            cnn.Close();

            if (!Convert.IsDBNull(result))
            {
                result = Convert.ToString(result);
            }
            else
            {
                result = "";
            }

        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            if (cnn.State == ConnectionState.Open)
            {
                cnn.Close();
            }
        }
        return result.ToString();
    }

    public static void ExecuteSp(string spName, SqlParameter[] oParam)
    {
        SqlConnection con = default(SqlConnection);
        SqlCommand Com = new SqlCommand();
        SqlTransaction Tran = default(SqlTransaction);
        //string StrCom = "'";
        con = getConnection();
        con.Open();
        Tran = con.BeginTransaction();
        try
        {
            Com.Connection = con;
            Com.Transaction = Tran;
            Com.CommandText = spName;
            Com.CommandType = CommandType.StoredProcedure;
            CollectInputParams(ref Com, oParam);
            Com.ExecuteNonQuery();
            Tran.Commit();
        }
        catch (Exception ex)
        {
            Tran.Rollback();
            throw ex;
        }
        finally
        {
            Com.Dispose();
            Tran.Dispose();
            con.Close();
            con.Dispose();
        }

    }
    private static void CollectInputParams(ref SqlCommand oCommand, SqlParameter[] oParam)
    {
        int ic = 0;
        for (ic = 0; ic <= oParam.Length - 1; ic++)
        {
            if (oParam[ic] == null)
            {
            }
            else
            {
                oCommand.Parameters.Add(oParam[ic]);
            }
        }
    }

    public static int executeArrayOfSql(ArrayList sqlQueryArr)
    {
        int intResult = 0;
        try
        {
            int i = 0;
            SqlConnection mCon = default(SqlConnection);
            mCon = getConnection();
            mCon.Open();

            SqlCommand mDataCom = new SqlCommand();
            mDataCom.Connection = mCon;

            SqlTransaction tran = default(SqlTransaction);
            tran = mCon.BeginTransaction();
            mDataCom.Transaction = tran;
            try
            {


                for (i = 0; i <= sqlQueryArr.Count - 1; i++)
                {
                    mDataCom.CommandText = sqlQueryArr[i].ToString();
                    intResult = intResult + mDataCom.ExecuteNonQuery();
                }

                tran.Commit();

            }
            catch (Exception ex)
            {
                intResult = 0;
                tran.Rollback();

            }
            mCon.Close();
            mCon.Dispose();
        }
        catch (Exception ex)
        {
            intResult = 0; throw ex;
        }
        return intResult;
    }

    public static DataSet GetExcelDataAsDataSet(string ExcelFilePath)
    {
        DataSet objDataset = new DataSet();
        try
        {

            string OledbConnectionString = string.Empty;
            OleDbConnection objConn = null/* TODO Change to default(_) if this is not a reference type */;
            try
            {
                OledbConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + ExcelFilePath + ";Extended Properties=Excel 12.0 Xml;";
            }
            catch (Exception ex)
            {
                OledbConnectionString = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + ExcelFilePath + ";Extended Properties=Excel 8.0;";
            }

            objConn = new OleDbConnection(OledbConnectionString);

            if (objConn.State == ConnectionState.Closed)
                objConn.Open();
            DataTable dtExcelSchema;
            dtExcelSchema = objConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null/* TODO Change to default(_) if this is not a reference type */);
            string SheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
            OleDbCommand objCmdSelect = new OleDbCommand("SELECT * FROM [" + SheetName + "]", objConn);
            OleDbDataAdapter objAdapter = new OleDbDataAdapter();
            objAdapter.SelectCommand = objCmdSelect;
            objAdapter.Fill(objDataset, "ExcelDataTable");
            objConn.Close();
        }
        catch (Exception ex)
        {
            HttpContext.Current.Response.Write(ex);
            objDataset = null;
        }
        return objDataset;
    }

    public static bool SaveImage(string Query, byte[] InputBannerImage)
    {
        try
        {
            SqlCommand SQLCommand = new SqlCommand();
            SqlConnection SQLConnection = new SqlConnection();

            SQLConnection = getConnection();
            SQLConnection.Open();
            SQLCommand.CommandText = Query;
            SQLCommand.CommandType = CommandType.Text;
            SQLCommand.Parameters.Add(new SqlParameter("@Image", InputBannerImage));
            SQLCommand.Connection = SQLConnection;
            SQLCommand.ExecuteNonQuery();
            SQLConnection.Close();

            return true;
        }
        catch (Exception ex)
        {
            return false;
        }

    }





}
