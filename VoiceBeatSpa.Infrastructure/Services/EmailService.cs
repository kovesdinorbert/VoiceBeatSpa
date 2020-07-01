using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;
        private readonly IGenericRepository<LivingText> _livingTextRepository;
        private readonly IGenericRepository<User> _userRepository;

        public EmailService(IOptions<VoiceBeatConfiguration> voiceBeatConfiguration,
                            IGenericRepository<LivingText> livingTextRepository,
                            IGenericRepository<User> userRepository)
        {
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
            _livingTextRepository = livingTextRepository;
            _userRepository = userRepository;
        }

        public async Task SendContactEmail(string from, string to, string subject, string body, string senderName)
        {
            throw new NotImplementedException();
        }

        public async Task SendBasicEmail(string from, string to, string subject, string body)
        {
            throw new NotImplementedException();
        }

        public async Task SendSystemEmail(string from, string to, LivingTextTypeEnum type)
        {
            var livingTextQ = await _livingTextRepository.FindAllAsync(lt => lt.LivingTextType == type && lt.IsActive);
            var livingText = livingTextQ.FirstOrDefault();
            var body = ReplacePlaceholder(livingText);


            throw new NotImplementedException();
        }

        private string ReplacePlaceholder(LivingText livingText)
        {
            //var body = livingText.Text;
            var body = "";
            //foreach (var placeholder in livingText.LivingTextPlaceholderEnums)
            //{
            //    switch (placeholder)
            //    {
                    //case (int)LivingTextPlaceholderEnum.NewRegistrationGuid:
                    //    body = body.Replace($"{{{placeholder.ToString()}}}", "errrrrereplacellllltem");
                    //    break;
                    //case (int)LivingTextPlaceholderEnum.UserName:
                    //    break;
            //    }
            //}
            return body;
        }
    }
}
