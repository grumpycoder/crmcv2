﻿using CRMC.Domain;
using Heroic.AutoMapper;

namespace web.Models
{
    public class UserViewModel : IMapFrom<ApplicationUser>
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string[] Roles { get; set; }
        public byte[] UserPhoto { get; set; }
        public string UserPhotoType { get; set; }
    }
}