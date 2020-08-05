using System;
using System.Collections.Generic;

namespace VoiceBeatSpa.Core.Entities
{
    public class User: _CrudBase
    {
        public string Email { get; set; }

        public string Token { get; set; }

        public string Password { get; set; }

        public string Salt { get; set; }

        public bool ChangePassword { get; set; }

        public DateTime? LastLogin { get; set; }

        public DateTime? LastWrongPassword { get; set; }

        public int WrongPasswordCount { get; set; }

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

        public IList<PasswordRecoveryConfirmation> PasswordRecoveryConfirmations { get; set; } = new List<PasswordRecoveryConfirmation>();
        public IList<ForgottenPassword> ForgottenPasswords { get; set; } = new List<ForgottenPassword>();

        public string PhoneNumber { get; set; }
        public bool Newsletter { get; set; }
        public bool ReservationRuleAccepted { get; set; }
        public bool SocialLogin { get; set; }
    }
}
