using emotion_meter.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace emotion_meter.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public HomeController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            var states = _context.MoodStates.ToList();
            return View(states);
        }

        [HttpGet]
        public async Task<IActionResult> GetHappyMessage()
        {
            var apiKey = _configuration["GeminiApiKey"];
            if (string.IsNullOrEmpty(apiKey) || apiKey == "YOUR_GEMINI_API_KEY_HERE")
            {
                return Json(new { message = "(Sistem) Aşkım şu an AI bağlantım yok ama bil ki Emre seni çok seviyor! Sen ne kadar kötü hissedersen hisset ben hep buradayım! ❤️" });
            }

            try
            {
                using var client = new HttpClient();
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new { text = "Senin adın Emre. Sen Gülşah'ın sevgilisisin. Gülşah şu an kendini çok kötü (I'm not good) ve üzgün hissediyor. Sen onun yanında olamadığın zamanlarda ona destek olmak için bu sisteme entegre edildin. Ona ne kadar değer verdiğini, onu sevdiğini hissettir. Onu motive et, tatlı ve sevgi dolu bir mesaj yaz ya da aranızda geçebilecek komik/tatlı bir espri yap. Asla bir yapay zeka olduğunu belli etme, tamamen aşık bir erkek arkadaş gibi konuş. Yanıtın kısa ve öz olsun, maksimum 2-3 cümle." }
                            }
                        }
                    }
                };

                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                var response = await client.PostAsync($"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}", content);

                if (response.IsSuccessStatusCode)
                {
                    var responseString = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(responseString);
                    var text = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
                    return Json(new { message = text });
                }
                else
                {
                    return Json(new { message = "Yapay zeka şu an meşgul ama sen harikasın! 🌟" });
                }
            }
            catch
            {
                return Json(new { message = "Bir sorun oluştu ama gülümsemeyi unutma! 😊" });
            }
        }
    }
}
