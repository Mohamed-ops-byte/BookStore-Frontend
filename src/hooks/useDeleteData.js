import baseUrl from '../Api/baseURL'

const useDeleteData = async (url, parmas) => {
    const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
    const res = await baseUrl.delete(url, config);
    return res.data;
}

export { useDeleteData };
export default useDeleteData;