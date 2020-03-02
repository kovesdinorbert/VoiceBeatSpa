using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Repository
{
    public class GenericRepository<T> : IGenericRepository<T>
    {
        public Task Create(T entity)
        {
            throw new NotImplementedException();
        }

        public Task Delete(T entity)
        {
            throw new NotImplementedException();
        }

        public Task Delete(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task<List<T>> FindAll(Func<bool> id, params Func<bool>[] wheres)
        {
            throw new NotImplementedException();
        }

        public Task<T> FindById(Guid id)
        {
            throw new NotImplementedException();
        }

        public Task Update(T entity)
        {
            throw new NotImplementedException();
        }
    }
}
