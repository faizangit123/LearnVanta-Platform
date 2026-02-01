from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserRole

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'email_verified', 'avatar', 'role','is_admin', 'created_at']
        read_only_fields = ['id', 'email_verified', 'created_at']

    def get_role(self, obj):
        role = UserRole.objects.filter(user=obj).first()
        return role.role if role else 'user'
    
    def get_is_admin(self, obj):
        return obj.is_staff or obj.is_superuser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'password']

    def create(self, validated_data):
        name = validated_data.pop('name')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],
            first_name=name,
            password=validated_data['password']
        )
        # Create default user role
        UserRole.objects.create(user=user, role=UserRole.RoleChoices.USER)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(required=True, validators=[validate_password])


class ProfileUpdateSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='first_name', required=False)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(write_only=True, required=False, validators=[validate_password])

    class Meta:
        model = User
        fields = ['name', 'avatar', 'current_password', 'new_password']

    def validate(self, attrs):
        if attrs.get('new_password') and not attrs.get('current_password'):
            raise serializers.ValidationError({'current_password': 'Current password is required to set new password'})
        return attrs

    def update(self, instance, validated_data):
        if validated_data.get('new_password'):
            if not instance.check_password(validated_data['current_password']):
                raise serializers.ValidationError({'current_password': 'Current password is incorrect'})
            instance.set_password(validated_data['new_password'])
        
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        
        instance.save()
        return instance
