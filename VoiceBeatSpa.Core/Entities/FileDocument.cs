using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Entities
{
    public class FileDocument: _CrudBase
    {
        public string FileName { get; set; }

        public decimal Size { get; set; }

        public FileTypeEnum? FileType { get; set; }

        public byte[] FileContent { get; set; }
    }
}
