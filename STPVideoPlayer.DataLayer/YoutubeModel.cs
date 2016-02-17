using System.ComponentModel.DataAnnotations;
using TypeLite;

namespace STPVideoPlayer.DataLayer
{
    [TsClass]
    public class YoutubeModel
    {
        [Required]
        public string VideoId { get; set; }
        public bool PlayList { get; set; }
    }
}