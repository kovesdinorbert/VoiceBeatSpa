using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Entities;

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
        Task CreateUser(User user, string password);
        string GetPasswordHash(string password, string salt, int costDivider = 1);
        Task DeleteUser(Guid id, string currentUserEmail);
    }
}
