﻿using System.ComponentModel.DataAnnotations;

namespace Admin.UI.Areas.User.Models
{
    public class Login
    {
        [Required(ErrorMessage = "UserName is required")]
        [StringLength(16, ErrorMessage = "Must be between 5 and 50 characters", MinimumLength = 5)]
        [RegularExpression("^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$", ErrorMessage = "Must be a valid email")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(255, ErrorMessage = "Must be between 8 and 255 characters", MinimumLength = 8)]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required(ErrorMessage = "DomainKey is required")]
        // [StringLength(32, ErrorMessage = "Must be unique GUID", MinimumLength = 32)]
        public string DomainKey { get; set; }
    }
}