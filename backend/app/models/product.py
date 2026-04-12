from sqlalchemy import Column, Integer, String, Text, Numeric, Boolean, ForeignKey
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

    category = relationship("Category", back_populates="products")
    sizes = relationship("ProductSize", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItem", back_populates="product")

class ProductSize(Base):
    __tablename__ = "product_sizes"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    size_name = Column(String, nullable=False)  # "Small", "Medium"
    price_adjustment = Column(Numeric(10, 2), default=0.00)

    product = relationship("Product", back_populates="sizes")
