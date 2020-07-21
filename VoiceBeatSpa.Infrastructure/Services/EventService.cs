using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class EventService : IEventService
    {
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;
        private readonly IUserService _userService;
        private readonly IGenericRepository<Event> _eventRepository;

        public EventService(IOptions<VoiceBeatConfiguration> voiceBeatConfiguration, 
                            IUserService userService,
                            IGenericRepository<Event> eventRepository)
        {
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
            _userService = userService;
            _eventRepository = eventRepository;
        }

        public async Task AddNewEvent(Event newEvent, string userEmail)
        {
            var user = await _userService.GetUser(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), "admin"));

            if (!isAdmin && newEvent.StartDate.Date < DateTime.Today.AddDays(_voiceBeatConfiguration.DayBeforeUserReservation))
            {
                throw new ArgumentOutOfRangeException();
            }

            var overlappingEvents = await _eventRepository.FindAllAsync(e => e.Room == newEvent.Room
                                               && e.StartDate <= newEvent.EndDate && newEvent.EndDate <= e.EndDate);

            if (overlappingEvents.Any())
            {
                throw new ArgumentOutOfRangeException();
            }

            await _eventRepository.CreateAsync(new Event()
            {
                Subject = newEvent.Subject,
                StartDate = newEvent.StartDate,
                EndDate = newEvent.EndDate,
                Room = newEvent.Room,
            }, user.Id);
        }

        public async Task DeleteEvent(Guid eventToDelete, string userEmail)
        {
            var user = await _userService.GetUser(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), "admin"));

            var eventEntity = await _eventRepository.FindByIdAsync(eventToDelete);

            if (!isAdmin && eventEntity.CreatedBy != user.Id)
            {
                throw new AuthenticationException();
            }

            await _eventRepository.DeleteAsync(eventToDelete);
        }

        public async Task<List<Event>> GetEvents(bool includeNotActive, string userEmail)
        {
            var events = await _eventRepository.FindAllAsync(e => includeNotActive || e.IsActive);
            return await AnonymizeEvents(events, userEmail);
        }

        public async Task<List<Event>> GetEvents(DateTime start, DateTime end, string userEmail)
        {
            var events = await _eventRepository.FindAllAsync(e => e.StartDate >= start && e.EndDate <= end);
            return await AnonymizeEvents(events, userEmail);
        }

        private async Task<List<Event>> AnonymizeEvents(List<Event> events, string userEmail)
        {
            var user = await _userService.GetUser(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), "admin"));

            if (!isAdmin)
            {
                events.Where(e => e.CreatedBy != user.Id).ToList().ForEach(e => e.Subject = "N/A");
            }

            return events;
        }
    }
}
