from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String, nullable=False)
    description = Column(Text)
    base_price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String)
    is_available = Column(Boolean, default=True)
    stock_quantity = Column(Integer, default=0)

    category = relationship("Category", back_populates="products")
    sizes = relationship("ProductSize", back_populates="product", cascade="all, delete-orphan")
    product_add_ons = relationship("ProductAddOn", back_populates="product", cascade="all, delete-orphan")
    add_ons = relationship("AddOn", secondary="product_add_ons", back_populates="products")
    order_items = relationship("OrderItem", back_populates="product")

class ProductSize(Base):
    __tablename__ = "product_sizes"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    size_name = Column(String, nullable=False)  # "Small", "Medium"
    price_adjustment = Column(Numeric(10, 2), default=0.00)

    product = relationship("Product", back_populates="sizes")


class AddOn(Base):
    __tablename__ = "add_ons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    category = Column(String, nullable=False)  # Condiment, Topping, Milk Alternative
    price_adjustment = Column(Numeric(10, 2), nullable=False)
    is_available = Column(Boolean, default=True)

    product_links = relationship("ProductAddOn", back_populates="add_on", cascade="all, delete-orphan")
    products = relationship("Product", secondary="product_add_ons", back_populates="add_ons")


class ProductAddOn(Base):
    __tablename__ = "product_add_ons"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    add_on_id = Column(Integer, ForeignKey("add_ons.id"), nullable=False)

    __table_args__ = (
        UniqueConstraint("product_id", "add_on_id", name="uq_product_add_on"),
    )

    product = relationship("Product", back_populates="product_add_ons")
    add_on = relationship("AddOn", back_populates="product_links")
