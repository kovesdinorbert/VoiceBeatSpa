using System;

namespace VoiceBeatSpa.Web.Dto
{
    public class RecoverPasswordDto
    {
        public Guid Id { get; set; }
        public string Password1 { get; set; }
        public string Password2 { get; set; }
    }
}
