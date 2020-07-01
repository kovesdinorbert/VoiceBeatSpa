using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Core.Entities
{
    public abstract class _CrudBase : IHasId, IHasCrud
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public DateTime Created { get; set; }
        public Guid CreatedBy { get; set; }

        public DateTime? Modified { get; set; }
        public Guid? ModifiedBy { get; set; }

        public bool IsActive { get; set; }
    }
}
