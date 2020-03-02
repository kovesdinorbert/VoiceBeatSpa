using System;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmail(string from, string to, string subject, string body, LivingTextTypeEnum type)
        {
            throw new NotImplementedException();
        }
    }
}
