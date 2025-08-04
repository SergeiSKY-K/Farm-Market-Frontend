import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import api from "../api/axios";


const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const roles = useAppSelector(state => state.auth.roles);

    const hasRole = (role: string) => roles.includes(role);

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
            console.error('Error during logout:', err);
        }
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem 2rem',
            background: '#007bff',
            color: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            flexWrap: 'wrap',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 500 }}>
                    You are logged in as: <strong>{roles.join(', ')}</strong>
                </span>

                <Link to="/dashboard" style={linkStyle}>Dashboard</Link>

                {hasRole('SUPPLIER') && (
                    <>
                        <Link to="/add-product" style={linkStyle}>Add Product</Link>
                        <Link to="/supplier/products" style={linkStyle}>My Products</Link>
                    </>
                )}

                {hasRole('MODERATOR') && (
                    <>
                        <Link to="/moderator/products" style={linkStyle}>All Products</Link>
                        <Link to="/moderator/orders" style={linkStyle}>Orders</Link>
                    </>
                )}
            </div>

            <button
                onClick={handleLogout}
                style={logoutButtonStyle}
                onMouseOver={(e) => e.currentTarget.style.background = '#e6e6e6'}
                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
            >
                Logout
            </button>
        </nav>
    );
};

// Стили
const linkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    transition: 'background 0.3s',
};

const logoutButtonStyle: React.CSSProperties = {
    backgroundColor: 'white',
    color: '#007bff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.3s',
};

export default Navbar;
