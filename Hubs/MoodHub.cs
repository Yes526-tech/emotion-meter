using Microsoft.AspNetCore.SignalR;
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

        public async Task UpdateMood(string userName, int sinir, int stres, int mutluluk)
        {
            // Veritabanını güncelle
            var userMood = _context.MoodStates.FirstOrDefault(m => m.UserName == userName);
            if (userMood != null)
            {
                userMood.Sinir = sinir;
                userMood.Stres = stres;
                userMood.Mutluluk = mutluluk;
                await _context.SaveChangesAsync();
            }

            // Diğer istemcilere (gönderen hariç) yeni durumu bildir
            await Clients.Others.SendAsync("ReceiveMoodUpdate", userName, sinir, stres, mutluluk);
        }
    }
}
