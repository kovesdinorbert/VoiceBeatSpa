using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class EventService : IEventService
    {
        public async Task<List<Event>> GetEvents()
        {
            throw new NotImplementedException();
        }
    }
}
