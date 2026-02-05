from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import UserRole

User = get_user_model()

# ============================================
# MAIN USER SERIALIZER (USED EVERYWHERE)
# ============================================

class UserSerializer(serializers.ModelSerializer):
    """
    This serializer is used for:
    - login response
    - profile endpoint
    - admin dashboard
    - frontend AuthContext
    """

    # Human readable role from UserRole table
    role = serializers.SerializerMethodField()

    # Real admin flag (used by frontend)
    is_admin = serializers.SerializerMethodField()

    # Frontend expects "name"
    name = serializers.CharField(source="first_name", read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'name',
            'last_name',
            'email_verified',
            'avatar',
            'role',
            'is_admin',
            'created_at'
        ]
        read_only_fields = ['id', 'email_verified', 'created_at']

    def get_role(self, obj):
        """
        Gets role from UserRole table.
        If not found, defaults to 'user'.
        """
        role = UserRole.objects.filter(user=obj).first()
        return role.role if role else 'user'

    def get_is_admin(self, obj):
        """
        Frontend uses this to show admin dashboard.
        """
        return obj.is_staff or obj.is_superuser


# ============================================
# REGISTER SERIALIZER
# ============================================

class RegisterSerializer(serializers.ModelSerializer):
    """
    Used by /auth/register/
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    # Frontend sends "name"
    name = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = ['email', 'name', 'password']

    def create(self, validated_data):
        name = validated_data.pop('name')

        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['email'],   # IMPORTANT: keeps login working
            first_name=name,
            password=validated_data['password']
        )

        # Default role
        UserRole.objects.create(user=user, role=UserRole.RoleChoices.USER)

        return user


# ============================================
# LOGIN SERIALIZER
# ============================================

class LoginSerializer(serializers.Serializer):
    """
    Used by /auth/login/
    """
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


# ============================================
# PASSWORD RESET SERIALIZERS
# ============================================

class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True,
        validators=[validate_password]
    )


# ============================================
# PROFILE UPDATE SERIALIZER
# ============================================

class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Used by /auth/profile/
    """
    name = serializers.CharField(source='first_name', required=False)
    current_password = serializers.CharField(write_only=True, required=False)
    new_password = serializers.CharField(
        write_only=True,
        required=False,
        validators=[validate_password]
    )

    class Meta:
        model = User
        fields = ['name', 'avatar', 'current_password', 'new_password']

    def validate(self, attrs):
        """
        Prevents changing password without old password.
        """
        if attrs.get('new_password') and not attrs.get('current_password'):
            raise serializers.ValidationError({
                'current_password': 'Current password is required to set new password'
            })
        return attrs

    def update(self, instance, validated_data):
        """
        Applies updates safely.
        """
        # Change password
        if validated_data.get('new_password'):
            if not instance.check_password(validated_data['current_password']):
                raise serializers.ValidationError({
                    'current_password': 'Current password is incorrect'
                })
            instance.set_password(validated_data['new_password'])

        # Update name
        if 'first_name' in validated_data:
            instance.first_name = validated_data['first_name']

        # Update avatar
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']

        instance.save()
        return instance
