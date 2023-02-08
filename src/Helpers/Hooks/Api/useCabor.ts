import { API_URL } from "Config";
import { ICabor, ICaborPost } from "Helpers/Interface/Cabor";
import axios from "axios";
import { useContext, useState } from "react";
import { CaborContext } from "../Context/cabor";

export function useCabor() {
    const [cabor, setCabor] = useState<ICabor[]>([]);
    const [caborDetail, setCaborDetail] = useState<ICabor>({
        id: 0,
        name: '',
        imageUrl: '',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const caborContext = useContext(CaborContext);

    const getCabor = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/sports');
            setLoading(false);
            caborContext.setCabor(response.data.data);
            setCabor(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            caborContext.setCabor([]);
            setCabor([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const getCaborById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/sports/' + id);
            setLoading(false);
            caborContext.setCaborDetail(response.data.data);
            setCaborDetail(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            caborContext.setCaborDetail({
                id: 0,
                name: '',
                imageUrl: '',
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setCaborDetail({
                id: 0,
                name: '',
                imageUrl: '',
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const createCabor = async (data: ICaborPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/sports',
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
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

    const updateCabor = async (id: number, data: ICaborPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'PUT',
                url: API_URL + '/sports/' + id,
                data,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
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

    const deleteCabor = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: API_URL + '/sports/' + id,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
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

    return {
        cabor,
        caborDetail,
        errorMessage,
        getCabor,
        getCaborById,
        createCabor,
        updateCabor,
        deleteCabor,
        loading,
    }
}