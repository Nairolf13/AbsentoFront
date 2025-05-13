import axios from 'axios';
import { API_URL } from './config';

export const getEntreprise = async (id) => {
  const { data } = await axios.get(`${API_URL}/entreprises/${id}`);
  return data;
};

export const deleteEntreprise = async (id) => {
  const { data } = await axios.delete(`${API_URL}/entreprises/${id}`);
  return data;
};

export const updateEntreprise = async (id, data) => {
  const res = await axios.put(`${API_URL}/entreprises/${id}`, data);
  return res.data;
};
