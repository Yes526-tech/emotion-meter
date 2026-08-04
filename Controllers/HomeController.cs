using emotion_meter.Data;
using Microsoft.AspNetCore.Mvc;

namespace emotion_meter.Controllers
{
    public class HomeController : Controller
    {
        private readonly AppDbContext _context;

        public HomeController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var states = _context.MoodStates.ToList();
            return View(states);
        }
    }
}
