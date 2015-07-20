using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Admin.UI.Areas.User.Models
{
    public class User
    {
        [Required(ErrorMessage = "Username required", AllowEmptyStrings = false)]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password required", AllowEmptyStrings = false)]
        public string Password { get; set; }

        [Required(ErrorMessage = "Security Question required", AllowEmptyStrings = false)]
        public string SecurityQuestion { get; set; }

        [Required(ErrorMessage = "Security Answer required", AllowEmptyStrings = false)]
        public string SecurityAnswer { get; set; }
    }
}
