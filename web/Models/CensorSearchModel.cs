using CRMC.Domain;

namespace web.Models
{
    public class CensorSearchModel : PagerModel<Censor>
    {
        public string Word { get; set; }
    }
}