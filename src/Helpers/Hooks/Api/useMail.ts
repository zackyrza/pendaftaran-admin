import { API_URL } from "Config";
import axios from "axios";
import { useState } from "react";

export function useMail() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const sendFirstStepMail = async (caborId: number, cityId: number, email: string) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/mails/send/firstStep',
                data: {
                    caborId,
                    cityId,
                    email,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLoading(false);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const sendSecondStepMail = async (classId: number, cityId: number, email: string) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/mails/send/secondStep',
                data: {
                    classId,
                    cityId,
                    email,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLoading(false);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const generateSecondStepMail = async (classId: number, cityId: number, email: string) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/mails/generate/secondStep',
                data: {
                    classId,
                    cityId,
                    email,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setLoading(false);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const uploadPdf = async (file: File) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/uploads',
                data: {
                    file
                },
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    return {
        loading,
        errorMessage,
        sendFirstStepMail,
        sendSecondStepMail,
        generateSecondStepMail,
        uploadPdf,
    }
}