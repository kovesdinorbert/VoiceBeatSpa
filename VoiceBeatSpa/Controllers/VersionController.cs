using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Configuration;

namespace VoiceBeatSpa.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VersionController : ControllerBase
    {
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;

        public VersionController(IOptions<VoiceBeatConfiguration> voiceBeatConfiguration)
        {
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
        }

        [HttpGet]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        public IActionResult Get()
        {
            return Ok(_voiceBeatConfiguration.CurrentVersion);
        }
    }
}
