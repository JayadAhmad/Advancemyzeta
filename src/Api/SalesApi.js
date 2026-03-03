import axios from "axios";

export const getToken = () => {
  const auth = localStorage.getItem("auth");
  if (!auth) return null;
  const parsedAuth = JSON.parse(auth);
  // console.log("token in sales api:", parsedAuth.token);
  return parsedAuth.token;
};

// sales left customer panel data fetch
export const fetchTodayCustomersApi = async () => {
  try {
    const token = getToken();
    const response = await axios.get("https://jemapps.in/api/ai-dashboard/sales/get-today-customers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching today's customers:", error);
    throw error;
  }
};


// order modal api 
export const fetchItemsApi = async (searchQuery) => {
  console.log("fetchItemsApi called with searchQuery:", searchQuery);
  try{
const response = await axios.get(`https://jemapps.in/api/product/search/${encodeURIComponent(searchQuery)}`) 
console.log("fetchItemsApi response:", response.data);
return response;
  }catch(error){
    console.error("Error fetching items:", error);
    throw error;
  }
}

