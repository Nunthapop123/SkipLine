from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, Token
from app.core.security import get_password_hash, verify_password, create_access_token

class AuthenticationService:
    """Service for handling authentication operations."""

    @staticmethod
    def register_user(user_in: UserCreate, db: Session) -> UserResponse:
        """
        Register a new user.

        Args:
            user_in: User registration data (name, email, password)
            db: Database session

        Returns:
            UserResponse: The newly created user

        Raises:
            HTTPException: If email already registered
        """
        # Check if user already exists
        user_exists = db.query(User).filter(User.email == user_in.email).first()
        if user_exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create the user and insert into DB
        new_user = User(
            name=user_in.name,
            email=user_in.email,
            phone=user_in.phone,
            password_hash=get_password_hash(user_in.password),
            # Role natively defaults to CUSTOMER based on the Model
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return new_user

    @staticmethod
    def login_user(user_in: UserLogin, db: Session) -> Token:
        """
        Authenticate a user and return a JWT token.

        Args:
            user_in: User login credentials (email, password)
            db: Database session

        Returns:
            Token: Access token and token type

        Raises:
            HTTPException: If credentials are invalid
        """
        # Find matching email
        user = db.query(User).filter(User.email == user_in.email).first()

        # Reject if no user or password doesn't match
        if not user or not verify_password(user_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Issue a JWT Token with user ID inside the payload "sub"
        access_token = create_access_token(data={
            "sub": str(user.id),
            "role": user.role.value
        })

        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": UserResponse.model_validate(user)
        }

    @staticmethod
    def get_current_user(user: User) -> UserResponse:
        """
        Get the current authenticated user.

        Args:
            user: The authenticated user object (injected via dependency)

        Returns:
            UserResponse: The current user
        """
        return user
