from django.urls import path

from .views import (
    RegisterView,
    ListView,
    TaskListView,
    TaskCreateView,
    TaskReadView,
    TaskUpdateView,
    TaskDeleteView
)

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('list', ListView.as_view()),
    path('tasks/list', TaskListView.as_view()),
    path('tasks/create', TaskCreateView.as_view()),
    path('tasks/read/<int:task_id>', TaskReadView.as_view()),
    path('tasks/update/<int:task_id>', TaskUpdateView.as_view()),
    path('tasks/delete/<int:task_id>', TaskDeleteView.as_view())
]