using Microsoft.Extensions.Logging;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace Iris.Core;

public class ImageLoader(ILogger<ImageLoader>? logger = null, bool useLocalFileSystem = false)
{
    private readonly ILogger<ImageLoader>? _logger = logger;
    private readonly bool _useLocalFileSystem = useLocalFileSystem;

    public async Task<Image<Rgba32>?> LoadAsync(Uri uri)
    {
        try
        {
            _logger?.LogDebug("Loading image from {uri}...", uri);

            if (uri.IsAbsoluteUri && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps))
            {
                using var client = new HttpClient();
                var stream = await client.GetStreamAsync(uri);
                return await Image.LoadAsync<Rgba32>(stream);
            }

            _logger?.LogDebug("Use local file system? {localFileSystem}", _useLocalFileSystem);

            if (_useLocalFileSystem)
                return await Image.LoadAsync<Rgba32>(uri.LocalPath);
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "An error occurred trying to load image...");
        }

        return null;
    }

    public async Task<Image<Rgba32>?> LoadAsync(Stream stream)
    {
        _logger?.LogDebug("Loading image from stream...");

        try
        {
            return await Image.LoadAsync<Rgba32>(stream);
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "An error occurred trying to load image...");
        }

        return null;
    }
}
