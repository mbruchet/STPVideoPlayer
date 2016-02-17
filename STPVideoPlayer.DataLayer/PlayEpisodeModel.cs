using System;
using System.ComponentModel.DataAnnotations;
using TypeLite;

namespace STPVideoPlayer.DataLayer
{
    [TsClass]
    public class PlayEpisodeModel
    {
        [Required]
        public DateTime PlayDate { get; set; }
        [Required]
        public int EpisodeNumber { get; set; }
    }
}