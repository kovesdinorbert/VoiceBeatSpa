﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using VoiceBeatSpa.Core.Interfaces;

namespace VoiceBeatSpa.Core.Entities
{
    public class Role: IHasId
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        public string Name { get; set; }


        public ICollection<PermissionRole> PermissionRoles { get; set; } = new List<PermissionRole>();

        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }
}