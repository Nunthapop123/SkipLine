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
)
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["Orders"])


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
