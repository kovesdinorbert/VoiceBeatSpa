using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
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

        public async Task AddNewEvent(Event newEvent, string userName)
        {
            //string date;
            //string startTime;
            //string endTime;
            var user = await _userService.GetUser(userName);

            if (user == null)
            {
                throw new NullReferenceException();
            }

            DateTime mdate = new DateTime(newEvent.StartDate.Year, newEvent.StartDate.Month, newEvent.StartDate.Day);
            TimeSpan ts = new TimeSpan(0, 0, 0);
            mdate = mdate.Date + ts;

            //if (HttpContext.User.Identity.IsAuthenticated)
            //{
                //if (string.IsNullOrEmpty(reserveTo)) reserveTo = HttpContext.User.Identity.Name;

                //TODO 2 nappal korábban foglalni -> irány a configba
                if (mdate < DateTime.Today.AddDays(_voiceBeatConfiguration.DayBeforeUserReservation) && await _userService.IsAdmin(user.Id))
                {
                    //return Json("NOK1", JsonRequestBehavior.AllowGet);
                }

                //RoomEnum mroom = RoomEnum.Studio;
                //if (room.ToLower() == "piros terem") mroom = RoomEnum.Room1;
                //else if (room.ToLower() == "kék terem") mroom = RoomEnum.Room2;
                //else if (room.ToLower() == "szürke terem") mroom = RoomEnum.Room3;


                //var startDate = mdate.AddHours(Convert.ToDouble(startTime.Split(':').First()));
                //startDate = startDate.AddMinutes(Convert.ToDouble(startTime.Split(':').Last()));
                //var endDate = mdate.AddHours(Convert.ToDouble(endTime.Split(':').First()));
                //endDate = endDate.AddMinutes(Convert.ToDouble(endTime.Split(':').Last()));

                //if (mroom == RoomEnum.Studio)
                //{
                //    if (mdate < DateTime.Today.AddDays(7))
                //    {
                //        return Json("NOK", JsonRequestBehavior.AllowGet);
                //    }
                //}

                //var phone = userService.FindAll(u => u.Email == HttpContext.User.Identity.Name).FirstOrDefault().PhoneNumber;
                ////TODO: ellenőrizni, hogy ne legyen átfedés... just for case...
                await _eventRepository.CreateAsync(new Event()
                {
                    Subject = newEvent.Subject,
                    StartDate = newEvent.StartDate,
                    EndDate = newEvent.EndDate,
                    Room = newEvent.Room,
                    ReservedDay = new DateTime(newEvent.StartDate.Year, newEvent.StartDate.Month, newEvent.StartDate.Day),
                    //Description = phone
                });

                //string reservationString = (startDate.ToString("yyyy.MM.dd.") + ":" + "<br />");
                //reservationString += startDate.Hour.ToString() + ":" + startDate.Minute.ToString() + " - "
                //                     + endDate.Hour.ToString() + ":" + endDate.Minute.ToString();
                //SendEmail(reservationString);
            //}

            //return GetReservationList(mdate);
        }

        public async Task DeleteEvent(Guid eventToDelete)
        {
            await _eventRepository.DeleteAsync(eventToDelete);
        }

        public async Task<List<Event>> GetEvents(bool includeNotActive)
        {
            //TODO ütemező, az 1 évnél régebbi próbákat isactive false-ra.
            return await _eventRepository.FindAllAsync(e => includeNotActive || e.IsActive);
        }

        public async Task<List<Event>> GetEvents(DateTime start, DateTime end)
        {
            return await _eventRepository.FindAllAsync(e => e.StartDate >= start && e.EndDate <= end);
        }
    }
}
