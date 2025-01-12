import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { userService } from '../../services/userService';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
    fullName: '',
    mobile: '',
    role: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        email: selectedUser.email,
        userName: selectedUser.userName,
        fullName: selectedUser.fullName || '',
        mobile: selectedUser.mobile || '',
        role: selectedUser.role
      });
    }
  }, [selectedUser]);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(selectedUser.id, formData);
      setFormOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(selectedUser.id);
      setDeleteModalOpen(false);
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const styles = {
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      width: '500px'
    },
    formGroup: {
      marginBottom: '15px'
    },
    label: {
      display: 'block',
      marginBottom: '5px'
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '10px',
      marginTop: '20px'
    },
    button: {
      padding: '8px 16px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer'
    }
  };

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      
      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Tên đăng nhập</TableCell>
              <TableCell>Họ và tên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.userName}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Modal */}
      {isFormOpen && (
        <div style={styles.modal} onClick={() => setFormOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Chỉnh sửa người dùng</h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input
                  style={styles.input}
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tên đăng nhập</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Họ và tên</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Số điện thoại</label>
                <input
                  style={styles.input}
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Vai trò</label>
                <select
                  style={styles.input}
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="ROLE_USER">Người dùng</option>
                  <option value="ROLE_ADMIN">Quản trị viên</option>
                </select>
              </div>
              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={{ ...styles.button, backgroundColor: '#f0f0f0' }}
                  onClick={() => setFormOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ ...styles.button, backgroundColor: '#1976d2', color: 'white' }}
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={styles.modal} onClick={() => setDeleteModalOpen(false)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Xóa người dùng</h3>
            <p>Bạn có chắc chắn muốn xóa người dùng {selectedUser?.email}?</p>
            <div style={styles.buttonGroup}>
              <button
                style={{ ...styles.button, backgroundColor: '#f0f0f0' }}
                onClick={() => setDeleteModalOpen(false)}
              >
                Hủy
              </button>
              <button
                style={{ ...styles.button, backgroundColor: '#dc3545', color: 'white' }}
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

export default UserList;
