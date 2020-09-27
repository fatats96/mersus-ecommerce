using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTypeLayer.Models
{
    public class User
    {
        [Key]
        [Column("userId")]
        public int UserId { get; set; }

        [Column("userType")]
        [DefaultValue("normaluser")]
        public string UserType { get; set; } 

        [Column("userIdNo", TypeName = "varchar(11)")]
        public string UserIdNo { get; set; }

        [Column("userName")]
        public string UserName { get; set; }

        [Column("userSurname")]
        public string UserSurname { get; set; }

        [Column("userPassword")]    
        public string UserPassword { get; set; }

        [Column("email")]
        public string Email { get; set; }

        [Column("userPhoneNumber", TypeName = "varchar(20)")]
        public string UserPhoneNumber { get; set; }

        [Column("userAddress")]
        public string UserAddress { get; set; }

        [Column("status")]
        public int Status { get; set; }

        public virtual Basket Basket { get; set; }
    }
}
