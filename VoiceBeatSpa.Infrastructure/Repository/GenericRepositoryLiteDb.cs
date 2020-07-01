using LiteDB;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using VoiceBeatSpa.Core.Configuration;
using VoiceBeatSpa.Core.Entities;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Infrastructure.Repository
{
    public class GenericRepositoryLiteDb<T> : IGenericRepository<T> where T:class
    {
        private readonly string _dbLoc;
        private readonly DbConfiguration _dbConfiguration;

        public GenericRepositoryLiteDb(IOptions<DbConfiguration> dbConfiguration)
        {
            _dbConfiguration = dbConfiguration.Value;
            _dbLoc = _dbConfiguration.SqlLitePath;
        }

        public async Task CreateAsync(T entity)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                if (typeof(T).IsSubclassOf(typeof(_CrudBase)))
                {
                    ((IHasCrud)entity).Created = DateTime.Now;
                }
                db.Insert(entity);
            }
        }

        public async Task DeleteAsync(T entity)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                db.Delete<T>(new BsonValue(((IHasId)entity).Id));
            }
        }

        public async Task DeleteAsync(Expression<Func<T, bool>> where)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                db.DeleteMany<T>(where);
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                db.Delete<T>(new BsonValue(id));
            }
        }

        public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> where, params Func<IQueryable<T>, IQueryable<T>>[] includes)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                var result = db.Query<T>()
                               .Where(where);

                //foreach (var include in includes)
                //{
                //    result.Include(include);
                //}

                return await Task.FromResult(result.ToList());
            }
        }

        //TODO: include sections differs in include params from EF core
        //public async Task<List<T>> FindAllAsync(Expression<Func<T, bool>> where, params Expression<Func<T, object>>[] includes)
        //{
        //    using (var db = new LiteRepository(_dbLoc))
        //    {
        //        var result = db.Query<T>()
        //                       .Where(where);

        //        foreach (var include in includes)
        //        {
        //            result.Include(include);
        //        }

        //        return await Task.FromResult(result.ToList());
        //    }
        //}

        public async Task<T> FindByIdAsync(Guid id)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                T ret = default(T);
                try
                {
                    ret = db.SingleById<T>(new BsonValue(id));
                }
                catch(System.InvalidOperationException)
                {
                    if (ret == null)
                    {
                        //log
                    }
                }
                return await Task.FromResult(ret);
            }
        }

        public async Task UpdateAsync(T entity)
        {
            using (var db = new LiteRepository(_dbLoc))
            {
                db.Update(entity);
            }
        }
    }
}
