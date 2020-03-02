using System.Threading.Tasks;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendEmail(string from, string to, string subject, string body, LivingTextTypeEnum type);
    }
}
