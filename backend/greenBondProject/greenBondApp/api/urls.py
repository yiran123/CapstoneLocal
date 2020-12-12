from django.urls import path

from .views import ProjectDetailView, ProjectListView, BondListView, BondDetailView, create_data, delete_data


urlpatterns = [
    path('project', ProjectListView.as_view()),
    path('project/<pk>', ProjectDetailView.as_view()),
    path('bond', BondListView.as_view()),
    path('bond/<pk>', BondDetailView.as_view()),
    path('create', create_data),
    path('delete', delete_data)
]
