"""
Enhanced Authentication router with email verification and password reset
"""

from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import os

from app.database import get_db
from app.models import User, UserRole, UserVerification
from app.schemas import (
    UserCreate, UserResponse, Token, LoginRequest,
    EmailVerificationRequest, EmailVerificationResponse,
    VerifyEmailRequest, PasswordResetRequest, PasswordResetConfirm,
    PasswordResetResponse, UserUpdate
)
from app.auth import (
    verify_password, get_password_hash, create_access_token, 
    authenticate_user, get_current_active_user, ACCESS_TOKEN_EXPIRE_MINUTES
)
from app.email_service import email_service

router = APIRouter()

@router.post("/register", response_model=EmailVerificationResponse)
async def register(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    """Register a new user with email verification"""
    try:
        # Check if user already exists
        existing_email = db.query(User).filter(User.email == user.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        existing_username = db.query(User).filter(User.username == user.username).first()
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user (automatically active and verified - email verification disabled)
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            phone=user.phone,
            preferred_language=user.preferred_language,
            hashed_password=hashed_password,
            role=UserRole.USER,
            is_active=True,   # Automatically active - no email verification required
            is_verified=True  # Automatically verified - no email verification required
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except HTTPException:
        # Re-raise HTTP exceptions (like 400 Bad Request)
        raise
    except Exception as e:
        # Log and handle unexpected errors
        import traceback
        import sys
        print(f"❌ Registration error: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed. Please try again later. Error: {str(e)}"
        )
    
    # EMAIL VERIFICATION DISABLED - COMMENTED OUT FOR FUTURE USE
    # Generate verification token
    # verification_token = email_service.generate_verification_token()
    # expires_at = datetime.utcnow() + timedelta(hours=24)
    
    # Store verification token
    # db_verification = UserVerification(
    #     user_id=db_user.id,
    #     token=verification_token,
    #     token_type="email_verification",
    #     expires_at=expires_at
    # )
    
    # db.add(db_verification)
    # db.commit()
    
    # Get frontend URL from request
    # frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Send verification email
    # email_sent = email_service.send_verification_email(db_user, verification_token, frontend_url)
    
    return EmailVerificationResponse(
        message="Registration successful! You can now login with your credentials.",
        email_sent=False
    )

@router.post("/verify-email", response_model=dict)
async def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    """Verify user email with token"""
    # Find verification token
    verification = db.query(UserVerification).filter(
        UserVerification.token == request.token,
        UserVerification.token_type == "email_verification",
        UserVerification.is_used == False,
        UserVerification.expires_at > datetime.utcnow()
    ).first()
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )
    
    # Get user and activate account
    user = db.query(User).filter(User.id == verification.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Activate user account
    user.is_active = True
    user.is_verified = True
    
    # Mark token as used
    verification.is_used = True
    
    db.commit()
    
    # Send welcome email
    email_service.send_welcome_email(user)
    
    return {"message": "Email verified successfully! Your account is now active."}

@router.post("/resend-verification", response_model=EmailVerificationResponse)
async def resend_verification(request: EmailVerificationRequest, request_obj: Request, db: Session = Depends(get_db)):
    """Resend verification email"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified"
        )
    
    # Generate new verification token
    verification_token = email_service.generate_verification_token()
    expires_at = datetime.utcnow() + timedelta(hours=24)
    
    # Store new verification token
    db_verification = UserVerification(
        user_id=user.id,
        token=verification_token,
        token_type="email_verification",
        expires_at=expires_at
    )
    
    db.add(db_verification)
    db.commit()
    
    # Get frontend URL from request
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Send verification email
    email_sent = email_service.send_verification_email(user, verification_token, frontend_url)
    
    return EmailVerificationResponse(
        message="Verification email sent! Please check your inbox.",
        email_sent=email_sent
    )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Login and get access token"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if email is verified - COMMENTED OUT FOR NOW
    # if not user.is_verified:
    #     raise HTTPException(
    #         status_code=status.HTTP_403_FORBIDDEN,
    #         detail="Please verify your email address before logging in"
    #     )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": UserResponse.from_orm(user)
    }

@router.post("/forgot-password", response_model=PasswordResetResponse)
async def forgot_password(request: PasswordResetRequest, request_obj: Request, db: Session = Depends(get_db)):
    """Request password reset"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Don't reveal if email exists or not for security
        return PasswordResetResponse(
            message="If the email exists, a password reset link has been sent.",
            email_sent=True
        )
    
    # Generate password reset token
    reset_token = email_service.generate_verification_token()
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    # Store reset token
    db_reset = UserVerification(
        user_id=user.id,
        token=reset_token,
        token_type="password_reset",
        expires_at=expires_at
    )
    
    db.add(db_reset)
    db.commit()
    
    # Get frontend URL from request
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Send password reset email
    email_sent = email_service.send_password_reset_email(user, reset_token, frontend_url)
    
    return PasswordResetResponse(
        message="If the email exists, a password reset link has been sent.",
        email_sent=email_sent
    )

@router.post("/reset-password", response_model=dict)
async def reset_password(request: PasswordResetConfirm, db: Session = Depends(get_db)):
    """Reset password with token"""
    # Find reset token
    reset_verification = db.query(UserVerification).filter(
        UserVerification.token == request.token,
        UserVerification.token_type == "password_reset",
        UserVerification.is_used == False,
        UserVerification.expires_at > datetime.utcnow()
    ).first()
    
    if not reset_verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token"
        )
    
    # Get user and update password
    user = db.query(User).filter(User.id == reset_verification.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.hashed_password = get_password_hash(request.new_password)
    
    # Mark token as used
    reset_verification.is_used = True
    
    db.commit()
    
    return {"message": "Password reset successfully!"}

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=UserResponse)
async def update_user_me(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user profile information"""
    update_data = user_update.dict(exclude_unset=True)

    # Check for username uniqueness if username is being updated
    if update_data.get("username") and update_data["username"] != current_user.username:
        if db.query(User).filter(User.username == update_data["username"]).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )

    # Check for email uniqueness if email is being updated
    if update_data.get("email") and update_data["email"] != current_user.email:
        if db.query(User).filter(User.email == update_data["email"]).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

    # Update allowed fields
    allowed_fields = {"email", "username", "full_name", "phone", "preferred_language"}
    for field, value in update_data.items():
        if field in allowed_fields:
            setattr(current_user, field, value)

    current_user.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/change-password")
async def change_password(
    password_data: dict,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change current user's password"""
    current_password = password_data.get("current_password")
    new_password = password_data.get("new_password")
    confirm_password = password_data.get("confirm_password")

    if not current_password or not new_password or not confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All password fields are required"
        )

    if new_password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords don't match"
        )

    if len(new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    # Verify current password
    if not verify_password(current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    # Update password
    current_user.hashed_password = get_password_hash(new_password)
    current_user.updated_at = datetime.utcnow()
    db.commit()

    return {"message": "Password changed successfully"}

@router.post("/register-admin", response_model=UserResponse)
async def register_admin(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new admin user (for initial setup only)"""
    # Check if any admin already exists
    existing_admin = db.query(User).filter(User.role == UserRole.ADMIN).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user already exists"
        )
    
    # Check if user already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new admin user (automatically verified and active)
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        phone=user.phone,
        preferred_language=user.preferred_language,
        hashed_password=hashed_password,
        role=UserRole.ADMIN,
        is_active=True,
        is_verified=True  # Admin is automatically verified
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user