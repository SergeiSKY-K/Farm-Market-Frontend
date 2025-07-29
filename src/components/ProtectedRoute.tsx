import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import type {JSX} from "react";

type Props = {
    children: JSX.Element;
    allowedRoles?: string[];
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
    const token = useAppSelector(state => state.auth.accessToken);
    const role = useAppSelector(state => state.auth.role);

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role ?? '')) {
        return <div>No access</div>;
    }

    return children;
};

export default ProtectedRoute;