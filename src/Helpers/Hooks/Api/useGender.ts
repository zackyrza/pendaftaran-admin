import { API_URL } from "Config";
import { IGender, IGenderPost } from "Helpers/Interface/Gender";
import axios from "axios";
import { useContext, useState } from "react";
import { GenderContext } from "../Context/gender";

export function useGender() {
    const [gender, setGender] = useState<IGender[]>([]);
    const [genderDetail, setGenderDetail] = useState<IGender>({
        id: 0,
        name: '',
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const genderContext = useContext(GenderContext);

    const getGender = async () => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/sportGenders');
            setLoading(false);
            genderContext.setGender(response.data.data);
            setGender(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            genderContext.setGender([]);
            setGender([]);
            setErrorMessage(error.response.data.message);
            throw error.response.data;
        }
    }

    const getGenderById = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get(API_URL + '/sportGenders/' + id);
            setLoading(false);
            genderContext.setGenderDetail(response.data.data);
            setGenderDetail(response.data.data);
            return response.data.data;
        } catch (error: any) {
            setLoading(false);
            genderContext.setGenderDetail({
                id: 0,
                name: '',
                deletedAt: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            setGenderDetail({
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

    const createGender = async (data: IGenderPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'POST',
                url: API_URL + '/sportGenders',
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

    const updateGender = async (id: number, data: IGenderPost) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'PUT',
                url: API_URL + '/sportGenders/' + id,
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

    const deleteGender = async (id: number) => {
        setLoading(true);
        try {
            const response = await axios({
                method: 'DELETE',
                url: API_URL + '/sportGenders/' + id,
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
        gender,
        genderDetail,
        errorMessage,
        getGender,
        getGenderById,
        createGender,
        updateGender,
        deleteGender,
        loading,
    }
}