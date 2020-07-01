using System;

namespace VoiceBeatSpa.Web.Dto
{
    public class ProfilDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string PhoneNumber { get; set; }
        public bool Newsletter { get; set; }
    }
}
