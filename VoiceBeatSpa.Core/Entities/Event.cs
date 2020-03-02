using System;

namespace VoiceBeatSpa.Core.Entities
{
    public class Event: _CrudBase
    {
        public string Subject { get; set; }
        public string Description { get; set; }
        public DateTime ReservedDay { get; set; }
        public int StartHour { get; set; }
        public string ThemeColor { get; set; }
        public bool IsFullDay { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public RoomEnum Room { get; set; }
    }
}
