from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.order import (
    MarkOrderPaidRequest,
    OrderCreateFromCartRequest,
    OrderQueueEstimateResponse,
    OrderResponse,
    UpdateOrderStatusRequest,
)
from app.models.user import UserRole
from app.models.store import StoreSettings
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=list[OrderResponse])
def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all orders for the current user"""
    return OrderService.get_user_orders(db, user_id=current_user.id)


@router.get("/estimate-from-cart", response_model=OrderQueueEstimateResponse)
def estimate_from_cart(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return OrderService.estimate_from_cart(db, user_id=current_user.id)


@router.post("/from-cart", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order_from_cart(
    payload: OrderCreateFromCartRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check for Busy Mode
    settings = db.query(StoreSettings).first()
    if settings and settings.is_busy_mode_active:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Store is currently in 'Busy Mode'. Please try again in a few minutes."
        )
        
    try:
        return OrderService.create_order_from_cart(
            db,
            user_id=current_user.id,
            payment_method=payload.payment_method,
            guest_name=payload.guest_name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/{order_id}/pay", response_model=OrderResponse)
def mark_order_paid(
    order_id: UUID,
    payload: MarkOrderPaidRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = OrderService.mark_order_paid(
        db,
        order_id=order_id,
        user_id=current_user.id,
        payment_slip_url=payload.payment_slip_url,
    )
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return order


@router.get("/active", response_model=list[OrderResponse])
def get_active_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all active orders for staff"""
    if current_user.role not in [UserRole.STAFF, UserRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    orders = OrderService.get_active_orders(db)
    
    # Debugging: check one order to see if it matches schema
    if orders:
        print(f"DEBUG: Found {len(orders)} active orders")
        for o in orders:
            try:
                # Test validation locally
                OrderResponse.model_validate(o)
            except Exception as e:
                print(f"DEBUG: Validation failed for Order {o.order_number}: {str(e)}")
    else:
        print("DEBUG: No orders found in database")
        
    return orders


@router.patch("/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: UUID,
    payload: UpdateOrderStatusRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update order status for staff"""
    if current_user.role not in [UserRole.STAFF, UserRole.ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    
    order = OrderService.update_order_status(db, order_id=order_id, new_status=payload.status)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    
    return order


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order = OrderService.get_order_by_id(db, order_id=order_id, user_id=current_user.id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    return order
