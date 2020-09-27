using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTypeLayer.Models
{
    public class BasketProductObject {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public int ProductQuantity { get; set; }
        public string ProductDetail { get; set; }
        public double ProductPrice { get; set; }
    }

    public class Basket
    {
        [Key]
        [Column("basketId")]
        public int BasketId { get; set; }
        [Column("userId")]
        public int UserId { get; set; }
        [Column("basketProduct", TypeName = "text")]
        public List<BasketProductObject> BasketProduct { get; set; }
        [Column("basketCost")] 
        public double? BasketCost { get; set; }
        [Column("status")]
        public int Status { get; set; }
        public virtual IList<User> Users { get; set; }
    }
}
