from functools import wraps

from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from .models import Profile


def require_profile(view_func):
    """Ensures the user is logged in AND has picked a viewing profile
    (Netflix's 'Who's watching?' step) before reaching a browsing view."""

    @wraps(view_func)
    @login_required
    def wrapper(request, *args, **kwargs):
        profile_id = request.session.get("profile_id")
        if not profile_id:
            return redirect("profiles")
        try:
            profile = Profile.objects.get(id=profile_id, user=request.user)
        except Profile.DoesNotExist:
            request.session.pop("profile_id", None)
            return redirect("profiles")
        request.profile = profile
        return view_func(request, *args, **kwargs)

    return wrapper
