using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Interfaces;
using VoiceBeatSpa.Web.Dto;

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
            var events = await _eventService.GetEvents(false);
            if (!events.Any())
            {
                return NotFound();
            }
            return Ok(_mapper.Map<List<EventDto>>(events));
        }

        [HttpGet("{start}/{end}")]
        [ProducesResponseType(typeof(IEnumerable<EventDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(DateTime start, DateTime end)
        {
            var events = await _eventService.GetEvents(start, end);
            if (!events.Any())
            {
                return NotFound();
            }
            return Ok(_mapper.Map<List<EventDto>>(events));
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _eventService.DeleteEvent(id);
            }
            catch (Exception exception)
            {
                _logger.LogError("Event delete error: " + exception.Message);
            }
            return NoContent();
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create([FromBody] EventDto newEvent)
        {
            try
            {
                await _eventService.AddNewEvent(_mapper.Map<Event>(newEvent), HttpContext.User.Identity.Name);
                return StatusCode(StatusCodes.Status201Created);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }
    }
}
