using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using TypeLite;

namespace STPVideoPlayer.DataLayer
{
    [TsClass]
    public class TimeLineModel : ICloneable
    {
        [Key]
        public object Id { get; set; }
        [Required]
        public string Name { get; set; }
        public TimeSpan Start { get; set; }
        public TimeSpan End { get; set; }
        public string Type { get; set; }
        public string Url { get; set; }

        public List<EpisodeModel> Episodes = new List<EpisodeModel>();
        public LocalVideoModel Local { get; set; }
        public YoutubeModel Youtube { get; set; }

        public object Clone()
        {
            return this.MemberwiseClone();
        }

        public List<PlayEpisodeModel> PlayEpisodes { get; set; }
        public EpisodeModel CurrentEpisode { get; internal set; }
    }
}
