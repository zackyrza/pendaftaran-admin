import { API_URL } from "Config";
import { IKategori, IKategoriPost } from "Helpers/Interface/Kategori";
import axios from "axios";
import { useContext, useState } from "react";
import { KategoriContext } from "../Context/kategori";

export function useKategori() {
    const [kategori, setKategori] = useState<IKategori[]>([]);
    const [kategoriDetail, setKategoriDetail] = useState<IKategori>({
        id: 0,
        name: '',
        sportId: 0,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const kategoriContext = useContext(KategoriContext);

    const getKategori = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/classes');
            setLoading(false);
            kategoriContext.setKategori(response.data.data);
            setKategori(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kategoriContext.setKategori([]);
            setKategori([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const getKategoriById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/classes/' + id);
            setLoading(false);
            kategoriContext.setKategoriDetail(response.data.data);
            setKategoriDetail(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kategoriContext.setKategoriDetail({
                id: 0,
                name: '',
                sportId: 0,
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setKategoriDetail({
                id: 0,
                name: '',
                sportId: 0,
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const getKategoriBySportId = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/classes/sport/' + id);
            setLoading(false);
            kategoriContext.setKategori(response.data.data);
            setKategori(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kategoriContext.setKategori([]);
            setKategori([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const createKategori = async (data: IKategoriPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/classes',
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

    const updateKategori = async (id: number, data: IKategoriPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'PUT',
                url: API_URL + '/classes/' + id,
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

    const deleteKategori = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: API_URL + '/classes/' + id,
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
        kategori,
        kategoriDetail,
        errorMessage,
        getKategori,
        getKategoriById,
        getKategoriBySportId,
        createKategori,
        updateKategori,
        deleteKategori,
        loading,
    }
}