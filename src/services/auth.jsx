import axios from 'axios'; 
import http from '../helpers/http';

export const signUp = async (payload) => {
    const response = await http().post("/auth/signup", payload);
    return response.data;
}
