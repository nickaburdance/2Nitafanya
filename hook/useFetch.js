import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function useFetch() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchData = async()=>{
        setIsLoading(true);
        try {
            const response = await axios.get('https://todoapp-backend-reactnative.onrender.com/api/tasks');
            setData(response.data);
            //console.log(data.tasks);
            setIsLoading(false);
        } catch (error) {
            setError(error);
        }finally{
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchData();
    }, []);

    const refetch = ()=>{
        setIsLoading(true);
        fetchData();
    }
  return {data, isLoading, error, refetch}
}