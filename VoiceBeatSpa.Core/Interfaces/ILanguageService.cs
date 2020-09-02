using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface ILanguageService
    {
        Task<Translation> GetTranslatedEmailTemplate(LivingTextTypeEnum livingTextType, LanguageEnum languageCode);
    }
}
