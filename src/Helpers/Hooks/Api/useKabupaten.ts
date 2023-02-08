import { API_URL } from "Config";
import { IKabupaten, IKabupatenPost } from "Helpers/Interface/Kabupaten";
import axios from "axios";
import { useContext, useState } from "react";
import { KabupatenContext } from "../Context/kabupaten";
import { TokenContext } from "../Context/token";

export function useKabupaten() {
    const [kabupaten, setKabupaten] = useState<IKabupaten[]>([]);
    const [kabupatenDetail, setKabupatenDetail] = useState<IKabupaten>({
        id: 0,
        name: '',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const kabupatenContext = useContext(KabupatenContext);
    const tokenContext = useContext(TokenContext);

    const getKabupaten = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/cities');
            setLoading(false);
            kabupatenContext.setKabupaten(response.data.data);
            setKabupaten(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kabupatenContext.setKabupaten([]);
            setKabupaten([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const getKabupatenById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/cities/' + id);
            setLoading(false);
            kabupatenContext.setKabupatenDetail(response.data.data);
            setKabupatenDetail(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kabupatenContext.setKabupatenDetail({
                id: 0,
                name: '',
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setKabupatenDetail({
                id: 0,
                name: '',
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const createKabupaten = async (data: IKabupatenPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/cities',
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

    const updateKabupaten = async (id: number, data: IKabupatenPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'PUT',
                url: API_URL + '/cities/' + id,
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

    const deleteKabupaten = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: API_URL + '/cities/' + id,
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
        kabupaten,
        kabupatenDetail,
        errorMessage,
        getKabupaten,
        getKabupatenById,
        createKabupaten,
        updateKabupaten,
        deleteKabupaten,
        loading,
    }
}