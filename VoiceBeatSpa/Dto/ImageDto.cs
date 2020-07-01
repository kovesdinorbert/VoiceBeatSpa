using System;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Web.Dto
{
    public class ImageDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string FileContent { get; set; }
        public string MimeType { get; set; }
        public ImageTypeEnum ImageType { get; set; }
    }
}
