from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin, Token
from app.api.dependencies import get_current_user
from app.services import AuthenticationService

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.

    Args:
        user_in: User registration data (name, email, password)
        db: Database session

    Returns:
        UserResponse: The newly created user
    """
    return AuthenticationService.register_user(user_in, db)


@router.post("/login", response_model=Token)
def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token.

    Args:
        user_in: User login credentials (email, password)
        db: Database session

    Returns:
        Token: Access token and token type
    """
    return AuthenticationService.login_user(user_in, db)


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    """
    Fetch the currently authenticated user based on JWT verification.

    Args:
        current_user: The authenticated user (injected via dependency)

    Returns:
        UserResponse: The current user
    """
    return AuthenticationService.get_current_user(current_user)
