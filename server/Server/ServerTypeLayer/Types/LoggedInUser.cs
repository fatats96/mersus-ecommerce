using System;
using System.ComponentModel.DataAnnotations;

namespace ServerTypeLayer
{
    public class LoggedInUser
    {
        [Key]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string UserSurname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string IdentificationNo { get; set; }
    }
}
