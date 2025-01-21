import React, { createContext, useEffect, useState, useCallback } from 'react';
import api from '../apis/api';
import Cookies from 'js-cookie';
import * as auth from '../apis/auth';
import { useNavigate } from 'react-router-dom';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginContextName';

const LoginContextProvider = ({ children }) => {
    const navigate = useNavigate();
    const [isLogin, setLogin] = useState(false);
    const [isLoginInProgress, setLoginInProgress] = useState(true);
    const [isUserId, setIsUserId] = useState(null);
    const [isGender, setIsGender] = useState(null);
    const [isLoginId, setIsLoginId] = useState(null);
    const [roles, setRoles] = useState({});

    // logoutSetting 함수 메모이제이션
    const logoutSetting = useCallback(() => {
        api.defaults.headers.common.Authorization = undefined;
        Cookies.remove("accessToken");
        setLogin(false);
        setIsUserId(null);
        setIsLoginId(null);
        setIsGender(null);
        setRoles({});
    }, []);

    // loginSetting 함수 메모이제이션
    const loginSetting = useCallback((userData, accessToken) => {
        const { userId, loginid, gender, roles: userRoles = [] } = userData;
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        setLogin(true);
        setIsUserId(userId);
        setIsLoginId(loginid);
        setIsGender(gender);

        if (Array.isArray(userRoles)) {
            setRoles(userRoles.reduce((acc, role) => ({ ...acc, [role]: true }), {}));
        } else {
            console.warn("Invalid roles data:", userRoles);
            setRoles({});
        }
    }, []);

    // loginCheck 함수 메모이제이션
    const loginCheck = useCallback(async () => {
        const accessToken = Cookies.get("accessToken");
        if (!accessToken) {
            logoutSetting();
            return;
        }

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        try {
            const response = await auth.info();
            if (response.data === 'UNAUTHORIZED') {
                throw new Error("Unauthorized");
            }
            loginSetting(response.data, accessToken);
        } catch (error) {
            console.error("Error during login check:", error);
            logoutSetting();
        }
    }, [logoutSetting, loginSetting]);

    // useEffect에서 loginCheck 실행
    useEffect(() => {
        setLoginInProgress(true);
        loginCheck().finally(() => setLoginInProgress(false));
    }, [loginCheck]);

    const login = async (loginid, password) => {
        try {
            const response = await auth.login(loginid, password);
            const authHeader = response.headers.authorization;

            if (!authHeader) {
                throw new Error("Authorization 헤더가 없습니다.");
            }

            const accessToken = authHeader.replace("Bearer ", "");
            Cookies.set("accessToken", accessToken);

            await loginCheck();
            alert("로그인 성공! 메인 화면으로 이동합니다.");
            navigate("/");
        } catch (error) {
            console.error(`로그인 중 오류 발생: ${error.message}`);
            alert("로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.");
        }
    };

    const logout = (force = false) => {
        if (force || window.confirm("로그아웃하시겠습니까?")) {
            logoutSetting();
            navigate("/");
        }
    };

    return (
        <LoginContext.Provider value={{ isLogin, isLoginInProgress, isUserId, isLoginId, isGender, roles, login, logout }}>
            {children}
        </LoginContext.Provider>
    );
};

export default LoginContextProvider;
