using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using VoiceBeatSpa.Controllers;
using VoiceBeatSpa.Core.Configuration;
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
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;

        public ContactController(ILogger<EventController> logger,
                                 IEmailService emailService,
                                 IOptions<VoiceBeatConfiguration> voiceBeatConfiguration)
        {
            _logger = logger;
            _emailService = emailService;
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> SendEmail([FromBody] EmailDto email)
        {
            List<string> adminEmails = _voiceBeatConfiguration.SendEmailTo.Split(';').ToList();

            try
            {
                foreach (var to in adminEmails)
                {
                    await _emailService.SendEmail(email.Email, to, email.Subject, email.Body, email.Name);
                }
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
