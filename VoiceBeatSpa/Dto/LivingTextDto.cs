using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Web.Dto
{
    public class LivingTextDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; }
        public string Subject { get; set; }
        public LivingTextTypeEnum LivingTextType { get; set; }
        public bool IsHtmlEncoded { get; set; }
        public List<LivingTextPlaceholderEnum> LivingTextPlaceholders { get; set; } = new List<LivingTextPlaceholderEnum>();
    }
}
