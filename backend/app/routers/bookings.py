"""
Bookings router for appointment management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.database import get_db
from app.models import Booking, Service, User, BookingStatus
from app.schemas import BookingCreate, BookingUpdate, BookingResponse
from app.auth import get_current_active_user, get_admin_or_editor_user
from app.email_service import email_service

router = APIRouter()

@router.get("/", response_model=List[BookingResponse])
async def get_bookings(
    skip: int = 0,
    limit: int = 100,
    status: Optional[BookingStatus] = None,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Get all bookings (Admin/Editor only)"""
    query = db.query(Booking)
    
    if status:
        query = query.filter(Booking.status == status)
    
    bookings = query.offset(skip).limit(limit).all()
    return bookings

@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's bookings"""
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    return bookings

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get a specific booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check if user can access this booking
    if current_user.role not in ["admin", "editor"] and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return booking

@router.post("/", response_model=BookingResponse)
async def create_booking(
    booking: BookingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new booking"""
    try:
        # Verify service exists
        service = db.query(Service).filter(Service.id == booking.service_id).first()
        if not service:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Service not found"
            )
        
        # Check if booking date is in the future (handle both naive and timezone-aware datetimes)
        booking_dt = booking.booking_date
        if booking_dt.tzinfo is None:
            # If naive datetime, assume UTC
            booking_dt = booking_dt.replace(tzinfo=timezone.utc)
        
        current_dt = datetime.now(timezone.utc)
        
        if booking_dt < current_dt:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Booking date must be in the future"
            )
        
        # Create booking
        db_booking = Booking(
            **booking.dict(),
            user_id=current_user.id,
            status=BookingStatus.PENDING
        )
        
        db.add(db_booking)
        db.commit()
        db.refresh(db_booking)
        
        # Try to send confirmation email (don't fail if email fails)
        try:
            email_service.send_booking_confirmation(db_booking)
        except Exception as email_error:
            # Log email error but don't fail the booking
            import sys
            print(f"⚠️  Email notification failed: {email_error}", file=sys.stderr)
        
        return db_booking
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log and handle unexpected errors
        import traceback
        import sys
        print(f"❌ Booking creation error: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create booking. Please try again. Error: {str(e)}"
        )

@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: int,
    booking_update: BookingUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a booking"""
    try:
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found"
            )
        
        # Check permissions
        if current_user.role not in ["admin", "editor"] and booking.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        
        # Users can only update their own bookings if status is pending
        if current_user.role not in ["admin", "editor"] and booking.status != BookingStatus.PENDING:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot modify confirmed bookings"
            )
        
        update_data = booking_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(booking, field, value)
        
        # Store old status for email notification
        old_status = booking.status.value
        
        db.commit()
        db.refresh(booking)
        
        # Try to send update notification email if status changed (don't fail if email fails)
        if old_status != booking.status.value:
            try:
                email_service.send_booking_update(booking, old_status)
            except Exception as email_error:
                import sys
                print(f"⚠️  Email notification failed: {email_error}", file=sys.stderr)
        
        return booking
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        import sys
        print(f"❌ Booking update error: {str(e)}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update booking. Error: {str(e)}"
        )

@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Cancel a booking"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Check permissions
    if current_user.role not in ["admin", "editor"] and booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    booking.status = BookingStatus.CANCELLED
    db.commit()
    
    # Send cancellation email
    email_service.send_booking_update(booking, "pending")
    
    return {"message": "Booking cancelled successfully"}

@router.post("/{booking_id}/confirm")
async def confirm_booking(
    booking_id: int,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Confirm a booking (Admin/Editor only)"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    booking.status = BookingStatus.CONFIRMED
    db.commit()
    
    # Send confirmation email
    email_service.send_booking_update(booking, "pending")
    
    return {"message": "Booking confirmed successfully"}

@router.put("/{booking_id}/status")
async def update_booking_status(
    booking_id: int,
    status_update: dict,
    current_user: User = Depends(get_admin_or_editor_user),
    db: Session = Depends(get_db)
):
    """Update only the booking status (Admin/Editor only)"""
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )

    new_status = status_update.get("status")
    if new_status is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing 'status' in request body"
        )

    try:
        booking.status = new_status  # FastAPI/SQLAlchemy will validate against Enum
        db.commit()
        db.refresh(booking)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status value"
        )

    # Send update notification email
    email_service.send_booking_update(booking, "pending")

    return {"message": "Booking status updated successfully"}
