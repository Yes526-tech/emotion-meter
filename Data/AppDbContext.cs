using Microsoft.EntityFrameworkCore;
using emotion_meter.Models;

namespace emotion_meter.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<MoodState> MoodStates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Başlangıç verileri
            modelBuilder.Entity<MoodState>().HasData(
                new MoodState { Id = 1, UserName = "Gülşah", Sinir = 0, Stres = 0, Mutluluk = 100 },
                new MoodState { Id = 2, UserName = "Yunus Emre", Sinir = 0, Stres = 0, Mutluluk = 100 }
            );
        }
    }
}
