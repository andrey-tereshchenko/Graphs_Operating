import codecs
import csv

from django.http import JsonResponse
from django.shortcuts import render
import pandas as pd
import surprise
from rest_framework.views import APIView
import networkx as nx


def index(request):
    return render(request, 'index.html')


def choose_algorithm(algorithm, graph):
    if algorithm == 'page_rank':
        result = nx.pagerank(graph)
        print(result)
        return result
    elif algorithm == 'label_propagation':
        result = list()
        g = nx.algorithms.community.label_propagation_communities(graph)
        for i in g:
            result.append(list(i))
        print(result)
        return result
    elif algorithm == 'triangle_count':
        result = nx.triangles(graph)
        print(result)
        return result
    elif algorithm == 'svd':
        result = svd_algorithm(graph)
        return result


def transform_graph_from_csv(file):
    vertex = list()
    edges = list()
    weights = list()
    csv_file = csv.DictReader(codecs.iterdecode(file, 'utf-8'))
    for rows in csv_file:
        if rows['Vertex'] != '':
            vertex.append(rows['Vertex'])
        if rows['src'] != '' and rows['dst'] != '' and rows['w'] != '':
            edges.append((rows['src'], rows['dst'], int(rows['w'])))
            weights.append(rows['w'])
    return vertex, edges


def transform_graph_to_dataset(graph):
    from_list = list()
    to_list = list()
    weight_list = list()
    for e in graph.edges(data=True):
        from_list.append(e[0])
        to_list.append(e[1])
        weight_list.append(e[2]['weight'])
    data = pd.DataFrame({'from': from_list, 'to': to_list, 'weight': weight_list})
    return data


def svd_algorithm(graph):
    predicted_list = list()
    dataset = transform_graph_to_dataset(graph)
    lower_weight = dataset['weight'].min()
    upper_weight = dataset['weight'].max()
    reader = surprise.Reader(rating_scale=(0, 10))
    data = surprise.Dataset.load_from_df(dataset, reader)
    alg = surprise.SVDpp()
    alg.fit(data.build_full_trainset())
    src_nodes = search_src_nodes(graph)
    dst_nodes = search_dst_nodes(graph)
    for src in src_nodes:
        for dst in dst_nodes:
            if (src, dst) not in graph.edges:
                pred = alg.predict(uid=src, iid=dst)
                predicted_list.append((src, dst, pred.est))
    return predicted_list


def search_src_nodes(graph):
    nodes = set()
    for e in graph.edges:
        nodes.add(e[0])
    return list(nodes)


def search_dst_nodes(graph):
    nodes = set()
    for e in graph.edges:
        nodes.add(e[1])
    return list(nodes)


class GraphView(APIView):
    def get(self, request):
        return render(request, 'index.html')

    def post(self, request):
        vertex = list()
        edges = list()
        weights = list()
        label_v = 'vertex_name_'
        label_src = 'src_'
        label_dest = 'dest_'
        label_weight = 'weight_'
        my_data = request.data
        type_input = my_data['type_input']
        if type_input == 'hand_input':
            print("hand_input")
            vertex_count = int(my_data['vertex_counter'])
            edges_count = int(my_data['edges_counter'])
            for i in range(vertex_count):
                vertex.append(my_data[label_v + str(i)])
            for i in range(edges_count):
                edges.append(
                    (
                        my_data[label_src + str(i)], my_data[label_dest + str(i)],
                        int(my_data[label_weight + str(i)])))
                weights.append(my_data[label_weight + str(i)])
        elif type_input == 'csv_input':
            print("csv_input")
            file = request.FILES['my_file']
            vertex, edges = transform_graph_from_csv(file)

        algorithm = my_data['algorithm']
        print(algorithm)
        G = nx.Graph()
        G.add_nodes_from(vertex)
        G.add_weighted_edges_from(edges)
        result = choose_algorithm(algorithm, G)
        data = dict()
        data['edges'] = edges
        data['result'] = result
        data['vertex'] = vertex
        data['algorithm'] = algorithm
        if algorithm == 'svd':
            data['svd_src'] = search_src_nodes(G)
            data['svd_dst'] = search_dst_nodes(G)
        return JsonResponse(data)
