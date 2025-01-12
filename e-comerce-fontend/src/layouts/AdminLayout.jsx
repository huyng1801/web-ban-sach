import React, { useEffect } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
} from '@mui/material';
import { Category, ShoppingCart, Person, Receipt, Menu } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const drawerWidth = 240;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Lấy thông tin người dùng từ Redux store hoặc trạng thái quản lý
  const user = useSelector((state) => state.user.userInfo);
  const role = user?.role;

  useEffect(() => {
    console.log(user);
    // Chuyển hướng đến trang người dùng nếu vai trò không phải admin
    if (role !== 'ROLE_ADMIN') {
      navigate('/user');
    }
  }, [role, navigate]);

  const menuItems = [
    { text: 'Danh mục', icon: <Category />, path: '/admin/categories' },
    { text: 'Sản phẩm', icon: <ShoppingCart />, path: '/admin/products' },
    { text: 'Đơn hàng', icon: <Receipt />, path: '/admin/orders' },
    { text: 'Người dùng', icon: <Person />, path: '/admin/users' },
  ];

  const handleLogout = () => {
    // Xử lý đăng xuất (ví dụ: xóa phiên người dùng, token, v.v.)
    navigate('/'); // Chuyển hướng đến trang đăng nhập
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Bảng Điều Khiển Quản Trị
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Đăng Xuất
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
