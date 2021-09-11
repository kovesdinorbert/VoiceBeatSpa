namespace VoiceBeatSpa.Core.Configuration
{
    public class VoiceBeatConfiguration
    {
        public int DayBeforeUserReservation { get; set; }
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public int MaxFailedLogin { get; set; }
        public string SmtpUser { get; set; }
        public string SmtpPassword { get; set; }
        public bool SmtpUseSsl { get; set; }
        public string SendEmailTo { get; set; }
        public string SendEmailFromDomain { get; set; }
        public string SiteUrl { get; set; }
        public string SecretKey { get; set; }
        public int TokenExpiresDay { get; set; }
        public string CurrentVersion { get; set; }
    }
}
