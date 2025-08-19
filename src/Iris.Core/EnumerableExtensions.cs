namespace Iris.Core;

public static class EnumerableExtensions
{
    public static IEnumerable<T> Shuffle<T>(this IEnumerable<T> source)
    {
        var buffer = new List<T>(source);

        for (int i = buffer.Count - 1; i >= 0; i--)
        {
            int j = Random.Shared.Next(i + 1);

            yield return buffer[j];

            buffer[j] = buffer[i];
        }
    }
}
