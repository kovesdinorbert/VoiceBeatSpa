using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Authentication;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;
using VoiceBeatSpa.Web.Dto;
using VoiceBeatSpa.Web.Helpers;

namespace VoiceBeatSpa.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        private readonly IEventService _eventService;
        private readonly IMapper _mapper;

        public EventController(ILogger<EventController> logger,
                               IEventService eventService,
                               IMapper mapper)
        {
            _logger = logger;
            _eventService = eventService;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<EventDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get()
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var events = await _eventService.GetEvents(false, email);

            return Ok(_mapper.Map<List<EventDto>>(events));
        }

        [HttpGet("{start}/{end}")]
        [ProducesResponseType(typeof(IEnumerable<EventDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(DateTime start, DateTime end)
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var events = await _eventService.GetEvents(start, end, email);

            return Ok(_mapper.Map<List<EventDto>>(events));
        }

        [HttpDelete("{langCode}/{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(string langCode, Guid id)
        {
            try
            {
                var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
                await _eventService.DeleteEvent(id, email, langCode == "en" ? LanguageEnum.en : LanguageEnum.hu);
            }
            catch (Exception exception)
            {
                _logger.LogError("Event delete error: " + exception.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            return NoContent();
        }

        [HttpPost("{langCode}")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] EventDto newEvent, string langCode)
        {
            try
            {
                var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);

                await _eventService.AddNewEvent(_mapper.Map<Event>(newEvent), email, langCode == "en" ? LanguageEnum.en : LanguageEnum.hu);
                return StatusCode(StatusCodes.Status201Created);
            }
            catch (AuthenticationException)
            {
                return StatusCode(StatusCodes.Status401Unauthorized);
            }
            catch (ArgumentOutOfRangeException)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
