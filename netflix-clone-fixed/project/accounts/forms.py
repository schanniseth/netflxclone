from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

from .models import AVATAR_CHOICES, Profile

User = get_user_model()


class SignUpForm(UserCreationForm):
    """Registration form. We use the email address as the username the
    person actually types in, but Django's User model still needs a
    'username' internally, so we copy the email into it."""

    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={"class": "signin-input", "placeholder": "Email or mobile number"}),
    )

    class Meta:
        model = User
        fields = ["email", "password1", "password2"]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["password1"].widget.attrs.update(
            {"class": "signin-input", "placeholder": "Password"}
        )
        self.fields["password2"].widget.attrs.update(
            {"class": "signin-input", "placeholder": "Confirm password"}
        )
        # Django's default help text is verbose; we keep the form visually clean.
        for field in self.fields.values():
            field.help_text = None

    def clean_email(self):
        email = self.cleaned_data["email"].lower().strip()
        if User.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("An account with this email already exists.")
        return email

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        user.username = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class EmailLoginForm(forms.Form):
    """Sign-in form that authenticates by email + password instead of Django's
    default username field, to match the Netflix-style sign-in card."""

    email = forms.CharField(
        widget=forms.TextInput(attrs={"class": "signin-input", "placeholder": "Email or mobile number"})
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "signin-input", "placeholder": "Password"})
    )


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ["name", "avatar_color", "is_kids"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "profile-name-input", "placeholder": "Name", "maxlength": 20}),
            "avatar_color": forms.RadioSelect,
        }