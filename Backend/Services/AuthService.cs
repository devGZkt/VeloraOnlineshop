using Backend.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;

namespace Backend.Services
{
    public class AuthService
    {
        private readonly VeloraDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(VeloraDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }


        //Checks if user exists and if pw ist correct
        public async Task<string?> AuthenticateAsync(string userEmail, string pw)
        {
            //Searches db for email user gave us
            var user = await _db.Users.SingleOrDefaultAsync(x => x.Email == userEmail);

            //Checks if user is found in the db and checks if the pw is valid
            if (user == null || !BCrypt.Net.BCrypt.Verify(pw, user.PwHashed))
            {
                return null;
            }

            //returns a token for user if login is valid
            return GenererateJwtToken(user);
        }

        //Generatates token
        public string GenererateJwtToken(User user)
        {

            //Create Claims (first part of token)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                new Claim(JwtRegisteredClaimNames.GivenName, user.FirstName),
                new Claim(JwtRegisteredClaimNames.FamilyName, user.LastName),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            //Takes secret-key and transforms it into a byte-array
            var secretKey = "cOPI!?Bm2j}A+-g,6W:y_$Gv4pp*|Pnr"; //SecretKey only for dev hardcoded
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            //Hashes the key using HmacSha256
            var credentails = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            //App name for tokenDescriptor
            var appName = Assembly.GetExecutingAssembly().GetName().Name;

            //All things claims, key and credentials put together
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                SigningCredentials = credentails,
                Expires = DateTime.UtcNow.AddHours(4),
                Issuer = appName
            };

            //Create token
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
