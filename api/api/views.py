from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import UserSerializer

class MeView(APIView):
    """
        View to get the authenticated user
    """
    permission_classes = (IsAuthenticated, )

    def get(self, request):
        serializer = UserSerializer(request.user)

        return Response(serializer.data)

class LogoutView(APIView):
    """
        View to logout the authenticated user
    """
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({
                'message': 'User successfully logged out! (Usuário deslogado com sucesso!)'
            }, status=status.HTTP_205_RESET_CONTENT)

        except Exception as e:
            return Response({ 'error': str(e) }, status=status.HTTP_400_BAD_REQUEST)