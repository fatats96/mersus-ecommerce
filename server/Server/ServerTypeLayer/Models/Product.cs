using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTypeLayer.Models
{
    public class Product
    {
        [Key]
        [Column("producId")]
        public int ProductId { get; set; }
        [Column("productName")]
        public string ProductName { get; set; }
        [Column("productDetail")]
        public string ProductDetail { get; set; }
        [Column("productQuantity")]
        public int ProductQuantity { get; set; }
        [Column("productPrice")]
        public double ProductPrice { get; set; }
        [Column("productImage")]
        public string ProductImage { get; set; }
        [Column("status")]
        public int Status { get; set; }
        public virtual Category Category { get; set; }
    }
}
