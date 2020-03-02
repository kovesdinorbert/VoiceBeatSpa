using System;
using System.Collections.Generic;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Core.Entities
{
    public class Role: IHasId
    {
        public Guid Id { get; set; }
        public string Name { get; set; }


        public IList<Permission> Permissions { get; set; } = new List<Permission>();

        public IList<User> Users { get; set; } = new List<User>();
    }
}