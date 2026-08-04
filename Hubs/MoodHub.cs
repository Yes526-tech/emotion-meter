using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using emotion_meter.Data;
using emotion_meter.Models;

namespace emotion_meter.Hubs
{
    public class MoodHub : Hub
    {
        private readonly AppDbContext _context;

        public MoodHub(AppDbContext context)
        {
            _context = context;
        }

        public async Task UpdateMood(string userName, int stres, int mutluluk)
        {
            var userMood = await _context.MoodStates.FirstOrDefaultAsync(m => m.UserName == userName);
            if (userMood != null)
            {
                userMood.Stres = stres;
                userMood.Mutluluk = mutluluk;
                await _context.SaveChangesAsync();
            }

            // Diğer istemcilere güncel veriyi gönder
            await Clients.Others.SendAsync("ReceiveMoodUpdate", userName, stres, mutluluk);
        }
    }
}
