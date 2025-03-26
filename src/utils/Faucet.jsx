import axios from "axios";

// Option 1: Directly call a backend API (recommended)
export const sendDrip = async (recipient) => {
    const response = await axios.post("/api/drip", { recipient });
    return response.data;
};