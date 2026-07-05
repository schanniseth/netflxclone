from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["name", "user", "avatar_color", "is_kids", "created_at"]
    list_filter = ["is_kids", "avatar_color"]
    search_fields = ["name", "user__username", "user__email"]
