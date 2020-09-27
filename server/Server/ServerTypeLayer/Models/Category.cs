using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ServerTypeLayer.Models
{
    public class Category
    {
        [Key]
        [Column("categoryId")]
        public int CategoryId { get; set; }
        [Column("categoryName")]
        public string CategoryName { get; set; }
        [Column("status")]
        public int Status { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
