using STPVideoPlayer.DataLayer;
using STPVideoPlayer.Facades;
using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace STPVideoPlayer.Controllers
{
    public class videoPlayerServerController : ApiController
    {
        static TimeLineModel generic = null;

        #region private methods
        internal static void parseLocalFile(string path, string filter, out LocalVideoModel local)
        {
            local = null;

            if (string.IsNullOrEmpty(path))
                return;

            if (string.IsNullOrEmpty(filter))
                filter = "*.*";

            if (path.StartsWith("local:"))
                path = path.Replace("local:", "");

            if (path.StartsWith("~/"))
            {
                path = System.Web.HttpContext.Current.Server.MapPath(path);
            }

            if (System.IO.Directory.Exists(path))
            {
                string[] files = System.IO.Directory.GetFiles(path, filter);

                local = new LocalVideoModel();

                local.Poster = files.FirstOrDefault(x => x.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase));
                local.M4V = files.FirstOrDefault(x => x.EndsWith(".m4v", StringComparison.OrdinalIgnoreCase));
                local.Mp4 = files.FirstOrDefault(x => x.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase));
                local.Ogv = files.FirstOrDefault(x => x.EndsWith(".ogv", StringComparison.OrdinalIgnoreCase));
                local.Webm = files.FirstOrDefault(x => x.EndsWith(".webm", StringComparison.OrdinalIgnoreCase));
            }
        }
        static videoPlayerServerController()
        {
            generic = TvPlayerRepositoryFactory.Instance.FindByName("generique");

            if (generic == null)
            {
                LocalVideoModel video = null;
                parseLocalFile(MapPath(System.Configuration.ConfigurationManager.AppSettings["generic"]), "*.*", out video);

                generic = new TimeLineModel()
                {
                    Local = video,
                    Name = "generique",
                    Type = "local"
                };

                TvPlayerRepositoryFactory.Instance.InsertOne(generic);
            }
        }

        public videoPlayerServerController()
        {

        }

        private static string MapPath(string v)
        {
            return System.Web.HttpContext.Current.Server.MapPath(v);
        }
        #endregion

        public HttpResponseMessage GetGeneric()
        {
            return Request.CreateResponse<TimeLineModel>(HttpStatusCode.OK, generic);
        }

        public HttpResponseMessage GetNextVideoTimeLine()
        {
            var timeLine = TvPlayerRepositoryFactory.Instance.FindByTime(DateTime.Now.TimeOfDay, DateTime.Now.TimeOfDay);

            //var timeLine = TvPlayerRepositoryFactory.Instance.FindNextByType(DateTime.Now.TimeOfDay, "youtube");

            if (timeLine == null)
            {
                var next = TvPlayerRepositoryFactory.Instance.NextOneByTime(DateTime.Now.TimeOfDay);

                if (next != null)
                {
                    timeLine = (TimeLineModel)generic.Clone();
                    timeLine.End = next.Start;
                }
                else {
                    timeLine = generic;
                }
            }

            if (timeLine != null) { 

                if(timeLine.Type.Equals("local", StringComparison.OrdinalIgnoreCase))
                {
                    timeLine.Local.Poster = GetVirtualPath(timeLine.Local.Poster);
                    timeLine.Local.M4V = GetVirtualPath(timeLine.Local.M4V);
                    timeLine.Local.Mp4 = GetVirtualPath(timeLine.Local.Mp4);
                    timeLine.Local.Ogv = GetVirtualPath(timeLine.Local.Ogv);
                    timeLine.Local.Webm = GetVirtualPath(timeLine.Local.Webm);
                }

                if(timeLine.Type.Equals("youtube", StringComparison.OrdinalIgnoreCase))
                {
                    if (timeLine.Youtube.VideoId.Contains("youtube:"))
                        timeLine.Youtube.VideoId = timeLine.Youtube.VideoId.Replace("youtube:", "");
                }

                return Request.CreateResponse<TimeLineModel>(HttpStatusCode.OK, timeLine);
            }
            else
                return Request.CreateResponse(HttpStatusCode.InternalServerError, "video not found");
        }

        public string GetVirtualPath(string physicalPath)
        {
            if (string.IsNullOrEmpty(physicalPath))
                return physicalPath;

            if (!physicalPath.StartsWith(HttpContext.Current.Request.PhysicalApplicationPath))
            {
                throw new InvalidOperationException("Physical path is not within the application root");
            }

            return VirtualPathUtility.ToAbsolute("~/" + physicalPath.Substring(HttpContext.Current.Request.PhysicalApplicationPath.Length)
                  .Replace("\\", "/"));
        }
    }
}