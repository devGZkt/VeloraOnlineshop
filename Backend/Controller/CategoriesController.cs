using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controller
{
    public class CategoriesController
    {
        private readonly VeloraDbContext _db;

        public CategoriesController(VeloraDbContext db)
        {
            db = _db;
        }




    }
}
