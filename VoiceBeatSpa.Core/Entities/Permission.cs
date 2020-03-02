using System;
using System.Collections.Generic;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Core.Entities
{
    public class Permission: IHasId
    {
        public Guid Id { get; set; }
        public string Name { get; set; }

        public IList<Role> Roles { get; set; } = new List<Role>();
    }
}