import React, { useState, useCallback, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Pagination,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    productName: "",
    imageUrl: "",
    description: "",
    price: 0,
    discountedPrice: 0,
    quantity: 0,
    author: "",
    categoryId: "",
  });

  const loadProducts = useCallback(async () => {
    try {
      const response = await productService.getAllProducts({
        page,
        limit: 10,
        category: "",
        minPrice: 0,
        maxPrice: 1000000,
        sort: "asc",
      });
      setProducts(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [page]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await productService.convertImageToBase64(file);
        setFormData((prev) => ({ ...prev, imageUrl: base64 }));
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  const handleOpenForm = useCallback((product = null) => {
    if (product) {
      setFormData(product);
      setSelectedProduct(product);
    } else {
      setFormData({
        productName: "",
        imageUrl: "",
        description: "",
        price: 0,
        discountedPrice: 0,
        quantity: 0,
        author: "",
        categoryId: "",
      });
      setSelectedProduct(null);
    }
    setFormOpen(true);
  }, []);

  const handleSubmit = async () => {
    try {
      if (selectedProduct) {
        await productService.updateProduct(selectedProduct.id, formData);
      } else {
        await productService.createProduct(formData);
      }
      setFormOpen(false);
      loadProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = useCallback((product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    try {
      await productService.deleteProduct(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const modalOverlay = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalContent = {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    maxWidth: "800px",
    width: "90%",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const styles = {
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
    },
    select: {
      width: "100%",
      padding: "8px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      fontSize: "14px",
    },
    buttonGroup: {
      marginTop: "20px",
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
    },
    button: {
      padding: "8px 16px",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontSize: "14px",
    },
    cancelButton: {
      backgroundColor: "#f0f0f0",
      color: "#333",
    },
    submitButton: {
      backgroundColor: "#1976d2",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#dc3545",
      color: "white",
    },
    imagePreview: {
      maxWidth: "200px",
      maxHeight: "200px",
      marginTop: "10px",
    },
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenForm()}
        style={{ marginBottom: "20px" }}
      >
        Thêm sản phẩm mới
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>
                  {categories.find((c) => c.id === product.categoryId)?.name ||
                    "-"}
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForm(product)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={totalPages}
        page={page + 1}
        onChange={(_, newPage) => setPage(newPage - 1)}
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />

      {/* Form Modal */}
      {formOpen && (
        <div style={modalOverlay} onClick={() => setFormOpen(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.title}>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tên sản phẩm</label>
              <input
                type="text"
                style={styles.input}
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={styles.input}
              />
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  style={styles.imagePreview}
                />
              )}
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Mô tả</label>
              <textarea
                style={{ ...styles.input, minHeight: "100px" }}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Danh mục</label>
              <select
                style={styles.select}
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Giá</label>
              <input
                type="number"
                style={styles.input}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: parseInt(e.target.value) })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Giá khuyến mãi</label>
              <input
                type="number"
                style={styles.input}
                value={formData.discountedPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountedPrice: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Số lượng</label>
              <input
                type="number"
                style={styles.input}
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Tác giả</label>
              <input
                type="text"
                style={styles.input}
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={() => setFormOpen(false)}
              >
                Hủy
              </button>
              <button
                style={{ ...styles.button, ...styles.submitButton }}
                onClick={handleSubmit}
              >
                {selectedProduct ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận Xóa */}
      {deleteModalOpen && (
        <div style={modalOverlay} onClick={() => setDeleteModalOpen(false)}>
          <div style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.title}>Xác nhận xóa</div>
            <p>
              Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.productName}
              " không?
            </p>
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={() => setDeleteModalOpen(false)}
              >
                Hủy
              </button>
              <button
                style={{ ...styles.button, ...styles.deleteButton }}
                onClick={handleDeleteConfirm}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
