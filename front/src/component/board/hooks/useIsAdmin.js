import useAuth from '../../login/hooks/useAuth';

const useIsAdmin = () => {
    const { roles } = useAuth();
    return roles['ADMIN'] === true; // 관리자 역할 탐지
};

export default useIsAdmin;
