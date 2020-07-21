using AutoMapper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using HeyRed.Mime;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Web.Dto;

namespace VoiceBeatSpa.Web.App_Conf
{
    public class MappingConfig: Profile
    {
        public MappingConfig()
        {
            CreateMap<Event, EventDto>();
            CreateMap<EventDto, Event>()
                .ForMember(dst => dst.Modified, opt => opt.MapFrom(src => DateTime.Now))
                .ForMember(dst => dst.IsActive, opt => opt.Ignore())
                .ForMember(dst => dst.CreatedBy, opt => opt.Ignore())
                .ForMember(dst => dst.Created, opt => opt.Ignore());

            CreateMap<User, ProfilDto>()
                .ForMember(dst => dst.NewPassword, opt => opt.Ignore())
                .ForMember(dst => dst.OldPassword, opt => opt.Ignore());

            CreateMap<User, UserListDto>();

            CreateMap<LivingText, LivingTextDto>()
                .ForMember(dst => dst.Text, opt => opt.Ignore())
                .ForMember(dst => dst.Subject, opt => opt.Ignore());

            CreateMap<IFormFile, FileDocument>()
                .ForMember(dst => dst.FileName, opt => opt.MapFrom(src => Path.GetFileName(src.FileName)))
                .ForMember(dst => dst.Size, opt => opt.MapFrom(src => src.Length))
                .AfterMap((src, dest) =>
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        src.CopyTo(memoryStream);
                        dest.FileContent = memoryStream.ToArray();
                    }
                });

            CreateMap<IFormFile, Image>()
                .ForMember(dst => dst.FileName, opt => opt.MapFrom(src => Path.GetFileName(src.FileName)))
                .ForMember(dst => dst.Size, opt => opt.MapFrom(src => src.Length))
                .AfterMap((src, dest) =>
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        src.CopyTo(memoryStream);
                        dest.FileContent = memoryStream.ToArray();
                    }
                });

            CreateMap<Image, ImageDto>()
                .ForMember(dst => dst.FileContent, opt => opt.MapFrom(src => Convert.ToBase64String(src.FileContent)))
                .ForMember(dst => dst.MimeType, opt => opt.MapFrom(src => MimeTypesMap.GetMimeType(src.FileName)))
                .ForMember(dst => dst.Title, opt => opt.MapFrom(src => src.FileName));
        }
    }
}
