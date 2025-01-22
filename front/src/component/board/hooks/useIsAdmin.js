const useIsAdmin = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return userInfo?.userRole === 'ADMIN';
};

export default useIsAdmin;