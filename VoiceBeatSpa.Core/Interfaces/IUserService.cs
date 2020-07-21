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
        Task<List<User>> GetUsers();
        Task<User> GetUser(string email);
        Task<User> GetUser(Guid id);
        Task UpdateUser(User user, string password);
        Task CreateUser(User user, string password);
        string GetPasswordHash(string password, string salt, int costDivider = 1);
        Task DeleteUser(Guid id);
    }
}
