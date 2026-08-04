namespace emotion_meter.Models
{
    public class MoodState
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Sinir { get; set; }
        public int Stres { get; set; }
        public int Mutluluk { get; set; }
    }
}
