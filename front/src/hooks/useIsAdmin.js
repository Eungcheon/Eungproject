const useIsAdmin = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    console.log('role:', userInfo?.userRole);
    return userInfo?.userRole === 'ADMIN';
};

export default useIsAdmin;