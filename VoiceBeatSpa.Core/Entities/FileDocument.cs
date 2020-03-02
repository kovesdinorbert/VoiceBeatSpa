namespace VoiceBeatSpa.Core.Entities
{
    public class FileDocument: _CrudBase
    {
        public string FileName { get; set; }
        
        public string MimeType { get; set; }

        public decimal Size { get; set; }

        public byte[] FileContent { get; set; }
    }
}
