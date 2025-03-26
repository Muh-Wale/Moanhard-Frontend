import { useState } from "react";
import { requestDrip, checkClaimStatus } from "../utils/api";
import CountdownTimer from "./CountdownTimer";

export default function FaucetForm() {
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            // Check claim eligibility first
            const status = await checkClaimStatus(address);
            if (!status.canClaim) {
                setMessage("⚠️ Please wait 24 hours between claims");
                return;
            }

            // Request the drip
            const result = await requestDrip(address);
            if (result.success) {
                setMessage("✅ 0.01 MON sent successfully!");
                setCooldown(24 * 60 * 60); // 24h in seconds
            } else {
                setMessage(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            setMessage(`❌ Network error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-4">Monad Faucet</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">
                        Your MON Address
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="0x..."
                        className="w-full p-3 border rounded focus:ring-2 focus:ring-purple-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 rounded font-medium text-white ${isLoading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
                        }`}
                >
                    {isLoading ? "Processing..." : "Claim 0.01 MON"}
                </button>
            </form>

            {cooldown > 0 && <CountdownTimer seconds={cooldown} />}
            {message && <p className="mt-4 text-center">{message}</p>}
        </div>
    );
}