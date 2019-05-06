from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.views import APIView


def index(request):
    return render(request, 'index.html')


class GraphView(APIView):
    def get(self, request):
        return render(request, 'index.html')

    def post(self, request):
        my_data = request.data
        print(my_data)
        return HttpResponse("Good!")
