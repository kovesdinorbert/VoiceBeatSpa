using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IEventService
    {
        Task<List<Event>> GetEvents();
    }
}
