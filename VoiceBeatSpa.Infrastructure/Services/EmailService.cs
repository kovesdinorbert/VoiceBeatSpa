using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Hangfire;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;

        public EmailService(IOptions<VoiceBeatConfiguration> voiceBeatConfiguration)
        {
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
        }

        public async Task SendEmail(string from, string to, string subject, string body, string fromDisplayName)
        {
            BackgroundJob.Enqueue(() => DoSendEmail(from, to, subject, body, fromDisplayName));
        }

        public void DoSendEmail(string from, string to, string subject, string body, string fromDisplayName)
        {
            MailMessage mailMessage = new MailMessage
            {
                Body = body,
                From = string.IsNullOrEmpty(fromDisplayName) ? new MailAddress(from) : new MailAddress(from, fromDisplayName),
                Subject = subject,
                IsBodyHtml = true
            };
            mailMessage.To.Add(to);

            string smtpHost = _voiceBeatConfiguration.SmtpHost;
            string smtpUser = _voiceBeatConfiguration.SmtpUser;
            string smtpPassword = _voiceBeatConfiguration.SmtpPassword;
            int smtpPort = _voiceBeatConfiguration.SmtpPort;
            bool smtpUseSsl = _voiceBeatConfiguration.SmtpUseSsl;

            if (!string.IsNullOrEmpty(smtpHost))
            {
                try
                {
                    SmtpClient client = new SmtpClient(smtpHost, smtpPort)
                    {
                        EnableSsl = smtpUseSsl
                    };

                    if (!string.IsNullOrEmpty(smtpUser) && !string.IsNullOrEmpty(smtpPassword))
                    {
                        client.Credentials = new NetworkCredential(smtpUser, smtpPassword);
                    }
                    else
                    {
                        client.Credentials = CredentialCache.DefaultNetworkCredentials;
                    }

                    client.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    //log
                    //{
                    //    Message = ex.Message,
                    //    Id = Guid.NewGuid(),
                    //    Created = DateTime.Now,
                    //    IsActive = true,
                    //});
                }
            }
        }
    }
}
