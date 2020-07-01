using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IEventService
    {
        Task<List<Event>> GetEvents(bool includeNotActive);
        Task<List<Event>> GetEvents(DateTime start, DateTime end);
        Task AddNewEvent(Event newEvent, string userName);
        Task DeleteEvent(Guid eventToDelete);
    }
}
