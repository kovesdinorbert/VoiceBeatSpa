using System;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Core.Entities
{
    public abstract class _CrudBase : IHasId, IHasCrud
    {
        public Guid Id { get; set; }

        public DateTime Created { get; set; }
        public Guid CreatedBy { get; set; }

        public DateTime? Modified { get; set; }
        public Guid? ModifiedBy { get; set; }

        public bool IsActive { get; set; }
    }
    }
}
