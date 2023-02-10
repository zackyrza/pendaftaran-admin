import { API_URL } from "Config";
import { IPendaftaran, IPendaftaranPost } from "Helpers/Interface/Pendaftaran";
import axios from "axios";
import { useContext, useState } from "react";
import { PendaftaranContext } from "../Context/pendaftaran";

export function usePendaftaran() {
    const [pendaftaran, setPendaftaran] = useState<IPendaftaran[]>([]);
    const [pendaftaranDetail, setPendaftaranDetail] = useState<IPendaftaran>({
        id: 0,
        cityId: 0,
        classId: 0,
        sportGenderId: 0,
        email: '',
        quantity: 0,
        candidates: [],
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const pendaftaranContext = useContext(PendaftaranContext);

    const getPendaftaran = async () => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'GET',
                url: API_URL + '/registrations',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            setLoading(false);
            pendaftaranContext.setPendaftaran(response.data.data);
            setPendaftaran(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            pendaftaranContext.setPendaftaran([]);
            setPendaftaran([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const getPendaftaranById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'GET',
                url: API_URL + '/registrations/' + id,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setLoading(false);
            pendaftaranContext.setPendaftaranDetail(response.data.data);
            setPendaftaranDetail(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            pendaftaranContext.setPendaftaranDetail({
                id: 0,
                cityId: 0,
                classId: 0,
                sportGenderId: 0,
                email: '',
                quantity: 0,
                candidates: [],
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setPendaftaranDetail({
                id: 0,
                cityId: 0,
                classId: 0,
                sportGenderId: 0,
                email: '',
                quantity: 0,
                candidates: [],
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const createPendaftaran = async (data: IPendaftaranPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/registrations',
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

    const updatePendaftaran = async (id: number, data: IPendaftaranPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'PUT',
                url: API_URL + '/registrations/' + id,
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

    const deletePendaftaran = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: API_URL + '/registrations/' + id,
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
        pendaftaran,
        pendaftaranDetail,
        errorMessage,
        getPendaftaran,
        getPendaftaranById,
        createPendaftaran,
        updatePendaftaran,
        deletePendaftaran,
        loading,
    }
}