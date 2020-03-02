using System;

namespace VoiceBeatSpa.Core.Entities
{
    public class ForgottenPassword : _CrudBase
    {
        public string VerificationCode { get; set; }
        public Guid? UserId { get; set; }
        public User User { get; set; }
    }
}
