using System;
using VoiceBeatSpa.Core.Entities;

namespace VoiceBeatSpa.Core.Interfaces
{
    public interface IHasCrud : IHasIsActive
    {
        DateTime Created { get; set; }
        Guid CreatedBy { get; set; }
        DateTime? Modified { get; set; }
        Guid? ModifiedBy { get; set; }
    }
}
