using Iris.WebApi.Models;
using Iris.WebApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace Iris.WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaletteController(ILogger<PaletteController> logger, PaletteService paletteService) : ControllerBase
{
    private readonly ILogger<PaletteController> _logger = logger;
    private readonly PaletteService _paletteService = paletteService;

    [HttpPost]
    public async Task<IActionResult> GeneratePaletteAsync([FromForm] PaletteSettings paletteSettings)
    {
        if (string.IsNullOrWhiteSpace(paletteSettings.Url) && paletteSettings.File is null)
            return BadRequest("You need to specify an URL or a File...");

        var colors = await _paletteService.GeneratePaletteAsync(paletteSettings.Colors, paletteSettings.Url, paletteSettings.File);

        return Ok(colors);
    }
}
