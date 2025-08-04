import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAppDispatch } from './store/hooks';
import { setAuth, logout } from './store/slices/authSlice';
import axios from './api/axios';
import { parseJwt } from './utils/parseJwt';


import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import AllProductsPage from './pages/AllProductsPage';
import AdminUsersPage from './pages/AdminUserPage';
import OrdersPage from './pages/OrdersPage';
import EditProductPage from './pages/EditProductPage';
import RegisterPage from './pages/RegisterPage';
import ManageSuppliersPage from './pages/ManageSuppliersPage';
import ManageRolesPage from './pages/ManageRolesPage';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const response = await axios.post('/auth/refresh', {}, { withCredentials: true });
                const accessToken = response.headers.authorization?.split(' ')[1];

                if (!accessToken) throw new Error("No access token from refresh");

                const payload = parseJwt(accessToken);
                const roles = Array.isArray(payload?.roles)
                    ? payload.roles
                    : typeof payload?.role === 'string'
                        ? [payload.role]
                        : [];

                if (!roles.length) throw new Error("Roles missing from JWT");

                dispatch(setAuth({ accessToken, roles }));
            } catch {
                dispatch(logout());
            }
        };


        void tryRefresh();
    }, [dispatch]);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-product"
                    element={
                        <ProtectedRoute allowedRoles={['SUPPLIER']}>
                            <AddProductPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/moderator/products"
                    element={
                        <ProtectedRoute allowedRoles={['MODERATOR']}>
                            <AllProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <AdminUsersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/moderator/orders"
                    element={
                        <ProtectedRoute allowedRoles={['MODERATOR']}>
                            <OrdersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-product/:id"
                    element={
                        <ProtectedRoute allowedRoles={['SUPPLIER']}>
                            <EditProductPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/all-products"
                    element={
                        <ProtectedRoute allowedRoles={['MODERATOR']}>
                            <AllProductsPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                    path="/moderator/manage-suppliers"
                    element={
                        <ProtectedRoute allowedRoles={['MODERATOR']}>
                            <ManageSuppliersPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/manage-roles"
                    element={
                        <ProtectedRoute allowedRoles={['ADMIN']}>
                            <ManageRolesPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;