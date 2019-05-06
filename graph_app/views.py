from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView
import networkx as nx


def index(request):
    return render(request, 'index.html')


class GraphView(APIView):
    def get(self, request):
        return render(request, 'index.html')

    def post(self, request):
        vertex = list()
        edges = list()
        weights = list()
        my_data = request.data
        vertex_count = int(my_data['vertex_counter'])
        edges_count = int(my_data['edges_counter'])
        label_v = 'vertex_name_'
        label_src = 'src_'
        label_dest = 'dest_'
        label_weight = 'weight_'
        for i in range(vertex_count):
            vertex.append(my_data[label_v + str(i)])
        for i in range(edges_count):
            edges.append(
                (my_data[label_src + str(i)], my_data[label_dest + str(i)], int(my_data[label_weight + str(i)])))
            weights.append(my_data[label_weight + str(i)])
        print(vertex)
        print(edges)
        print(weights)
        G = nx.Graph()
        G.add_nodes_from(vertex)
        G.add_weighted_edges_from(edges)
        print(nx.pagerank(G))
        return HttpResponse("Good!")
