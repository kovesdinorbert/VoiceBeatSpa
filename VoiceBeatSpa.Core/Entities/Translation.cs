using System;

namespace VoiceBeatSpa.Core.Entities
{
    public class Translation: _CrudBase
    {
        public Guid LanguageId { get; set; }

        public Language Language { get; set; }

        public Guid LivingTextId { get; set; }

        public LivingText LivingText { get; set; }

        public string Text { get; set; }

        public string Subject { get; set; }
    }
}
