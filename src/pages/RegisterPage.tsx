import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('/auth/register', { login, password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleRegister} style={{maxWidth: 400, margin: '5rem auto'}}>
            <h2>Registration</h2>

            {error && <p style={{color: 'red'}}>{error}</p>}

            <input
                type="text"
                placeholder="Login"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                required
                style={{width: '100%', marginBottom: '1rem', padding: '0.5rem'}}
            />

            <button
                type="submit"
                disabled={loading}
                style={{width: '100%', padding: '0.5rem'}}
            >
                {loading ? 'Registering...' : 'Register'}
            </button>

            <p style={{marginTop: '1rem'}}>
                Already have an account? <a href="/">Login</a>
            </p>
        </form>
    );
};

export default RegisterPage;