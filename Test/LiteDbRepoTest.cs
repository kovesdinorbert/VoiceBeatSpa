using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Infrastructure.Repository;
using Xunit;

namespace Test
{
    public class LiteDbRepoTest
    {
        private readonly GenericRepositoryLiteDb<User> _repository;
        private const string dbAcc = @".\TestData.db";
        private readonly Guid testGuid;

        public LiteDbRepoTest()
        {
            DeleteTestDb();
            testGuid = Guid.NewGuid();
            var conf = Options.Create(new DbConfiguration() { SqlLitePath = dbAcc });

            _repository = new GenericRepositoryLiteDb<User>(conf);
        }

        [Fact]
        public async void Creating()
        {
            //DeleteTestDb();

            //await AddTestUsers();

            //var res = await _repository.FindAllAsync(u => u.IsActive, u => u.UserRoles);

            //Assert.NotNull(res);
            //Assert.Equal(3, res.Count);
            //Assert.DoesNotContain(res, u => u.UserRoles.Count != 1);
        }

        [Fact]
        public async void FindByIdUpdating()
        {
            DeleteTestDb();

            await AddTestUsers();

            var user = await _repository.FindByIdAsync(testGuid);
            var now = DateTime.Now;

            if (user != null)
            {
                user.Modified = now;
                await _repository.UpdateAsync(user, Guid.Empty);
            }

            Assert.NotNull(user);
            Assert.Equal(now, user.Modified);
        }

        [Fact]
        public async void FindByIdNegative()
        {
            DeleteTestDb();

            await AddTestUsers();

            var user = await _repository.FindByIdAsync(Guid.Empty);


            Assert.Null(user);
        }

        [Fact]
        public async void FindAll0()
        {
            DeleteTestDb();

            var users = await _repository.FindAllAsync(u => u.IsActive);

            Assert.Empty(users);
        }

        [Fact]
        public async void FindAll()
        {
            DeleteTestDb();

            await AddTestUsers();

            var users = await _repository.FindAllAsync(u => u.IsActive);

            Assert.Equal(3, users.Count);
        }

        [Fact]
        public async void DeleteById()
        {
            DeleteTestDb();

            await AddTestUsers();

            await _repository.DeleteAsync(testGuid);
            var users = await _repository.FindAllAsync(u => u.IsActive);
            var deleted = await _repository.FindByIdAsync(testGuid);

            Assert.Equal(2, users.Count);
            Assert.Null(deleted);
        }

        [Fact]
        public async void DeleteEntity()
        {
            DeleteTestDb();

            await AddTestUsers();
            var user = await _repository.FindByIdAsync(testGuid);

            await _repository.DeleteAsync(user);

            var users = await _repository.FindAllAsync(u => u.IsActive);
            var deleted = await _repository.FindByIdAsync(testGuid);

            Assert.Equal(2, users.Count);
            Assert.Null(deleted);
        }

        [Fact]
        public async void DeleteMany()
        {
            DeleteTestDb();

            await AddTestUsers();

            await _repository.DeleteAsync(u => u.IsActive);

            var users = await _repository.FindAllAsync(u => u != null);

            Assert.Single(users);
        }

        private async Task AddTestUsers()
        {
            var user2Id = Guid.NewGuid();
            var user3Id = Guid.NewGuid();
            var user4Id = Guid.NewGuid();
            var roles = new List<Role>() { new Role() { Name = "test role" } };

            var userRoles = new List<UserRole>() { new UserRole() { /*UserId = user2Id = "test role" */} };

            await _repository.CreateAsync(new User() { Id = testGuid, IsActive = true, UserRoles = userRoles }, Guid.Empty);
            await _repository.CreateAsync(new User() { Id = user2Id, IsActive = false, UserRoles = userRoles }, Guid.Empty);
            await _repository.CreateAsync(new User() { Id = user3Id, IsActive = true, UserRoles = userRoles }, Guid.Empty);
            await _repository.CreateAsync(new User() { Id = user4Id, IsActive = true, UserRoles = userRoles }, Guid.Empty);
        }

        private void DeleteTestDb()
        {
            if (File.Exists(dbAcc))
            {
                File.Delete(dbAcc);
            }
        }
    }
}
