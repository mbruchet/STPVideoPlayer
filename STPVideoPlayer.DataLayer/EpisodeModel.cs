using System.ComponentModel.DataAnnotations;
using TypeLite;

namespace STPVideoPlayer.DataLayer
{
    [TsClass]
    public class EpisodeModel : LocalVideoModel
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int EpisodeNumber { get; set; }
        public string VideoType { get; set; }
        public string VideoUrl { get; set; }
    }
}