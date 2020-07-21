using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using HeyRed.Mime;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;
using VoiceBeatSpa.Web.Dto;
using VoiceBeatSpa.Web.Helpers;

namespace VoiceBeatSpa.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileDocumentController : ControllerBase
    {
        private readonly ILogger<FileDocumentController> _logger;
        private readonly IGenericRepository<FileDocument> _fileRepository;
        private readonly IGenericRepository<Image> _imageRepository;
        private readonly IUserService _userService;
        private readonly IMapper _mapper;

        public FileDocumentController(ILogger<FileDocumentController> logger,
                                      IGenericRepository<FileDocument> fileRepository,
                                      IGenericRepository<Image> imageRepository,
                                      IUserService userService,
                                      IMapper mapper)
        {
            _logger = logger;
            _fileRepository = fileRepository;
            _mapper = mapper;
            _userService = userService;
            _imageRepository = imageRepository;
        }

        [HttpGet("{id:Guid}")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetFile(Guid id)
        {
            var file = await _fileRepository.FindByIdAsync(id);
            if (file == null)
            {
                return NotFound();
            }

            return File(file.FileContent, MimeTypesMap.GetMimeType(file.FileName), file.FileName);
        }

        [HttpGet("files/{fileType:int}")]
        [ProducesResponseType(typeof(FileContentResult), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetFiles(int fileType)
        {
            var files = await _fileRepository.FindAllAsync(f => f.FileType.HasValue && f.FileType == (FileTypeEnum)fileType);
            if (!files.Any())
            {
                return NotFound();
            }

            var content = new MultipartContent();

            foreach(var file in files)
            {
                var fileContent = new StreamContent(new MemoryStream(file.FileContent));
                fileContent.Headers.ContentType = System.Net.Http.Headers.MediaTypeHeaderValue.Parse(MimeTypesMap.GetMimeType(file.FileName));
                content.Add(fileContent);
            }

            var response = new HttpResponseMessage();
            response.Content = content;
            return Ok(response);
        }

        [HttpGet("images/{imageType:int}")]
        [ProducesResponseType(typeof(List<ImageDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetImages(int imageType)
        {
            try
            {
                var files = await _imageRepository.FindAllAsync(f => f.FileType.HasValue && f.ImageType == (ImageTypeEnum)imageType);
                if (!files.Any())
                {
                    return NotFound();
                }

                var ret = new List<ImageDto>();
                foreach (var file in files)
                {
                    ret.Add(_mapper.Map<ImageDto>(file));
                }
                return Ok(ret);
            }
            catch (Exception e)
            {
                _logger.LogError(null, e);
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Post([FromForm] IFormFile file, [FromForm] int fileType, [FromForm] int imageType)
        {
            try
            {
                var email = ClaimHelper.GetClaimData(User, ClaimTypes.Name);

                if (string.IsNullOrEmpty(email))
                {
                    throw new ArgumentOutOfRangeException();
                }

                var user = await _userService.GetUser(email);

                switch ((FileTypeEnum)fileType)
                {
                    case FileTypeEnum.Image:

                        var image = _mapper.Map<Image>(file);
                        image.ImageType = (ImageTypeEnum) imageType;
                        image.Title = "Title";
                        image.Body = "Body";
                        image.FileType = FileTypeEnum.Image;
                        await _imageRepository.CreateAsync(image, user.Id);
                        break;
                }
            }
            catch (Exception exception)
            {
                _logger.LogError("File upload error: " + exception.Message);
            }

            return new EmptyResult();
        }

        [HttpDelete("{id:Guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _fileRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}