package com.cdweb.springboot.request;

public class OrderItemRequest {
    private long productId;
    private int quantity;
    public long getProductId() {
        return productId;
    }
    public void setProductId(long productId) {
        this.productId = productId;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // Getters and setters
    
}
