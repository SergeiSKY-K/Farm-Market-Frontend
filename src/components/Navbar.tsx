import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import api from "../api/axios.ts";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const role = useAppSelector(state => state.auth.role);

    const handleLogout = async () => {
        try {
            const login = localStorage.getItem('login');
            if (!login) throw new Error('Login not found in localStorage');

            await api.post('/auth/logout', null, {
                params: { login },
                withCredentials: true,
            });


            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('role');
            localStorage.removeItem('login');

            dispatch(logout());
            navigate('/login');
        } catch (err) {
            console.error('Error exiting:', err);
        }
    };
    return (
        <nav style={{ padding: '1rem', background: '#f5f5f5', marginBottom: '1rem' }}>
            <span style={{ marginRight: '2rem' }}>You are logged in as: <strong>{role}</strong></span>


            <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>


            {role === 'SUPPLIER' && (
                <>
                    <Link to="/add-product" style={{ marginRight: '1rem' }}>Add Product</Link>
                    <Link to="/supplier/products" style={{ marginRight: '1rem' }}>My Products</Link>
                </>
            )}


            {role === 'MODERATOR' && (
                <>
                    <Link to="/moderator/products" style={{ marginRight: '1rem' }}>All products</Link>
                    <Link to="/moderator/orders" style={{ marginRight: '1rem' }}>Orders</Link>
                </>
            )}

            <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
        </nav>
    );
};

export default Navbar;