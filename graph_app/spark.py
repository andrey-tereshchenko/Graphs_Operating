from pyspark import SparkContext
from pyspark.sql import SQLContext
from graphframes import *


# PageRankResults = g.pageRank(resetProbability=0.15, tol=0.01)
# PageRankResults.vertices.sort(['pagerank'], ascending=[0]).show

def create_graph(v, e):
    sc = SparkContext()
    sqlContext = SQLContext(sc)
    v = sqlContext.createDataFrame(v, ["id", "name"])

    e = sqlContext.createDataFrame(e, ["src", "dst", "relationship"])

    g = GraphFrame(v, e)
    return g


def page_rank(graph):
    result = graph.pageRank(resetProbability=0.15, tol=0.01)
    return result


def label_propagation(graph):
    result = graph.labelPropagation(10)
    return result


vertex = [("A", "A"), ("B", "B"), ("C", "C"), ("D", "D")]
edges = [("A", "B", 10), ("A", "C", 5), ("D", "C", 6), ("B", "D", 2)]
graph = create_graph(vertex, edges)
res = graph.vertices.collect()
for i in res:
    print(i.name)
# result = graph.pageRank(resetProbability=0.15, tol=0.01
# print(result.vertices._dict())
