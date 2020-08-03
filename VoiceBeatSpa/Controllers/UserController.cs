using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Interfaces;
using VoiceBeatSpa.Web.Dto;
using VoiceBeatSpa.Web.Helpers;

namespace VoiceBeatSpa.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        private readonly IEventService _eventService;
        private readonly IMapper _mapper;

        public UserController(ILogger<UserController> logger,
                              IUserService userService,
                              IEventService eventService,
                              IMapper mapper)
        {
            _logger = logger;
            _userService = userService;
            _mapper = mapper;
            _eventService = eventService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        [ProducesResponseType(typeof(LoginResultDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Authenticate([FromBody]LoginDto login)
        {
            var user = await _userService.Login(login.Email, login.Password);
            if (user != null)
            {
                var token = _userService.GenerateToken(user);
                return Ok(new LoginResultDto() { Email = user.Email, Token = token, Id = user.Id });
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("forgottenpassword")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> ForgottenPassword([FromBody]string email)
        {
            var user = await _userService.GetCurrentUserByEmail(email);
            if (user != null)
            {
                //TODO Send password remainder
            }
            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(typeof(List<UserListDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Get()
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var users = await _userService.GetUsers(email);
            if (users.Any())
            {
                try
                {
                    return Ok(_mapper.Map<List<UserListDto>>(users));
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
            return NotFound();
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<IActionResult> Get(Guid id)
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var user = await _userService.GetUser(id, email);
            if (user != null)
            {
                try
                {
                    return Ok(_mapper.Map<ProfilDto>(user));
                }
                catch (Exception e)
                {
                    Console.WriteLine(e);
                    throw;
                }
            }
            return NotFound();
        }

        [HttpGet("isrulesaccepted/{id}")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> IsRulesAccepted(Guid id)
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var user = await _userService.GetUser(id, email);
            if (user != null)
            {
                return Ok(user.ReservationRuleAccepted);
            }
            return NotFound();
        }

        [HttpPost("acceptrules")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> AcceptRules([FromForm] Guid userId)
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var user = await _userService.GetUser(userId, email);
            if (user != null)
            {
                user.ReservationRuleAccepted = true;
                await _userService.UpdateUser(user, string.Empty, email);
                return Ok(user.ReservationRuleAccepted);
            }
            return NotFound();
        }

        [AllowAnonymous]
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Create([FromBody] RegisterDto user)
        {
            try
            {
                if (!string.IsNullOrEmpty(user.Email) && !string.IsNullOrEmpty(user.Password) && !string.IsNullOrEmpty(user.PhoneNumber))
                {
                    User u = new User()
                    {
                        Email = user.Email,
                        PhoneNumber = user.PhoneNumber,
                        Newsletter = user.Newsletter,
                        IsActive = true, //TODO false => confirmation email
                    };
                    await _userService.CreateUser(u, user.Password);
                    return StatusCode(StatusCodes.Status200OK);
                }
                else
                {
                    //log
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize(Roles = "User")]
        public async Task<IActionResult> Update([FromBody] ProfilDto user)
        {
            try
            {
                var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
                var u = await _userService.GetUser(user.Id, email);
                if (u != null)
                {
                    u.Email = user.Email;
                    u.PhoneNumber = user.PhoneNumber;
                    u.Newsletter = user.Newsletter;

                    if ((!string.IsNullOrEmpty(user.OldPassword) && !string.Equals(_userService.GetPasswordHash(user.OldPassword, u.Salt), u.Password))
                        || (!string.IsNullOrEmpty(user.NewPassword) && string.IsNullOrEmpty(user.OldPassword)))
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError);
                    }

                    await _userService.UpdateUser(u, user.NewPassword, email);

                    return StatusCode(StatusCodes.Status200OK);
                }
                else
                {
                    //log
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        [HttpDelete("{id:Guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
                await _eventService.HandleEventsWhenUserDelete(id, email);
                await _userService.DeleteUser(id, email);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            return NoContent();
        }
    }
}