using System;
using System.IO;

namespace STPVideoPlayer.DataLayer
{
    public abstract class TvPlayerRepositoryBase
    {
        public string ConnectionString
        {
            get
            {
                return System.Configuration.ConfigurationManager.ConnectionStrings["MongoDB"].ConnectionString;
            }
        }

        public string DataBaseName
        {
            get
            {
                return System.Configuration.ConfigurationManager.AppSettings["MongoDBName"];
            }
        }

        public DateTime XmlFileLastWriteDate
        {
            get
            {
                return new FileInfo(this.ProgramInitialFilePath).LastWriteTimeUtc;
            }
        }

        public string ProgramInitialFilePath
        {
            get
            {
                return System.Web.HttpContext.Current.Server.MapPath(
                    System.Configuration.ConfigurationManager.AppSettings["Program"]);
            }
        }
    }
}
