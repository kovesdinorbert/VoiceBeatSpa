using System;
using System.Collections.Generic;
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

namespace VoiceBeatSpa.Web.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public UserController(ILogger<UserController> logger,
                              IUserService userService,
                              IMapper mapper)
        {
            _logger = logger;
            _userService = userService;
            _mapper = mapper;
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

        [HttpGet]
        [ProducesResponseType(typeof(List<UserListDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Get()
        {
            //Todo admin only
            var users = await _userService.GetUsers();
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
        public async Task<IActionResult> Get(Guid id)
        {
            //TODO: csak a saját user vagy admin
            var user = await _userService.GetUser(id);
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
        public async Task<IActionResult> IsRulesAccepted(Guid id)
        {
            var user = await _userService.GetUser(id);
            if (user != null)
            {
                return Ok(user.ReservationRuleAccepted);
            }
            return NotFound();
        }

        [HttpPost("acceptrules")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> AcceptRules([FromForm] Guid userId)
        {
            var user = await _userService.GetUser(userId);
            if (user != null)
            {
                user.ReservationRuleAccepted = true;
                await _userService.UpdateUser(user, string.Empty);
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
        public async Task<IActionResult> Update([FromBody] ProfilDto user)
        {
            try
            {
                var u = await _userService.GetUser(user.Id);
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

                    await _userService.UpdateUser(u, user.NewPassword);

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
        public async Task<IActionResult> Delete(Guid id)
        {
            //TODO only admin, if not self-delete
            await _userService.DeleteUser(id);
            return NoContent();
        }
    }
}