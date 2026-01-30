from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


# Health check endpoint (for Render / monitoring)
def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Health check
    path("api/health/", health_check),

    # Auth APIs
    path("api/v1/auth/", include("accounts.urls")),
    path('api/v1/user/', include('userdata.urls')),
    path("api/v1/content/", include("content.urls")),
    path("api/v1/resources/", include("resources.urls")),
    path("api/v1/activities/", include("activities.urls")),
    
    # Auth APIs (allauth: email verification + social login)
    # path("api/v1/auth/", include("allauth.urls")),
    
]

# Media files (local development only)
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
