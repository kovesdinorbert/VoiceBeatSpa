using System;

namespace VoiceBeatSpa.Core.Entities
{
    public class PermissionRole
    {
        public Guid PermissionId { get; set; }
        public Permission Permission { get; set; }
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
    }
}
