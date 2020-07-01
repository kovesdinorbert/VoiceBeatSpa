using System.Threading.Tasks;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IEmailService
    {
        Task SendContactEmail(string from, string to, string subject, string body, string senderName);
        Task SendSystemEmail(string from, string to, LivingTextTypeEnum type);
        Task SendBasicEmail(string from, string to, string subject, string body);
    }
}
