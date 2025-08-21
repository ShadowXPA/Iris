using Iris.WebApi.Utils;

namespace Iris.WebApi.Models;

public class PaletteSettings
{
    public int Colors { get; set; } = Constants.DEFAULT_NUM_COLORS;
    public string? Url { get; set; }
    public IFormFile? File { get; set; }
}
