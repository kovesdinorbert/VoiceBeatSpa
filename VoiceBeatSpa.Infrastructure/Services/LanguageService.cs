using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class LanguageService: ILanguageService
    {
        private readonly IGenericRepository<LivingText> _livingTextRepository;

        public LanguageService(IGenericRepository<LivingText> livingTextRepository)
        {
            _livingTextRepository = livingTextRepository;
        }

        public async Task<Translation> GetTranslatedEmailTemplate(LivingTextTypeEnum livingTextType, LanguageEnum languageCode)
        {
            var livingTextQ = await
                _livingTextRepository.FindAllAsync(lt => lt.LivingTextType == livingTextType,
                    new Func<IQueryable<LivingText>, IQueryable<LivingText>>[]
                    {
                        source => source.Include(m => m.Translations)
                            .ThenInclude(m => m.Language),
                    });
            if (livingTextQ.FirstOrDefault() == null)
            {
                throw new ArgumentNullException();
            }

            var translation = livingTextQ.First().Translations.FirstOrDefault(t => t.Language.Code.ToLower() == languageCode.ToString());
            if (translation == null)
            {
                throw new ArgumentNullException();
            }

            return translation;
        }
    }
}
