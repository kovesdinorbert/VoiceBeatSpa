using CryptSharp.Utility;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
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
        private readonly VoiceBeatConfiguration _voiceBeatConfiguration;

        private static readonly Random random = new Random(unchecked((int)DateTime.UtcNow.Ticks));
        private const string saltChars = "abcdefghijklmnopqrstuvwxyz0123456789";

        public UserService(ILogger<UserService> logger,
                           IGenericRepository<User> userRepository,
                           IGenericRepository<Role> roleRepository,
                           IOptions<VoiceBeatConfiguration> voiceBeatConfiguration)
        {
            _logger = logger;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _voiceBeatConfiguration = voiceBeatConfiguration.Value;
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

        public async Task CreateUser(User user, string password)
        {
            if (!IsValidEmail(user.Email))
            {
                throw new ArgumentException("Invalid email address: " + user.Email);
            }

            var emailCheck = await _userRepository.FindAllAsync(u => u.Email == user.Email && !u.SocialLogin);
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

            user.UserRoles.Add(new UserRole() {RoleId =  role.Id, UserId =  user.Id});
            SetPassword(user, password);

            await _userRepository.UpdateAsync(user, user.Id);

            PasswordRecoveryConfirmation rec = new PasswordRecoveryConfirmation()
            {
                IsActive = true,
                UserId = user.Id,
            };
            //passwordRecoveryConfirmationService.Create(rec);
            //SendEmail(rec.Id.ToString(), User.Email);
            
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

            await _userRepository.DeleteAsync(id);
        }
    }
}
