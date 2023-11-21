from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, TaskSerializer
from .models import User, Task

class RegisterView(APIView):
    """
        View to register the users
    """
    permission_classes = (AllowAny, )

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'user': serializer.data,
            'msg': 'User successfully registered! (Usuário cadastrado com sucesso!)'
        })

class ListView(APIView):
    """
        View to list the users
    """
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)

        return Response({
            'data': serializer.data
        })

class TaskListView(APIView):
    """
        View to list the user tasks
    """
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)

        return Response({
            'data': serializer.data
        })

class TaskCreateView(APIView):
    """
        View to register the user tasks
    """
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        serializer = TaskSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'task': serializer.data,
            'msg': 'Task successfully registered! (Tarefa cadastrada com sucesso!)'
        })

class TaskReadView(APIView):
    """
        View to read a user task
    """
    permission_classes = (IsAuthenticated, )

    def get(self, request, task_id):
        if not task_id: raise ParseError('Incorrect identifier! (Identificador incorreto!)')

        task = get_object_or_404(Task, id=task_id)
        serializer = TaskSerializer(task)

        return Response({
            'task': serializer.data
        })
    
class TaskUpdateView(APIView):
    """
        View to update a user task
    """
    permission_classes = (IsAuthenticated, )

    def put(self, request, task_id):
        if not task_id: raise ParseError('Incorrect identifier! (Identificador incorreto!)')

        task = get_object_or_404(Task, id=task_id)

        serializer = TaskSerializer(task, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'task': serializer.data,
                'msg': 'Task successfully updated! (Tarefa atualizada com sucesso!)'
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TaskDeleteView(APIView):
    """
        View to list the users
    """
    permission_classes = (IsAuthenticated, )

    def delete(self, request, task_id):
        if not task_id: raise ParseError('Incorrect identifier! (Identificador incorreto!)')

        task = get_object_or_404(Task, id=task_id)
        task.delete()

        return Response({
            'msg': 'Task deleted with success! (Tarefa removida com sucesso!)'
        })