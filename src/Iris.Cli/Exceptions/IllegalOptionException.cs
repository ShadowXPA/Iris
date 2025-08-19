namespace Iris.Cli.Exceptions;

public class IllegalOptionException(int exitCode, IEnumerable<string> errors) : Exception()
{
    public int ExitCode { get; init; } = exitCode;
    public IEnumerable<string> Errors { get; init; } = errors;
}
