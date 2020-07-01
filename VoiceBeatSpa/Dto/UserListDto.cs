using System;

namespace VoiceBeatSpa.Web.Dto
{
    public class UserListDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public DateTime? LastLogin { get; set; }
        public string PhoneNumber { get; set; }
        public bool Newsletter { get; set; }
        public bool ReservationRuleAccepted { get; set; }
    }
}
