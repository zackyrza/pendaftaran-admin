import axios from "axios";
import { useContext, useState } from "react";

import { API_URL } from "Config";
import { TokenContext } from "Helpers/Hooks/Context/token";
import { UserContext } from "Helpers/Hooks/Context/user";

export function useAuthLogin() {
    const [errorMessage, setErrorMessage] = useState('');
    const tokenContext = useContext(TokenContext);
    const userContext = useContext(UserContext);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(API_URL+'/users/login', {
                email,
                password,
                isCMS: true,
            });
            tokenContext.setToken(response.data.token);
            userContext.setUser(response.data.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data));

            return response.data;
        } catch (error: any) {
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    return {
        login,
        errorMessage,
    }
}