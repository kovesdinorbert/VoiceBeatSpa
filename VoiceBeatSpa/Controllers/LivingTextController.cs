using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;
using VoiceBeatSpa.Web.Dto;
using VoiceBeatSpa.Web.Helpers;

namespace VoiceBeatSpa.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LivingTextController : ControllerBase
    {
        private readonly ILogger<LivingTextController> _logger;
        private readonly IGenericRepository<LivingText> _livingTextRepository;
        private readonly IGenericRepository<Translation> _translationRepository;
        private readonly IGenericRepository<Language> _languageRepository;
        private readonly IUserService _userService;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public LivingTextController(ILogger<LivingTextController> logger,
                                    IGenericRepository<LivingText> livingTextRepository,
                                    IGenericRepository<Translation> translationRepository,
                                    IGenericRepository<Language> languageRepository,
                                    IUserService userService,
                                    IEmailService emailService,
                                    IMapper mapper)
        {
            _logger = logger;
            _livingTextRepository = livingTextRepository;
            _translationRepository = translationRepository;
            _userService = userService;
            _emailService = emailService;
            _languageRepository = languageRepository;
            _mapper = mapper;
        }

        [HttpGet("{id}/{langCode}")]
        [ProducesResponseType(typeof(LivingTextDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Get(Guid id, string langCode)
        {
            var livingTexts = await _livingTextRepository.FindAllAsync(l => l.Id == id, GetTranslationIncludes());
            var livingText = livingTexts.FirstOrDefault();
            if (livingText == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<LivingTextDto>(livingText);
            SetTranslationToDto(livingText, dto, langCode);

            return Ok(_mapper.Map<LivingTextDto>(livingText));
        }

        [HttpGet("type/{textType:int}/{langCode}")]
        [ProducesResponseType(typeof(LivingTextDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Get(int textType, string langCode)
        {
            try
            {
                var livingText = await _livingTextRepository.FindAllAsync(lt => lt.LivingTextType == (LivingTextTypeEnum)textType && lt.IsActive,
                                                                                        GetTranslationIncludes());

                if (!livingText.Any() && !livingText.Any(l => l.Translations.Any(t => t.Language.Code == langCode)))
                {
                    return NotFound();
                }

                var dto = _mapper.Map<LivingTextDto>(livingText.First());

                SetTranslationToDto(livingText.First(), dto, langCode);

                return Ok(dto);
            }
            catch (Exception e)
            {
                _logger.LogError(null,e);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPut("{langCode}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Put(string langCode, [FromBody] LivingTextDto livingText)
        {
            var translationEntities = await _translationRepository.FindAllAsync(t => t.LivingTextId == livingText.Id && string.Equals(t.Language.Code, langCode));
            var translationEntity = translationEntities.FirstOrDefault();
            if (translationEntity == null)
            {
                return NotFound();
            }
            translationEntity.Text = livingText.Text;
            translationEntity.Subject = livingText.Subject;

            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);

            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentOutOfRangeException();
            }

            var user = await _userService.GetCurrentUserByEmail(email);

            await _translationRepository.UpdateAsync(translationEntity, user.Id);

            return NoContent();
        }

        [HttpPost("{newsletter}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Newsletter([FromBody] string text)
        {
            var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);
            var user = await _userService.GetCurrentUserByEmail(email);
            if (user != null)
            {
                var newsletter = new LivingText();

                newsletter.LivingTextType = LivingTextTypeEnum.Newsletter;
                newsletter.IsHtmlEncoded = true;
                newsletter.IsActive = false;
                var translation = new Translation();
                translation.Text = text;
                var hulang = await _languageRepository.FindAllAsync(l => l.Code == LanguageEnum.hu.ToString());
                if (hulang.FirstOrDefault() != null)
                {
                    translation.LanguageId = hulang.First().Id;
                    translation.Created = DateTime.Now;
                    translation.CreatedBy = user.Id;
                    newsletter.Translations.Add(translation);
                    await _livingTextRepository.CreateAsync(newsletter, user.Id);
                }

                await _userService.SendNewsLetter(text);
            }

            return Ok();
        }

        private void SetTranslationToDto(LivingText livingText, LivingTextDto dto, string langCode)
        {
            var translation = livingText.Translations.FirstOrDefault(t => t.Language.Code == langCode);
            if (translation != null)
            {
                dto.Text = translation.Text;
                dto.Subject = translation.Subject;
            }
        }

        private Func<IQueryable<LivingText>, IQueryable<LivingText>>[] GetTranslationIncludes()
        {
            return new Func<IQueryable<LivingText>, IQueryable<LivingText>>[]
            {
                source => source.Include(m => m.Translations)
                    .ThenInclude(m => m.Language),
            };
        }
    }
}