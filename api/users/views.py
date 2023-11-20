from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
# from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import UserSerializer, TaskSerializer
from .models import User, Task
# import jwt, datetime

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

# class AuthenticateView(APIView):
#     """
#         View to authenticate in the Application
#     """
#     def post(self, request):
#         email = request.data['email']
#         password = request.data['password']

#         user = User.objects.filter(email=email).first()
#         if user is None: raise AuthenticationFailed('User not found! (Usuário não encontrado!)')

#         if not user.check_password(password):
#             raise AuthenticationFailed('Incorrect password! (Senha incorreta!)')
        
#         payload = {
#             'id': user.id,
#             'nbf': datetime.datetime.utcnow() + datetime.timedelta(minutes=-5),
#             'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
#             'iat': datetime.datetime.utcnow()
#         }

#         token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

#         response = Response()
#         response.set_cookie(key='jwt_token', value=token, httponly=True)
#         response.data = {
#             'jwt_token': token
#         }

#         return response

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