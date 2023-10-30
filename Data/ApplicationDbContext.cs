using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Weatherly.Models;

namespace Weatherly.Data
{
	public class ApplicationDbContext : IdentityDbContext
	{

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
			: base(options)
		{
		}
	}
}