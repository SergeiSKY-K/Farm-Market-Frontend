import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAppSelector } from '../store/hooks';

type User = {
    login: string;
    firstName: string;
    lastName: string;
    roles: string[];
};

const allRoles = ['USER', 'SUPPLIER', 'MODERATOR', 'ADMINISTRATOR'];

const ManageRolesPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState('');
    const role = useAppSelector(state => state.auth.role);

    useEffect(() => {
        axios.get('/users/users')
            .then(res => setUsers(res.data))
            .catch(() => setError('Error loading users'));
    }, []);

    const hasRole = (user: User, role: string) => user.roles.includes(role);

    const toggleRole = async (login: string, role: string, hasIt: boolean) => {
        try {
            if (hasIt) {
                await axios.delete(`/users/user/${login}/role/${role}`);
            } else {
                await axios.put(`/users/user/${login}/role/${role}`);
            }
            setUsers(prev =>
                prev.map(user =>
                    user.login === login
                        ? {
                            ...user,
                            roles: hasIt
                                ? user.roles.filter(r => r !== role)
                                : [...user.roles, role],
                        }
                        : user
                )
            );
        } catch {
            alert('Error updating role');
        }
    };

    if (!role?.includes('ADMINISTRATOR')) return <div>No access</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Managing user roles</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.login} style={{ marginBottom: '1rem' }}>
                        <strong>{user.login}</strong> — {user.firstName} {user.lastName}
                        <br />
                        Current roles: {user.roles.join(', ')}
                        <br />
                        {allRoles.map(r => (
                            <button
                                key={r}
                                onClick={() => toggleRole(user.login, r, hasRole(user, r))}
                                style={{
                                    margin: '0.25rem',
                                    backgroundColor: hasRole(user, r) ? 'crimson' : 'lightgreen',
                                    color: 'white',
                                }}
                            >
                                {hasRole(user, r) ? `Delete ${r}` : `Add ${r}`}
                            </button>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageRolesPage;