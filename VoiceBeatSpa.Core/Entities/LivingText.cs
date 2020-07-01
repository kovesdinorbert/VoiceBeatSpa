using System.Collections.Generic;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Entities
{
    public class LivingText : _CrudBase
    {
        public LivingTextTypeEnum LivingTextType { get; set; }
        public bool IsHtmlEncoded { get; set; }
        //public List<LivingTextPlaceholderEnum> LivingTextPlaceholderEnums { get; set; } = new List<LivingTextPlaceholderEnum>();
        public List<Translation> Translations { get; set; } = new List<Translation>();
    }
}
