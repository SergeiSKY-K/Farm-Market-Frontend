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

            const { role } = res.data;

            dispatch(setAuth({ accessToken, role }));
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('role', role);
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
        <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '5rem auto' }}>
            <h2>Login</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                required
                style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
            />
            <button type="submit" style={{ width: '100%', padding: '0.5rem' }}>
                Log In
            </button>
            <button
                type="button"
                onClick={() => navigate('/register')}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', backgroundColor: '#eee' }}
            >
               Register
            </button>
        </form>
    );
};

export default LoginPage;
