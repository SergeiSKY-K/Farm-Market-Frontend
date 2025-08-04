import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { setAuth } from '../store/slices/authSlice';
import api from '../api/axios';

const LoginPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await api.post('/auth/login', { username: login, password });

            const authHeader = res.headers['authorization'] || res.headers['Authorization'];
            const accessToken = authHeader?.split(' ')[1];

            if (!accessToken) {
                throw new Error('Access token not received');
            }

            const payload = parseJwt(accessToken);
            console.log("JWT Payload:", payload);

            let roles: string[] = [];

            if (Array.isArray(payload?.roles)) {
                roles = payload.roles;
            } else if (typeof payload?.role === 'string') {
                roles = [payload.role];
            }

            if (!roles.length) throw new Error("Roles missing in JWT");


            const preferredOrder = ['ADMINISTRATOR', 'MODERATOR', 'SUPPLIER', 'USER'];
            const selectedRole = preferredOrder.find(role => roles.includes(role)) || roles[0];


            dispatch(setAuth({ accessToken, roles }));
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('role', selectedRole);
            localStorage.setItem('login', login);

            navigate('/dashboard');
        } catch (err: unknown) {
            console.error(err);

            if (typeof err === 'object' && err !== null && 'response' in err) {
                const axiosError = err as { response?: { data?: { message?: string } } };
                setError(axiosError.response?.data?.message || 'Login error');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Unknown error');
            }
        }
    };

    return (
        <form
            onSubmit={handleLogin}
            style={{
                maxWidth: 400,
                margin: '5rem auto',
                padding: '2rem',
                background: '#fff',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
            }}
        >
            <h2 style={{ textAlign: 'center' }}>Login</h2>

            {error && (
                <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
            )}

            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                }}
            />
            <button
                type="submit"
                style={{
                    padding: '0.75rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                Log In
            </button>
            <button
                type="button"
                onClick={() => navigate('/register')}
                style={{
                    padding: '0.75rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                }}
            >
                Register
            </button>
        </form>
    );
};

function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.padEnd(base64Url.length + (4 - base64Url.length % 4) % 4, '=');
        const jsonPayload = atob(base64);
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("JWT parsing failed:", e);
        return null;
    }
}

export default LoginPage;