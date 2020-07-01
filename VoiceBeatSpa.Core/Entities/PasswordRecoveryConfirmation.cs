using System;

namespace VoiceBeatSpa.Core.Entities
{
    public class PasswordRecoveryConfirmation : _CrudBase
    {
        public Guid? UserId { get; set; }
        public User User { get; set; }
    }
}