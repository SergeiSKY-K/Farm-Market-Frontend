import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAppSelector } from '../store/hooks';

type User = {
    login: string;
    firstName: string;
    lastName: string;
    roles: string[];
};

const ManageSuppliersPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const roles = useAppSelector(state => state.auth.roles);

    useEffect(() => {
        axios.get('/users/users')
            .then(res => setUsers(res.data))
            .catch(() => setError('Error loading users'));
    }, []);

    const hasRole = (user: User, role: string) => user.roles.includes(role);

    const toggleSupplier = async (login: string, isSupplier: boolean) => {
        try {
            if (isSupplier) {
                await axios.delete(`/users/user/${login}/role/SUPPLIER`);
            } else {
                await axios.put(`/users/user/${login}/role/SUPPLIER`);
            }
            setUsers(prev =>
                prev.map(user =>
                    user.login === login
                        ? {
                            ...user,
                            roles: isSupplier
                                ? user.roles.filter(r => r !== 'SUPPLIER')
                                : [...user.roles, 'SUPPLIER'],
                        }
                        : user
                )
            );
        } catch {
            alert('Error updating SUPPLIER role');
        }
    };

    if (!roles.includes('MODERATOR')) return <div>No access</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Supplier Management</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.login} style={{ marginBottom: '1rem' }}>
                        <strong>{user.login}</strong> — {user.firstName} {user.lastName}
                        <br />
                        Роли: {user.roles.join(', ')}
                        <br />
                        <button onClick={() => toggleSupplier(user.login, hasRole(user, 'SUPPLIER'))}>
                            {hasRole(user, 'SUPPLIER') ? 'Remove Supplier' : 'Assign as Supplier'}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageSuppliersPage;