using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VoiceBeatSpa.Controllers;
using VoiceBeatSpa.Core.Interfaces;
using VoiceBeatSpa.Web.Dto;

namespace VoiceBeatSpa.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        private readonly IEmailService _emailService;

        public ContactController(ILogger<EventController> logger,
                                 IEmailService emailService)
        {
            _logger = logger;
            _emailService = emailService;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> SendEmail([FromBody] EmailDto email)
        {
            try
            {
                await _emailService.SendContactEmail(email.Email, "toList", email.Subject, email.Body, email.Name);
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
