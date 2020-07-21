﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IGenericRepository<T> where T: class
    {
        Task<T> FindByIdAsync(Guid id);
        Task<List<T>> FindAllAsync(Expression<Func<T, bool>> where, params Func<IQueryable<T>, IQueryable<T>>[] includes);
        Task CreateAsync(T entity, Guid userId);
        Task UpdateAsync(T entity, Guid userId);
        Task DeleteAsync(T entity);
        Task DeleteAsync(Guid id);
        Task DeleteAsync(Expression<Func<T, bool>> where);
    }
}
