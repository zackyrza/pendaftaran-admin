import { API_URL } from "Config";
import { IKandidat, IKandidatPost } from "Helpers/Interface/Kandidat";
import axios from "axios";
import { useContext, useState } from "react";
import { KandidatContext } from "../Context/kandidat";

export function useKandidat() {
    const [kandidat, setKandidat] = useState<IKandidat[]>([]);
    const [kandidatDetail, setKandidatDetail] = useState<IKandidat>({
        id: 0,
        name: "",
        status: "",
        nik: "",
        age: 0,
        education: "",
        weight: 0,
        height: 0,
        handphone: "",
        occupation: "",
        maritalStatus: "",
        gender: "",
        email: "",
        registrationId: 0,
        religion: "",
        bloodType: "",
        rhesusType: "",
        placeOfBirth: "",
        photo: '',
        birthDate: new Date(),
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const kandidatContext = useContext(KandidatContext);

    const getKandidat = async () => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'GET',
                url: API_URL + '/candidates',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            setLoading(false);
            kandidatContext.setKandidat(response.data.data);
            setKandidat(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kandidatContext.setKandidat([]);
            setKandidat([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const getKandidatById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'GET',
                url: API_URL + '/candidates/' + id,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            })
            setLoading(false);
            kandidatContext.setKandidatDetail(response.data.data);
            setKandidatDetail(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            kandidatContext.setKandidatDetail({
                id: 0,
                name: "",
                status: "",
                nik: "",
                age: 0,
                education: "",
                weight: 0,
                height: 0,
                handphone: "",
                occupation: "",
                maritalStatus: "",
                gender: "",
                email: "",
                registrationId: 0,
                religion: "",
                bloodType: "",
                rhesusType: "",
                placeOfBirth: "",
                photo: '',
                birthDate: new Date(),
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setKandidatDetail({
                id: 0,
                name: "",
                status: "",
                nik: "",
                age: 0,
                education: "",
                weight: 0,
                height: 0,
                handphone: "",
                occupation: "",
                maritalStatus: "",
                gender: "",
                email: "",
                registrationId: 0,
                religion: "",
                bloodType: "",
                rhesusType: "",
                placeOfBirth: "",
                photo: '',
                birthDate: new Date(),
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    };

    const createKandidat = async (data: IKandidatPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/candidates',
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

    const updateKandidat = async (id: number, data: IKandidatPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'PUT',
                url: API_URL + '/candidates/' + id,
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

    const deleteKandidat = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: API_URL + '/candidates/' + id,
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
        kandidat,
        kandidatDetail,
        errorMessage,
        getKandidat,
        getKandidatById,
        createKandidat,
        updateKandidat,
        deleteKandidat,
        loading,
    }
}