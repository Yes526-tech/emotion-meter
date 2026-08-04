namespace emotion_meter.Models
{
    public class MoodState
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Mutluluk { get; set; } // 0 = Maksimum Sinir, 100 = Maksimum Mutluluk
        public int Stres { get; set; }
    }
}
