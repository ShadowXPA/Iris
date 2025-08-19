using Iris.Core;
using Iris.WebApi.Utils;

namespace Iris.WebApi.Services;

public class PaletteService(
    ILogger<PaletteService> logger,
    ImageLoader imageLoader,
    int sampleStep = Constants.DEFAULT_SAMPLE_STEPS,
    int maxIterations = Constants.DEFAULT_MAX_ITERATIONS
)
{
    private readonly ILogger<PaletteService> _logger = logger;
    private readonly ImageLoader _imageLoader = imageLoader;
    private readonly int _sampleStep = sampleStep;
    private readonly int _maxIterations = maxIterations;

    public async Task<List<string>> GeneratePaletteAsync(int numColors, string? uri = null, IFormFile? file = null)
    {
        var pixels = await GetImagePixelsAsync(uri, file);

        if (pixels.Count == 0 || numColors > pixels.Count) return [];

        var palette = KMeans.CalculateCentroids(numColors, pixels, _maxIterations);
        var colors = new List<string>();

        foreach (var c in palette)
            colors.Add($"#{c[0]:x2}{c[1]:x2}{c[2]:x2}");

        return colors;
    }

    private async Task<List<int[]>> GetImagePixelsAsync(string? uri = null, IFormFile? file = null)
    {
        _logger.LogInformation("Getting image pixels...");

        if (string.IsNullOrWhiteSpace(uri) && file is null)
        {
            _logger.LogWarning("Both the URI and file are null... Can not get image pixels...");
            return [];
        }

        using var image = file is not null ? await _imageLoader.LoadAsync(file.OpenReadStream()) : await _imageLoader.LoadAsync(new Uri(uri!));

        if (image is null)
        {
            _logger.LogWarning("Was not able to load image...");
            return [];
        }

        var pixels = new List<int[]>();

        for (int y = 0; y < image.Height; y += _sampleStep)
        {
            for (int x = 0; x < image.Width; x += _sampleStep)
            {
                var pixel = image[x, y];
                pixels.Add([pixel.R, pixel.G, pixel.B]);
            }
        }

        return pixels;
    }
}
