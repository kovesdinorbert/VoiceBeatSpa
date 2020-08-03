using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IEventService
    {
        Task<List<Event>> GetEvents(bool includeNotActive, string userEmail);
        Task<List<Event>> GetEvents(DateTime start, DateTime end, string userEmail);
        Task AddNewEvent(Event newEvent, string userEmail);
        Task DeleteEvent(Guid eventToDelete, string userEmail);
        Task UpdateEvent(Event eventToUpdate, string userEmail);
        Task HandleEventsWhenUserDelete(Guid userId, string currentUserEmail);
    }
}
