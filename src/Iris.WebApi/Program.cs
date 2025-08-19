using Iris.Core;
using Iris.WebApi.Services;
using Serilog;
using Serilog.Extensions.Logging;

namespace Iris.WebApi;

public class Program
{
    public static void Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Console(restrictedToMinimumLevel: Serilog.Events.LogEventLevel.Information)
            .WriteTo.File("iris-webapi_.log",
                rollingInterval: RollingInterval.Day,
                rollOnFileSizeLimit: true,
                fileSizeLimitBytes: 30L * 1024 * 1024)
            .CreateLogger();

        Log.Information("Iris Web API");

        Log.Information("Initializing services...");
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers();
        builder.Services.AddAuthorization();
        builder.Services.AddSerilog(Log.Logger);
        builder.Services.AddSingleton<ImageLoader>();
        builder.Services.AddSingleton<PaletteService>();
        Log.Information("Services initialized");

        Log.Information("Configuring application...");
        var app = builder.Build();

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.MapControllers();
        Log.Information("Application configured");

        Log.Information("Running application...");
        app.Run();
        Log.Information("Exiting application...");
        Log.CloseAndFlush();
    }
}
