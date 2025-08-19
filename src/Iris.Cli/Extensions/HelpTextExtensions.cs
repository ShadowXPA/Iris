using CommandLine.Text;

namespace Iris.Cli.Extensions;

public static class HelpTextExtensions
{
    public static HelpText AddErrors(this HelpText helpText, IEnumerable<string> errors)
    {
        helpText.AddPreOptionsLine("\nERROR(S):");
        helpText.AddPreOptionsLines(errors);
        return helpText;
    }
}
