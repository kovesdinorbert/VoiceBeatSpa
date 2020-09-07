using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Threading.Tasks;
using Hangfire;
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
        private readonly IEmailService _emailService;
        private readonly IGenericRepository<Event> _eventRepository;
        private readonly ILanguageService _languageService;

        public EventService(IOptions<VoiceBeatConfiguration> voiceBeatConfiguration, 
                            IUserService userService,
                            IEmailService emailService,
                            IGenericRepository<Event> eventRepository,
                            ILanguageService languageService)
        {
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
            _userService = userService;
            _emailService = emailService;
            _eventRepository = eventRepository;
            _languageService = languageService;
        }

        public async Task AddNewEvent(Event newEvent, string userEmail, LanguageEnum languageCode)
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

            var translationQ = await _languageService.GetTranslatedEmailTemplate(LivingTextTypeEnum.EmailReservationSent, languageCode);
            var translationQHu = await _languageService.GetTranslatedEmailTemplate(LivingTextTypeEnum.EmailReservationSent, LanguageEnum.hu);

            await _eventRepository.CreateAsync(new Event()
            {
                Subject = newEvent.Subject,
                StartDate = newEvent.StartDate,
                EndDate = newEvent.EndDate,
                Room = newEvent.Room,
            }, user.Id);

            List<string> adminEmails = _voiceBeatConfiguration.SendEmailTo.Split(';').ToList();
            string internalEmail = _voiceBeatConfiguration.SendEmailFromDomain;

            if (!isAdmin)
            {
                var body = translationQ.Text.Replace("#Times#", $"{newEvent.StartDate.ToShortDateString()} {newEvent.StartDate.ToShortTimeString()}-{newEvent.EndDate.ToShortTimeString()}");

                await _emailService.SendEmail(internalEmail, userEmail, translationQ.Subject, body, "Voice-Beat");
            }

            var bodyHu = translationQHu.Text.Replace("#Times#", $"{newEvent.StartDate.ToShortDateString()} {newEvent.StartDate.ToShortTimeString()}-{newEvent.EndDate.ToShortTimeString()}");
            foreach (var adminEmail in adminEmails)
            {
                await _emailService.SendEmail(internalEmail, adminEmail, translationQHu.Subject, bodyHu, "Voice-Beat");
            }

        }

        public async Task DeleteEvent(Guid eventToDelete, string userEmail, LanguageEnum languageCode)
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

            var translationQ = await _languageService.GetTranslatedEmailTemplate(LivingTextTypeEnum.EmailReservationDelete, languageCode);
            var translationQHu = await _languageService.GetTranslatedEmailTemplate(LivingTextTypeEnum.EmailReservationDelete, LanguageEnum.hu);


            List<string> adminEmails = _voiceBeatConfiguration.SendEmailTo.Split(';').ToList();
            string internalEmail = _voiceBeatConfiguration.SendEmailFromDomain;

            if (!isAdmin)
            {
                var body = translationQ.Text.Replace("#Times#", $"{eventEntity.StartDate.ToShortDateString()} {eventEntity.StartDate.ToShortTimeString()}-{eventEntity.EndDate.ToShortTimeString()}");

                await _emailService.SendEmail(internalEmail, userEmail, translationQ.Subject, body, "Voice-Beat");
            }

            var bodyHu = translationQHu.Text.Replace("#Times#", $"{eventEntity.StartDate.ToShortDateString()} {eventEntity.StartDate.ToShortTimeString()}-{eventEntity.EndDate.ToShortTimeString()}");
            foreach (var adminEmail in adminEmails)
            {
                await _emailService.SendEmail(internalEmail, adminEmail, translationQHu.Subject, bodyHu, "Voice-Beat");
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

            var remainingEvents = events.Where(e => pastEvents.All(pe => pe.Id != e.Id) && futureEvents.All(fe => fe.Id != e.Id)).ToList();

            if (futureEvents.Any())
            {
                for (int i = futureEvents.Count() - 1; i >= 0; i--)
                {
                    await DeleteEvent(futureEvents.ElementAt(i).Id, user.Email, LanguageEnum.hu);
                }
            }
            if (pastEvents.Any())
            {
                await Anonymize(pastEvents, user.Email);
            }
            if (remainingEvents.Any())
            {
                BackgroundJob.Schedule(
                    () => Anonymize(remainingEvents, user.Email),
                    TimeSpan.FromDays(3));
            }
        }

        public async Task Anonymize(List<Event> events, string email)
        {
            events.ForEach(pe => pe.Subject = "Törölt felhasználó");
            for (int i = events.Count() - 1; i >= 0; i--)
            {
                await _eventRepository.UpdateAsync(events.ElementAt(i), Guid.Empty);
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
