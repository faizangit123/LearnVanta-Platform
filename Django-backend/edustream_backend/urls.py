from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


# Health check endpoint (Render / monitoring)
def health_check(request):
    return JsonResponse({"status": "ok"})


urlpatterns = [
    # Django admin (internal only)
    path("admin/", admin.site.urls),

    # Health check
    path("api/health/", health_check),

    # API v1 (PUBLIC CONTRACT)
    path("api/v1/auth/", include("accounts.urls")),
    path("api/v1/user/", include("userdata.urls")),
    path("api/v1/content/", include("content.urls")),
    path("api/v1/resources/", include("resources.urls")),
    path("api/v1/activities/", include("activities.urls")),
]

# Media files (local dev only)
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
