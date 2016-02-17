using TypeLite;
namespace STPVideoPlayer.DataLayer
{
    [TsClass]
    public class LocalVideoModel
    {
        public string Poster { get; set; }
        public string M4V { get; set; }
        public string Mp4 { get; set; }
        public string Ogv { get; set; }
        public string Webm { get; set; }
    }
}