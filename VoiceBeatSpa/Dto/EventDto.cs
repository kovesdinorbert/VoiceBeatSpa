using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Web.Dto
{
    public class EventDto
    {
        public Guid Id { get; set; }
        public string Subject { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public RoomEnum Room { get; set; }
    }
}
