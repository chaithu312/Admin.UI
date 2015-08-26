namespace Admin.UI.Models
{
    public class Navigation
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int ParentId { get; set; }
        public string Type { get; set; }
        public string NavURL { get; set; }
    }
}