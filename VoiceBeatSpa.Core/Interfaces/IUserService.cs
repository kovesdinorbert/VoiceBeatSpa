using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Enums;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IUserService
    {
        Task<User> Login(string email, string password);
        string GenerateToken(User user);
        Task<List<User>> GetUsers(string currentUserEmail);
        Task<User> GetUser(string email, string currentUserEmail);
        Task<User> GetUser(Guid id, string currentUserEmail);
        Task<User> GetCurrentUserByEmail(string email);
        Task UpdateUser(User user, string password, string currentUserEmail);
        Task CreateUser(User user, string password, bool isSocial, LanguageEnum languageCode = LanguageEnum.hu);
        string GetPasswordHash(string password, string salt, int costDivider = 1);
        Task DeleteUser(Guid id, string currentUserEmail);
        Task SendPasswordRemainder(string email, LanguageEnum languageCode);
        Task RecoverPassword(Guid id, string password1, string password2);
        Task ActivateUser(Guid id);
    }
}
