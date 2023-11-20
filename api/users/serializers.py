from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import User, Task

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password']

        # Configure the password to not be returned after creation
        extra_kwargs = {
            'password': { 'write_only': True }
        }

    def create(self, validated_data):
        """
            Receives the request data necessary to create a User, validate it and
            save in the Database
        """

        # Extract the password data
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)

        # Validate and criptograph the password
        if password is not None:
            instance.set_password(password)
        instance.save()

        return instance

class TaskSerializer(ModelSerializer):
    responsible = UserSerializer(read_only=True)

    class Meta:
        model = Task
        fields = ['id', 'responsible_id', 'responsible', 'title', 'description', 'due_date', 'created_at']

        extra_kwargs = {
            'responsible_id': { 'source': 'responsible' },
            'created_at': { 'read_only': True }
        }
