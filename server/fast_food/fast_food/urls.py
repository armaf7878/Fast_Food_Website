from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/accounts/', include('accounts.urls')),
    path('api/catalog/', include('catalog.urls')),
    path('api/ordering/', include('ordering.urls')),
    path('api/tracking/', include('tracking.urls')),
    path('api/feedback/', include('feedback.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/foods/', include('foods.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/voucher/', include('voucher.urls')),
    path('api/chatbot/', include('chatbot.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
