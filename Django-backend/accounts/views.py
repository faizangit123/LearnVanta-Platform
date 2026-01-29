from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.utils import timezone
from datetime import timedelta
import secrets

from .models import UserRole, EmailVerificationToken, PasswordResetToken
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    PasswordResetSerializer, PasswordResetConfirmSerializer, ProfileUpdateSerializer
)
from activities.models import ActivityLog

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = authenticate(
        email=serializer.validated_data['email'],
        password=serializer.validated_data['password']
    )
    
    if not user:
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Allow staff/admin users to login without email verification
    if not user.email_verified and not user.is_staff:
        return Response(
            {'detail': 'Please verify your email before signing in.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token, _ = Token.objects.get_or_create(user=user)
    
    # Log activity
    ActivityLog.objects.create(
        type=ActivityLog.ActivityType.USER_LOGIN,
        details={'user_id': str(user.id), 'user_email': user.email}
    )
    
    return Response({
        'token': token.key,
        'user': UserSerializer(user).data
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    
    # Create verification token
    token = secrets.token_urlsafe(32)
    EmailVerificationToken.objects.create(
        user=user,
        token=token,
        expires_at=timezone.now() + timedelta(hours=24)
    )
    
    # TODO: Send verification email
    # For development, print the verification link
    #------------------------------------------------------------------------------
    # from django.conf import settings                     #mock
    # frontend_url = settings.FRONTEND_URL
    # print(f"Verification URL: {frontend_url}/verify-email?token={token}")
    
    from django.core.mail import send_mail             # real
    from django.conf import settings
    frontend_url = settings.FRONTEND_URL
    verification_url = f"{frontend_url}/verify-email?token={token}"
    send_mail(
        subject="Verify your LearnVanta account",
        message=f"Click the link below to verify your account:\n\n{verification_url}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False
        )
    #-----------------------------------------------------------------------------

    
    # Log activity
    ActivityLog.objects.create(
        type=ActivityLog.ActivityType.USER_REGISTERED,
        details={'user_id': str(user.id), 'user_email': user.email}
    )
    
    return Response({
        'user': UserSerializer(user).data,
        'message': 'Please check your email to verify your account.'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_view(request):
    token = request.data.get('token')
    
    try:
        verification = EmailVerificationToken.objects.get(token=token, used=False)
    except EmailVerificationToken.DoesNotExist:
        return Response({'detail': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    
    if verification.expires_at < timezone.now():
        return Response({'detail': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    verification.user.email_verified = True
    verification.user.save()
    verification.used = True
    verification.save()
    
    return Response({'success': True})


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification_view(request):
    email = request.data.get('email')
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if user.email_verified:
        return Response({'detail': 'Email already verified'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Invalidate old tokens
    EmailVerificationToken.objects.filter(user=user, used=False).update(used=True)
    
    # Create new token
    token = secrets.token_urlsafe(32)
    EmailVerificationToken.objects.create(
        user=user,
        token=token,
        expires_at=timezone.now() + timedelta(hours=24)
    )
    
    #--------------------------------------------------------------------
    # from django.conf import settings        // mock 
    # frontend_url = settings.FRONTEND_URL 
    # print(f"Verification URL: {frontend_url}/verify-email?token={token}")
    
    from django.core.mail import send_mail
    from django.conf import settings
    
    frontend_url = settings.FRONTEND_URL
    verification_url = f"{frontend_url}/verify-email?token={token}"
    send_mail(
        subject="Verify your LearnVanta account",
        message=f"Click the link below to verify your account:\n\n{verification_url}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False,
        )
    return Response({'message': 'Verification email sent'})
#-------------------------------------------------------------------------
    


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_view(request):
    serializer = PasswordResetSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    try:
        user = User.objects.get(email=serializer.validated_data['email'])
    except User.DoesNotExist:
        # Don't reveal if user exists
        return Response({'message': 'If the email exists, a reset link has been sent'})
    
    # Create reset token
    token = secrets.token_urlsafe(32)
    PasswordResetToken.objects.create(
        user=user,
        token=token,
        expires_at=timezone.now() + timedelta(hours=1)
    )
    #---------------------------------------------------------------------------------
    # from django.conf import settings         #mock
    # frontend_url = settings.FRONTEND_URL
    # print(f"Password Reset URL: {frontend_url}/reset-password?token={token}")
    
    from django.core.mail import send_mail     #real
    from django.conf import settings
    
    frontend_url = settings.FRONTEND_URL
    reset_url = f"{frontend_url}/reset-password?token={token}"
    send_mail(
        subject="Reset your LearnVanta password",
        message=f"Click the link below to reset your password:\n\n{reset_url}",
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False,
        )

    #-------------------------------------------------------------------------------
    return Response({'message': 'If the email exists, a reset link has been sent'})


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_view(request):
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    try:
        reset_token = PasswordResetToken.objects.get(
            token=serializer.validated_data['token'],
            used=False
        )
    except PasswordResetToken.DoesNotExist:
        return Response({'detail': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
    
    if reset_token.expires_at < timezone.now():
        return Response({'detail': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = reset_token.user
    user.set_password(serializer.validated_data['password'])
    user.save()
    
    reset_token.used = True
    reset_token.save()
    
    return Response({'success': True})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    request.user.auth_token.delete()
    return Response({'success': True})


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = ProfileUpdateSerializer(
            instance=request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        # Log activity
        ActivityLog.objects.create(
            type=ActivityLog.ActivityType.PROFILE_UPDATED,
            details={'user_id': str(request.user.id), 'user_email': request.user.email}
        )
        
        return Response(UserSerializer(request.user).data)
