﻿using System;

namespace VoiceBeatSpa.Web.Dto
{
    public class LoginResultDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public string PhoneNumber { get; set; }
    }
}
