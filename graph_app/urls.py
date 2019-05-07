from django.urls import path
from graph_app import views

urlpatterns = [
    path('', views.index),
    path('operate/', views.GraphView.as_view()),
]
