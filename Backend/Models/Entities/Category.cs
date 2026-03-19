using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models.Entities
{

    public class Category
    {
        //PK
        public required int CategoryId { get; set; }


        //Fields
        public string? Slug { get; set; }

        public required bool Active { get; set; }

        public string? Description { get; set; }

        public required int DisplayOrder  { get; set; }
    }
}