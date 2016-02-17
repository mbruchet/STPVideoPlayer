using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Web.Http;
using System.Web.Http.Routing;

namespace STPVideoPlayer.Controllers.Tests
{
    [TestClass()]
    public class TestsvideoPlayerServer
    {
        [TestMethod()]
        public void TestGetGeneric()
        {
            var videoServer = new videoPlayerServerController();

            videoServer.Request = new System.Net.Http.HttpRequestMessage
            {
                RequestUri = new Uri("http://localhost:9760/api/videoPlayerServer/GetGeneric")
            };

            videoServer.Configuration = new System.Web.Http.HttpConfiguration();

            videoServer.Configuration.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional });

            videoServer.RequestContext.RouteData = new HttpRouteData(
                route: new HttpRoute(),
                values: new HttpRouteValueDictionary { { "controller", "videoPlayerServer" } });

            var generic = videoServer.GetGeneric();

            Assert.IsNotNull(generic);
            Assert.IsTrue(generic.StatusCode == System.Net.HttpStatusCode.OK);
        }

        [TestMethod()]
        public void GetNextVideoTimeLine()
        {
            var videoServer = new videoPlayerServerController();

            videoServer.Request = new System.Net.Http.HttpRequestMessage
            {
                RequestUri = new Uri("http://localhost:9760/api/videoPlayerServer/GetNextVideoTimeLine")
            };

            videoServer.Configuration = new System.Web.Http.HttpConfiguration();

            videoServer.Configuration.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{action}/{id}",
                defaults: new { id = RouteParameter.Optional });

            videoServer.RequestContext.RouteData = new HttpRouteData(
                route: new HttpRoute(),
                values: new HttpRouteValueDictionary { { "controller", "videoPlayerServer" } });

            var timeLine = videoServer.GetNextVideoTimeLine();

            Assert.IsNotNull(timeLine);
            Assert.IsTrue(timeLine.StatusCode == System.Net.HttpStatusCode.OK);
        } 
    }
}