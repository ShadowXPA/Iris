using CommandLine;
using CommandLine.Text;
using Iris.Cli.Exceptions;
using Iris.Cli.Extensions;
using Iris.Core;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Extensions.Logging;

namespace Iris.Cli;

public class Program
{
    private class Options
    {
        [Option('p', "path", HelpText = "The path to the image. Can be an HTTP/HTTPS URL, or a file path.", Default = null, Required = true)]
        public string? Path { get; set; }

        [Option('c', "colors", HelpText = "The number of colors to generate the palette. (Minimum: 1)", Default = 5)]
        public int NumColors { get; set; }

        [Option('s', "step", HelpText = "Sample step. Higher numbers increase performance, but decrease accuracy. (Minimum: 1)", Default = 5)]
        public int SampleStep { get; set; }

        [Option('i', "iterations", HelpText = "The maximum number of iterations for the k-means algorithm. Higher numbers increase accuracy, but decrease performance. (Minimum: 1)", Default = 10)]
        public int MaxIterations { get; set; }

        [Option("show-colors", HelpText = "Show colors in the terminal.", Default = false)]
        public bool ShowColors { get; set; }
    }

    private static ImageLoader? _imageLoader;

    public static async Task Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Console(restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information)
            .WriteTo.File("iris-cli_.log",
                rollingInterval: RollingInterval.Day,
                rollOnFileSizeLimit: true,
                fileSizeLimitBytes: 30L * 1024 * 1024)
            .CreateLogger();

        Log.Debug("Iris CLI");

        Log.Debug("Initializing Logger Factory...");
        var loggerFactory = new SerilogLoggerFactory(Log.Logger);

        Log.Debug("Parsing arguments...");
        var parserResult = Parser.Default.ParseArguments<Options>(args);

        Log.Debug("Initializing Image Loader...");
        _imageLoader = new ImageLoader(loggerFactory.CreateLogger<ImageLoader>(), useLocalFileSystem: true);

        try
        {
            Log.Debug("Validating options...");
            ValidateOptions(parserResult.Value);
        }
        catch (IllegalOptionException ex)
        {
            Log.Error(ex, "Error validating options. One or more options are invalid");
            var helpText = HelpText.AutoBuild(parserResult, h => h, e => e);
            helpText.AddErrors(ex.Errors);
            Console.WriteLine(helpText);
            Environment.Exit(ex.ExitCode);
        }

        Log.Debug("Generating palette...");
        await parserResult.WithParsedAsync(GeneratePaletteAsync);

        await Log.CloseAndFlushAsync();
    }

    private static void ValidateOptions(Options? options)
    {
        var errors = new List<string>();

        if (options is null)
            return;

        if (string.IsNullOrWhiteSpace(options.Path))
            errors.Add("  Path must not be empty.");

        if (options.NumColors < 1)
            errors.Add("  The color count must be 1 or higher.");

        if (options.SampleStep < 1)
            errors.Add("  The sample step must be 1 or higher.");

        if (options.MaxIterations < 1)
            errors.Add("  The number of iterations must be 1 or higher.");

        if (errors.Count > 0)
            throw new IllegalOptionException(400, errors);
    }

    private static async Task GeneratePaletteAsync(Options options)
    {
        var imagePath = new Uri(options.Path!, UriKind.RelativeOrAbsolute);
        var numColors = options.NumColors;
        var sampleStep = options.SampleStep;
        var maxIterations = options.MaxIterations;

        if (_imageLoader is null)
        {
            Log.Fatal("Image loader is null, can not proceed...");
            Environment.Exit(500);
        }

        using var image = await _imageLoader.LoadAsync(imagePath);

        if (image is null) return;

        var pixels = new List<int[]>();

        for (int y = 0; y < image.Height; y += sampleStep)
        {
            for (int x = 0; x < image.Width; x += sampleStep)
            {
                var pixel = image[x, y];
                pixels.Add([pixel.R, pixel.G, pixel.B]);
            }
        }

        var palette = KMeans.CalculateCentroids(numColors, pixels, maxIterations);

        Log.Debug("Generated palette:");
        foreach (var c in palette)
        {
            if (options.ShowColors)
                Console.Write($"\x1b[38;2;{c[0]};{c[1]};{c[2]}m");

            Log.Debug("#{red}{green}{blue}", $"{c[0]:x2}", $"{c[1]:x2}", $"{c[2]:x2}");
            Console.Write($"#{c[0]:x2}{c[1]:x2}{c[2]:x2}");

            if (options.ShowColors)
                Console.Write("\x1b[0m");

            Console.WriteLine();
        }
    }
}
