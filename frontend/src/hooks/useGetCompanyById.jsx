import { setSingleCompany } from '../redux/companySlice';
import { COMPANY_API_END_POINT } from '../utils/constant';
import axios from "../utils/axiosConfig";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token to request
          },
        });

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSingleCompany();
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
