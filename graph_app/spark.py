from pyspark import SparkContext
from pyspark.sql import SQLContext
from graphframes import *


# sc.setCheckpointDir("/tmp/graphframes-example-connected-components")
# result = g.stronglyConnectedComponents(3)
# result.show()
# PageRankResults = g.pageRank(resetProbability=0.15, tol=0.01)
# PageRankResults.vertices.sort(['pagerank'], ascending=[0]).show

def create_graph(v, e):
    sc = SparkContext()
    sqlContext = SQLContext(sc)
    v = sqlContext.createDataFrame(v, ["id", "name"])

    e = sqlContext.createDataFrame(e, ["src", "dst", "relationship"])

    g = GraphFrame(v, e)
    return g


vertex = [("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")]
edges = [("A", "B", 10), ("A", "C", 5), ("D", "C", 6), ("B", "D", 2)]
graph = create_graph(vertex, edges)
result = graph.pageRank(resetProbability=0.15, tol=0.01)
result.vertices.sort(['pagerank'], ascending=[0]).show()
