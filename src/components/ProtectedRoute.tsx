import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type {JSX} from "react";

type Props = {
    children: JSX.Element;
    allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const token = useAppSelector(state => state.auth.accessToken);
    const roles = useAppSelector(state => state.auth.roles); // ⬅ здесь fix

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && (!roles || !roles.some(r => allowedRoles.includes(r)))) {
        return <div>No access</div>;
    }

    return children;
};

export default ProtectedRoute;