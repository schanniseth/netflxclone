from django.conf import settings
from django.db import models

AVATAR_CHOICES = [
    ("red", "Red"),
    ("blue", "Blue"),
    ("green", "Green"),
    ("purple", "Purple"),
    ("orange", "Orange"),
    ("kids", "Kids"),
]


class Profile(models.Model):
    """A Netflix-style viewing profile that belongs to a user account.
    One User (the account) can have several Profiles (the people who watch)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profiles"
    )
    name = models.CharField(max_length=50)
    avatar_color = models.CharField(max_length=20, choices=AVATAR_CHOICES, default="red")
    is_kids = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.name} ({self.user.username})"

    @property
    def initial(self):
        return (self.name or "?")[0].upper()
