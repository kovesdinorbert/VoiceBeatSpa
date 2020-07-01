using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
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
            //_dbConfiguration = dbConfiguration.Value;
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (_dbConfiguration != null)
        //    {
        //        optionsBuilder.UseSqlServer(_dbConfiguration.DbConnection);
        //    }
        //}

        //protected override void OnConfiguring(DbContextOptionsBuilder options)
        //    => options.UseSqlite("Data Source=blogging.db");

        public virtual DbSet<Event> Events { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Permission> Permissions { get; set; }
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
            modelBuilder.Entity<PermissionRole>()
                .HasKey(bc => new { bc.RoleId, bc.PermissionId });
            modelBuilder.Entity<PermissionRole>()
                .HasOne(bc => bc.Role)
                .WithMany(b => b.PermissionRoles)
                .HasForeignKey(bc => bc.RoleId);
            modelBuilder.Entity<PermissionRole>()
                .HasOne(bc => bc.Permission)
                .WithMany(c => c.PermissionRoles)
                .HasForeignKey(bc => bc.PermissionId);

            modelBuilder.Entity<UserRole>()
                .HasKey(bc => new { bc.UserId, bc.RoleId });
            modelBuilder.Entity<UserRole>()
                .HasOne(bc => bc.Role)
                .WithMany(b => b.UserRoles)
                .HasForeignKey(bc => bc.RoleId);
            modelBuilder.Entity<UserRole>()
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
            modelBuilder.Entity<Permission>().ToTable("Permissions");
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
