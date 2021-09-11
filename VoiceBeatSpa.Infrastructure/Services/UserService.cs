﻿using CryptSharp.Utility;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Services
{
    public class UserService : IUserService
    {
        private readonly ILogger<UserService> _logger;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IGenericRepository<ForgottenPassword> _forgottenPasswordRepository;
        private readonly IGenericRepository<PasswordRecoveryConfirmation> _passwordRecoveryConfirmationRepository;
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;
        private readonly IEmailService _emailService;
        private readonly ILanguageService _languageService;

        private static readonly Random random = new Random(unchecked((int)DateTime.UtcNow.Ticks));
        private const string saltChars = "abcdefghijklmnopqrstuvwxyz0123456789";

        public UserService(ILogger<UserService> logger,
                           IGenericRepository<User> userRepository,
                           IGenericRepository<Role> roleRepository,
                           IGenericRepository<ForgottenPassword> forgottenPasswordRepository,
                           IGenericRepository<PasswordRecoveryConfirmation> passwordRecoveryConfirmationRepository,
                           IOptions<VoiceBeatConfiguration> voiceBeatConfiguration,
                           IEmailService emailService,
                           ILanguageService languageService)
        {
            _logger = logger;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _forgottenPasswordRepository = forgottenPasswordRepository;
            _passwordRecoveryConfirmationRepository = passwordRecoveryConfirmationRepository;
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
            _emailService = emailService;
            _languageService = languageService;
        }

        public async Task<User> Login(string email, string password)
        {
            User user = await GetCurrentUserByEmail(email);

            if (user != null && user.IsActive && !user.SocialLogin)
            {
                bool wrongPassword = false;
                if (GetPasswordHash(password, user.Salt.TrimEnd()) == user.Password 
                    && user.WrongPasswordCount <= _voiceBeatConfiguration.MaxFailedLogin)
                {
                    user.LastLogin = DateTime.UtcNow;
                    user.WrongPasswordCount = 0;
                }
                else
                {
                    wrongPassword = true;
                    user.WrongPasswordCount++;
                    user.LastWrongPassword = DateTime.UtcNow;
                }

                await _userRepository.UpdateAsync(user, user.Id);
                if (wrongPassword)
                {
                    user = null;
                }
            }
            return user;
        }

        public string GenerateToken(User user)
        {
            var secretKey = Encoding.UTF8.GetBytes(_voiceBeatConfiguration.SecretKey);
            var signinCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKey), SecurityAlgorithms.HmacSha256Signature);

            var tokenOptions = new JwtSecurityToken(
                //issuer: _tokenValidationConfiguration.ValidIssuer,
                //audience: _tokenValidationConfiguration.ValidAudience,
                claims: GenerateClaims(user),
                expires: DateTime.Now.AddDays(_voiceBeatConfiguration.TokenExpiresDay),
                signingCredentials: signinCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return tokenString;
        }

        public async Task<List<User>> GetUsers(string currentUserEmail)
        {
            var currentUser = await GetCurrentUserByEmail(currentUserEmail);
            if (!currentUser.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower())))
            {
                throw new ArgumentException($"Somebody from {currentUserEmail} wanted to get the list of users");
            }

            var users = await _userRepository.FindAllAsync(u => !string.Equals(u.Email, "system"));

            return users;
        }

        public async Task<User> GetUser(string email, string currentUserEmail)
        {
            User user = null;

            var includes = new Func<IQueryable<User>, IQueryable<User>>[]
            {
                source => source.Include(m => m.UserRoles)
                    .ThenInclude(m => m.Role),
            };

            var users = await _userRepository.FindAllAsync(u => u.Email.ToLower() == email.ToLower() 
                                                                && u.IsActive 
                                                                && u.Password != "" 
                                                                && u.Salt != "",
                                                                includes);
            if (users.Any())
            {
                try
                {
                    var currentUser = await GetCurrentUserByEmail(currentUserEmail);
                    if (currentUserEmail != email && !currentUser.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower())))
                    {
                        throw new ArgumentException($"Somebody from {currentUserEmail} wanted to get User {users.First().Id}");
                    }

                    user = users.Single();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"More users found with email ({email}): " + ex.Message);
                    user = users.First();
                }
            }
            return user;
        }

        public async Task<User> GetUser(Guid id, string currentUserEmail)
        {
            User user = null;

            var includes = new Func<IQueryable<User>, IQueryable<User>>[]
            {
                source => source.Include(m => m.UserRoles)
                    .ThenInclude(m => m.Role),
            };

            var users = await _userRepository.FindAllAsync(u => u.Id == id 
                                                                && u.IsActive 
                                                                && u.Password != "" 
                                                                && u.Salt != "",
                                                                includes);
            if (users.Any())
            {
                try
                {

                    var currentUser = await GetCurrentUserByEmail(currentUserEmail);

                    if (currentUser.Id != users.First().Id && !currentUser.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower())))
                    {
                        throw new ArgumentException($"Somebody from {currentUserEmail} wanted to get User {id}");
                    }

                    user = users.Single();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"More users found with id ({id}): " + ex.Message);
                    user = users.First();
                }
            }
            return user;
        }

        public async Task<User> GetCurrentUserByEmail(string email)
        {
            User user = null;

            var includes = new Func<IQueryable<User>, IQueryable<User>>[]
            {
                source => source.Include(m => m.UserRoles)
                    .ThenInclude(m => m.Role),
            };

            var users = await _userRepository.FindAllAsync(u => u.Email.ToLower() == email.ToLower()
                                                                && u.IsActive
                                                                && u.Password != ""
                                                                && u.Salt != "",
                includes);

            if (users.Any())
            {
                try
                {
                    user = users.Single();
                }
                catch (Exception ex)
                {
                    _logger.LogError($"More users found with email ({email}): " + ex.Message);
                    user = users.First();
                }
            }
            return user;
        }

        public string GetPasswordHash(string password, string salt, int costDivider = 1)
        {
            byte[] hashBytes = SCrypt.ComputeDerivedKey(key: Encoding.Unicode.GetBytes(password),
                                                        salt: Encoding.UTF8.GetBytes(salt),
                                                        cost: Convert.ToInt32(16384 / costDivider),
                                                        blockSize: 8,
                                                        parallel: 1,
                                                        maxThreads: null,
                                                        derivedKeyLength: 32);

            return string.Join("", hashBytes.Select(b => b.ToString("X2")));
        }

        public List<Claim> GenerateClaims(User user)
        {
            var claims = new List<Claim>();

            foreach (var userRole in user.UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole.Role.Name));
            }
            claims.Add(new Claim(ClaimTypes.Name, user.Email));

            return claims;
        }

        public async Task UpdateUser(User user, string password, string currentUserEmail)
        {
            var currentUser = await GetCurrentUserByEmail(currentUserEmail);

            if (currentUser.Id != user.Id)
            {
                throw new ArgumentException($"Somebody from {currentUserEmail} wanted to modify User {user.Id}");
            }

            if (!IsValidEmail(user.Email))
            {
                throw new ArgumentException("Invalid email address: " + user.Email);
            }

            if (!string.IsNullOrEmpty(password))
            {
                SetPassword(user, password);
            }

            await _userRepository.UpdateAsync(user, user.Id);
        }

        public async Task CreateUser(User user, string password, bool isSocial, LanguageEnum languageCode = LanguageEnum.hu)
        {
            if (!IsValidEmail(user.Email))
            {
                throw new ArgumentException("Invalid email address: " + user.Email);
            }

            var emailCheck = await _userRepository.FindAllAsync(u => u.Email == user.Email);
            if (emailCheck.Any())
            {
                throw new ArgumentException("Already contains email: " + user.Email);
            }

            var roleQ = await _roleRepository.FindAllAsync(r => r.Name.ToLower() == RoleEnum.User.ToString().ToLower());
            var role = roleQ.FirstOrDefault();
            if (role == null)
            {
                throw new NullReferenceException();
            }

            await _userRepository.CreateAsync(user, Guid.Empty);

            user.UserRoles.Add(new UserRoles() {RoleId =  role.Id, UserId =  user.Id});
            SetPassword(user, password);

            user.IsActive = isSocial;

            await _userRepository.UpdateAsync(user, user.Id);

            if (!isSocial)
            {
                PasswordRecoveryConfirmation rec = new PasswordRecoveryConfirmation()
                {
                    IsActive = true,
                    UserId = user.Id,
                };
                await _passwordRecoveryConfirmationRepository.CreateAsync(rec, user.Id);

                var translationQ = await _languageService.GetTranslatedEmailTemplate(LivingTextTypeEnum.EmailRegistration, languageCode);

                string mainurl = _voiceBeatConfiguration.SiteUrl;
                var body = translationQ.Text.Replace("#NEWGUID#", rec.Id.ToString()).Replace("#MAINURL#", mainurl);

                await _emailService.SendEmail(_voiceBeatConfiguration.SendEmailFromDomain, user.Email, translationQ.Subject, body, "Voice-Beat");
            }
        }

        public async Task ActivateUser(Guid id)
        {
            var confirmation = await _passwordRecoveryConfirmationRepository.FindAllAsync(prc => prc.Id == id,
                new Func<IQueryable<PasswordRecoveryConfirmation>, IQueryable<PasswordRecoveryConfirmation>>[]
                {
                    source => source.Include(m => m.User)
                });

            if (confirmation.SingleOrDefault() == null || confirmation.Single().User == null)
            {
                throw new NullReferenceException();
            }

            var user = confirmation.Single().User;
            user.IsActive = true;
            await _userRepository.UpdateAsync(user, user.Id);
        }

        private void SetPassword(User u, string password)
        {
            u.Salt = new string(Enumerable.Range(0, 16).Select(p => saltChars[random.Next(0, saltChars.Length)]).ToArray());
            u.Password = GetPasswordHash(password, u.Salt);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        public async Task DeleteUser(Guid id, string currentUserEmail)
        {
            var currentUser = await GetCurrentUserByEmail(currentUserEmail);

            if (currentUser.Id != id && !currentUser.UserRoles.Any(ur => string.Equals(ur.Role.Name.ToLower(), RoleEnum.Admin.ToString().ToLower())))
            {
                throw new ArgumentException($"Somebody from {currentUserEmail} wanted to delete User {id}");
            }

            var prs = await _forgottenPasswordRepository.FindAllAsync(fp => fp.UserId == id);
            var pcs = await _passwordRecoveryConfirmationRepository.FindAllAsync(fp => fp.UserId == id);

            for (int i = 0; i < prs.Count; i++)
            {
                await _forgottenPasswordRepository.DeleteAsync(prs[i].Id);
            }
            for (int i = 0; i < pcs.Count; i++)
            {
                await _passwordRecoveryConfirmationRepository.DeleteAsync(pcs[i].Id);
            }

            await _userRepository.DeleteAsync(id);
        }

        public async Task SendPasswordRemainder(string email, LanguageEnum languageCode)
        {
            var user = await GetCurrentUserByEmail(email);
            if (user != null)
            {
                string rand = Path.GetRandomFileName();
                rand = rand.Replace(".", "");

                ForgottenPassword fpc = new ForgottenPassword()
                {
                    User = user,
                    Created = DateTime.Now,
                    IsActive = true,
                    VerificationCode = rand
                };

                await _forgottenPasswordRepository.CreateAsync(fpc, user.Id);

                var translationQ = await _languageService.GetTranslatedEmailTemplate(LivingTextTypeEnum.EmailForgottenPassword, languageCode);

                string mainurl = _voiceBeatConfiguration.SiteUrl;
                var body = translationQ.Text.Replace("#NEWGUID#", fpc.Id.ToString()).Replace("#MAINURL#", mainurl);

                await _emailService.SendEmail(_voiceBeatConfiguration.SendEmailFromDomain, user.Email, translationQ.Subject, body, "Voice-Beat");
            }
        }

        public async Task RecoverPassword(Guid id, string password1, string password2)
        {
            DateTime d = DateTime.Today.AddDays(-2);
            var actQ = await _forgottenPasswordRepository.FindAllAsync(p => p.Id == id && p.Created > d && p.IsActive,
                new Func<IQueryable<ForgottenPassword>, IQueryable<ForgottenPassword>>[]
                {
                    source => source.Include(m => m.User)
                });

            var act = actQ.FirstOrDefault();
            if (act != null)
            {
                if (password1 != password2)
                {
                    throw new ArgumentException();
                }

                if (!act.UserId.HasValue)
                {
                    throw new ArgumentException();
                }

                act.IsActive = false;

                await UpdateUser(act.User, password1, act.User.Email);
                await  _forgottenPasswordRepository.UpdateAsync(act, act.UserId.Value);

            }
            else
            {
                throw new NullReferenceException();
            }
        }

        public async Task SendNewsLetter(string body)
        {
            var users = await _userRepository.FindAllAsync(u => !string.Equals(u.Email, "system") && u.Newsletter);

            foreach (var user in users)
            {
                await _emailService.SendEmail(_voiceBeatConfiguration.SendEmailFromDomain, user.Email, "Voice-Beat hírlevél", body, "Voice-Beat");
            }
        }
    }
}
