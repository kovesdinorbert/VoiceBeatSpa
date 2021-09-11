using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;

namespace VoiceBeatSpa.Infrastructure.Data
{
    public class VoiceBeatContext : DbContext
    {
        private readonly DbConfiguration _dbConfiguration;

        public VoiceBeatContext(DbContextOptions<VoiceBeatContext> options,
                                IOptions<DbConfiguration> dbConfiguration) : base(options)
        {
        }

        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<PasswordRecoveryConfirmation> PasswordRecoveryConfirmations { get; set; }
        public virtual DbSet<LivingText> LivingTexts { get; set; }
        public virtual DbSet<ForgottenPassword> ForgottenPasswords { get; set; }
        public virtual DbSet<FileDocument> FileDocuments { get; set; }
        public virtual DbSet<Image> Images { get; set; }
        public virtual DbSet<ExceptionLog> ExceptionLogs { get; set; }
        public virtual DbSet<Language> Languages { get; set; }
        public virtual DbSet<Translation> Translations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserRoles>()
                .HasKey(bc => new { bc.UserId, bc.RoleId });
            modelBuilder.Entity<UserRoles>()
                .HasOne(bc => bc.Role)
                .WithMany(b => b.UserRoles)
                .HasForeignKey(bc => bc.RoleId);
            modelBuilder.Entity<UserRoles>()
                .HasOne(bc => bc.User)
                .WithMany(c => c.UserRoles)
                .HasForeignKey(bc => bc.UserId);

            modelBuilder.Entity<Translation>()
                .HasOne(bc => bc.LivingText)
                .WithMany(c => c.Translations)
                .HasForeignKey(bc => bc.LivingTextId);

            modelBuilder.Entity<Translation>()
                .HasOne(bc => bc.Language)
                .WithMany(c => c.Translations)
                .HasForeignKey(bc => bc.LanguageId);

            modelBuilder.Entity<Event>().ToTable("Events");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Role>().ToTable("Roles");
            modelBuilder.Entity<PasswordRecoveryConfirmation>().ToTable("PasswordRecoveryConfirmations");
            modelBuilder.Entity<LivingText>().ToTable("LivingTexts");
            modelBuilder.Entity<ForgottenPassword>().ToTable("ForgottenPasswords");
            modelBuilder.Entity<FileDocument>().ToTable("FileDocuments");
            modelBuilder.Entity<ExceptionLog>().ToTable("ExceptionLogs");
            modelBuilder.Entity<Language>().ToTable("Languages");
            modelBuilder.Entity<Translation>().ToTable("Translations");
        }
    }
}
