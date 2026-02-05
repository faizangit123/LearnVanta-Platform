from django.urls import path
from . import views

"""
Authentication & Profile Routes

These endpoints are consumed by:
- authService.js
- AuthContext.jsx
- React protected routes
"""

urlpatterns = [
    # ----------------------------------------
    # AUTH
    # ----------------------------------------
    path('login/', views.login_view, name='login'),                     # POST
    path('register/', views.register_view, name='register'),           # POST
    path('logout/', views.logout_view, name='logout'),                 # POST

    # ----------------------------------------
    # EMAIL VERIFICATION
    # ----------------------------------------
    path('verify-email/', views.verify_email_view, name='verify-email'),           # POST
    path('resend-verification/', views.resend_verification_view, name='resend-verification'),  # POST

    # ----------------------------------------
    # PASSWORD RESET
    # ----------------------------------------
    path('password-reset/', views.password_reset_view, name='password-reset'),            # POST
    path('password-reset/confirm/', views.password_reset_confirm_view, name='password-reset-confirm'),  # POST

    # ----------------------------------------
    # PROFILE (AUTH REQUIRED)
    # ----------------------------------------
    path('profile/', views.ProfileView.as_view(), name='profile'),      # GET / PATCH
]
