using STPVideoPlayer.DataLayer;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Xml.Linq;

namespace STPVideoPlayer.Data.MongoProvider
{
    public static class ImportProcessor
    {
        public static void ImportXmlFile(string xmlFile, Action<TimeLineModel> insertTimeLine)
        {
            if (System.IO.File.Exists(xmlFile))
            {
                var timeLinesDoc = ExpandoHelper.ReadDocument(xmlFile).programmes;

                string seriesPath = System.IO.Path.GetDirectoryName(xmlFile) + "\\MySeries.xml";

                var seriesDoc = ExpandoHelper.ReadDocument(seriesPath).series;

                foreach (dynamic xNode in timeLinesDoc)
                {
                    TimeLineModel timeLine = new TimeLineModel();

                    parseHeader(xNode, timeLine);

                    switch (timeLine.Type.ToLower())
                    {
                        case "serie":
                            {
                                dynamic xSerie = null;

                                foreach (dynamic xS in seriesDoc)
                                {
                                    if (xS.name.Equals(timeLine.Name, StringComparison.OrdinalIgnoreCase))
                                    {
                                        xSerie = xS;
                                        break;
                                    }
                                }

                                parseSerie(xSerie, timeLine);
                                insertTimeLine(timeLine);

                                break;

                            }
                        case "local":
                            {
                                parseLocal(timeLine, xNode);

                                if (timeLine.Local != null && !string.IsNullOrEmpty(timeLine.Local.Mp4))
                                    insertTimeLine(timeLine);

                                break;
                            }
                        case "youtube-pl":
                            {
                                parseYoutube(timeLine, xNode, true);

                                if (timeLine.Youtube != null && !string.IsNullOrEmpty(timeLine.Youtube.VideoId))
                                    insertTimeLine(timeLine);

                                break;
                            }
                        case "youtube":
                            {
                                parseYoutube(timeLine, xNode, false);

                                if (timeLine.Youtube != null && !string.IsNullOrEmpty(timeLine.Youtube.VideoId))
                                    insertTimeLine(timeLine);

                                break;
                            }
                        default:
                            {
                                if(xNode is System.Xml.XmlNode || xNode is System.Xml.XmlElement)
                                {
                                    if (xNode.Attributes["url"] != null)
                                    {
                                        timeLine.Url = xNode.Attributes["url"].Value;

                                        if (!string.IsNullOrEmpty(timeLine.Url))
                                            insertTimeLine(timeLine);
                                    }
                                }
                                break;
                            }
                    }
                }
            }
        }

        private static void parseYoutube(TimeLineModel timeLine, dynamic xNode, bool playlist)
        {
            timeLine.Youtube = new YoutubeModel();
            timeLine.Youtube.PlayList = playlist;
            timeLine.Youtube.VideoId = xNode.url.Replace("youtube-pl:", "");
        }

        private static void parseLocal(TimeLineModel timeLine, dynamic xNode)
        {
            if (xNode.url == null)
                throw new ArgumentException("you must specify an url for your local video");

            string url = xNode.url;
            string path = string.Empty;
            string filter = string.Empty;

            if (url.Contains(";"))
            {
                string[] parts = url.Split(';');
                path = parts[0];
                filter = parts[1];
            }
            else
            {
                path = url;
                filter = "*.*";
            }

            timeLine.Local = new LocalVideoModel();

            parseLocalFile(path, filter, timeLine.Local);
        }

        internal static void parseLocalFile(string path, string filter, LocalVideoModel local)
        {
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

                //local = new LocalVideoModel();

                local.Poster = files.FirstOrDefault(x => x.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase));
                local.M4V = files.FirstOrDefault(x => x.EndsWith(".m4v", StringComparison.OrdinalIgnoreCase));
                local.Mp4 = files.FirstOrDefault(x => x.EndsWith(".mp4", StringComparison.OrdinalIgnoreCase));
                local.Ogv = files.FirstOrDefault(x => x.EndsWith(".ogv", StringComparison.OrdinalIgnoreCase));
                local.Webm = files.FirstOrDefault(x => x.EndsWith(".webm", StringComparison.OrdinalIgnoreCase));
            }
        }

        private static void parseHeader(dynamic element, TimeLineModel timeLine)
        {
            timeLine.Name = element.name;
            timeLine.Start = TimeSpan.Parse(element.start);
            timeLine.End = TimeSpan.Parse(element.end);

            if (string.IsNullOrEmpty(timeLine.Type))
            {
                if(element is ExpandoObject)
                {
                    var data = ((IDictionary<string, object>)element);

                    if (data.Keys.Any(x=>x.Equals("type", StringComparison.OrdinalIgnoreCase)))
                    {
                        object value = data[data.Keys.FirstOrDefault(x => x.Equals("type", StringComparison.OrdinalIgnoreCase))];

                        if (value != null && !string.IsNullOrEmpty(value.ToString()))
                        {
                            timeLine.Type = value.ToString();
                        }
                    }
                    else if(data.Keys.Any(x=>x.Equals("url", StringComparison.OrdinalIgnoreCase)))
                    {
                        object value = data[data.Keys.FirstOrDefault(x => x.Equals("url", StringComparison.OrdinalIgnoreCase))];

                        if (value != null && !string.IsNullOrEmpty(value.ToString()))
                        {
                            if (!value.ToString().StartsWith("http", StringComparison.OrdinalIgnoreCase) && value.ToString().Contains(":"))
                            {
                                string[] parts = value.ToString().Split(':');

                                timeLine.Type = parts[0];

                                if (parts.Length > 1)
                                    timeLine.Url = parts[1];
                            }
                            else if(value.ToString().StartsWith("http"))
                            {
                                if(value.ToString().ToLower().Contains("youtube"))
                                {
                                    timeLine.Type = "youtube";
                                    timeLine.Url = value.ToString();
                                }
                                else
                                {
                                    timeLine.Type = "web";
                                    timeLine.Url = value.ToString();
                                }
                            }
                            else
                            {
                                timeLine.Type = value.ToString();
                            }
                        }

                    }
                } 
                else if(element is System.Xml.XmlElement || element is System.Xml.XmlNode)
                {
                    if (element.Attributes["type"] != null)
                    { 
                        timeLine.Type = element.Attributes["type"].value;
                    }
                    else if(element.Attributes["url"] != null)
                    {
                        string value = element.Attributes["url"].value;

                        if (!value.ToString().StartsWith("http", StringComparison.OrdinalIgnoreCase) && value.ToString().Contains(":"))
                        {
                            string[] parts = value.ToString().Split(':');

                            timeLine.Type = parts[0];

                            if (parts.Length > 1)
                                timeLine.Url = parts[1];
                        }
                        else if (value.ToString().StartsWith("http"))
                        {
                            if (value.ToString().ToLower().Contains("youtube"))
                            {
                                timeLine.Type = "youtube";
                                timeLine.Url = value.ToString();
                            }
                            else
                            {
                                timeLine.Type = "web";
                                timeLine.Url = value.ToString();
                            }
                        }
                    }
                } 
            }
            
        }

        private static void parseSerie(dynamic xSerie, TimeLineModel timeLine)
        {
            if (xSerie != null)
            {
                foreach (dynamic xEpisode in xSerie.programmations)
                {
                    var serie = new EpisodeModel()
                    {
                        Id = int.Parse(xEpisode.id)
                    };

                    serie.VideoType = xEpisode.videotype;

                    if (serie.VideoType.Equals("local", StringComparison.OrdinalIgnoreCase))
                    {
                        parseLocalVideoUrl(serie, xEpisode);
                    }
                    else
                    {
                        serie.VideoUrl = xEpisode.url;
                    }

                    serie.EpisodeNumber = int.Parse(xEpisode.episodenumber);

                    timeLine.Episodes.Add(serie);
                }
            }
        }

        private static void parseLocalVideoUrl(EpisodeModel episode, dynamic xEpisode)
        {
            string[] parts = xEpisode.url.ToString().Split(';');

            string path = "";
            string filter = "";

            path = parts[0];

            if (parts.Length > 1)
            {
                filter = parts[1];
            }
            else
            {
                filter = "*.*";
            }

            parseLocalFile(path, filter, episode);
        }
    }
}
