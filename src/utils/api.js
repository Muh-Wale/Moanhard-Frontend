const API_URL = "https://moanhard-backend.vercel.app/api"; // Your backend URL

export const requestDrip = async (address) => {
    const response = await fetch(`${API_URL}/drip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient: address }),
    });
    return response.json();
};

export const checkClaimStatus = async (address) => {
    const response = await fetch(`${API_URL}/can-claim/${address}`);
    return response.json();
};