import useAuth from '../../login/hooks/useAuth';

const useIsAdmin = () => {
    const { roles } = useAuth();

    console.log("Roles in useIsAdmin:", roles); // 디버깅 로그
    return roles?.ROLE_ADMIN === true; // 관리자 권한 확인
};

export default useIsAdmin;