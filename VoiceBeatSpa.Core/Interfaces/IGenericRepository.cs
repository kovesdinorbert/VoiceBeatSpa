using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IGenericRepository<T>
    {
        Task<T> FindById(Guid id);
        Task<List<T>> FindAll(Func<bool> id, params Func<bool>[] wheres);
        Task Create(T entity);
        Task Update(T entity);
        Task Delete(T entity);
        Task Delete(Guid id);
    }
}
