using System.ComponentModel.DataAnnotations;

namespace Admin.UI.UserArea.Model
{
    public class User
    {
        [Required(ErrorMessage = "Username is required.", AllowEmptyStrings = false)]
        public string userName { get; set; }

        [Required(ErrorMessage = "Password is required.", AllowEmptyStrings = false)]
        public string password { get; set; }

        [Required(ErrorMessage = "Security question is required.", AllowEmptyStrings = false)]
        public string securityQuestion { get; set; }

        [Required(ErrorMessage = "Security answer is required.", AllowEmptyStrings = false)]
        public string securityAnswer { get; set; }
    }
}