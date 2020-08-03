using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
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
            var user = await _userService.GetCurrentUserByEmail(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower()));

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
            var user = await _userService.GetCurrentUserByEmail(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower()));

            var eventEntity = await _eventRepository.FindByIdAsync(eventToDelete);

            if (!isAdmin && eventEntity.CreatedBy != user.Id)
            {
                throw new AuthenticationException();
            }

            await _eventRepository.DeleteAsync(eventToDelete);
        }

        public async Task UpdateEvent(Event eventToUpdate, string userEmail)
        {
            var user = await _userService.GetCurrentUserByEmail(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower()));

            if (!isAdmin && eventToUpdate.CreatedBy != user.Id)
            {
                throw new AuthenticationException();
            }

            await _eventRepository.UpdateAsync(eventToUpdate, user.Id);
        }

        public async Task<List<Event>> GetEvents(bool includeNotActive, string userEmail)
        {
            var events = await _eventRepository.FindAllAsync(e => includeNotActive || e.IsActive);
            return await HideNotOwnEvents(events, userEmail);
        }

        public async Task<List<Event>> GetEvents(DateTime start, DateTime end, string userEmail)
        {
            var events = await _eventRepository.FindAllAsync(e => e.StartDate >= start && e.EndDate <= end);
            return await HideNotOwnEvents(events, userEmail);
        }

        public async Task HandleEventsWhenUserDelete(Guid userId, string currentUserEmail)
        {
            var currentUser = await _userService.GetCurrentUserByEmail(currentUserEmail);

            if (currentUser.Id != userId && !currentUser.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower())))
            {
                throw new ArgumentException($"Somebody from {currentUserEmail} wanted to delete User {userId}");
            }

            var user = await _userService.GetUser(userId, currentUserEmail);

            var events = await _eventRepository.FindAllAsync(e => e.CreatedBy == userId);

            var pastEvents = events.Where(e => e.StartDate >= DateTime.MinValue && e.EndDate <= DateTime.Today).ToList();
            var futureEvents = events.Where(e => e.StartDate >= DateTime.Today.AddDays(3) && e.EndDate <= DateTime.MaxValue).ToList();

            //TODO - events between past and future events will be anonymized later - add scheduler task
            var remainingEvents = events.Where(e => pastEvents.All(pe => pe.Id != e.Id) && futureEvents.All(fe => fe.Id != e.Id)).ToList();

            if (futureEvents.Any())
            {
                for (int i = futureEvents.Count() - 1; i >= 0; i--)
                {
                    await DeleteEvent(futureEvents.ElementAt(i).Id, user.Email);
                }
            }
            if (pastEvents.Any())
            {
                pastEvents.ForEach(pe => pe.Subject = "Törölt felhasználó");
                for (int i = pastEvents.Count() - 1; i >= 0; i--)
                {
                    await UpdateEvent(pastEvents.ElementAt(i), user.Email);
                }
            }
        }

        private async Task<List<Event>> HideNotOwnEvents(List<Event> events, string userEmail)
        {
            var user = await _userService.GetCurrentUserByEmail(userEmail);

            if (user == null)
            {
                throw new AuthenticationException();
            }

            var isAdmin = user.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower()));

            if (!isAdmin)
            {
                events.Where(e => e.CreatedBy != user.Id).ToList().ForEach(e => e.Subject = "N/A");
            }

            return events;
        }
    }
}
