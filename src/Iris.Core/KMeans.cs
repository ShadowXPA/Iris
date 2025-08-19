namespace Iris.Core;

public static class KMeans
{
    public static List<int[]> CalculateCentroids(int k, List<int[]> points, int maxIterations = 10)
    {
        var centroids = points.Shuffle().Take(k).ToList();

        for (int it = 0; it < maxIterations; it++)
        {
            var clusters = new List<List<int[]>>();
            for (int i = 0; i < k; i++) clusters.Add([]);

            foreach (var point in points)
            {
                var bestDistance = double.MaxValue;
                var bestIndex = 0;

                for (int i = 0; i < k; i++)
                {
                    var centroid = centroids[i];
                    var distance = Math.Pow(point[0] - centroid[0], 2) + Math.Pow(point[1] - centroid[1], 2) + Math.Pow(point[2] - centroid[2], 2);
                    if (distance < bestDistance)
                    {
                        bestDistance = distance;
                        bestIndex = i;
                    }
                }

                clusters[bestIndex].Add(point);
            }

            for (int i = 0; i < k; i++)
            {
                if (clusters[i].Count == 0) continue;
                int r = clusters[i].Sum(p => p[0]);
                int g = clusters[i].Sum(p => p[1]);
                int b = clusters[i].Sum(p => p[2]);
                int size = clusters[i].Count;
                centroids[i] = [r / size, g / size, b / size];
            }
        }

        return centroids;
    }
}
