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

// customer wise ai response 


export const streamSalesScript = async (id) => {
  const response = await fetch("http://localhost:8000/sales/script/stream", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_id: id,
    }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let finalText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    finalText += chunk;

    // 👇 yahin ChatGPT jaisa live update
    setOutput(prev => prev + chunk);
  }
};
