using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Entities
{
    public class Image: FileDocument
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public ImageTypeEnum ImageType { get; set; }
    }
}
