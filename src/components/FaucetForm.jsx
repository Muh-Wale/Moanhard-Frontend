import { useState, useEffect } from "react";
import { requestDrip, checkClaimStatus } from "../utils/api";
import CountdownTimer from "./CountdownTimer";
import Celebration from "./Celebration";
import celebrationSound from "../assets/celebration.mp3";

export default function FaucetForm() {
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [hasClaimed, setHasClaimed] = useState(false);
    const [audio] = useState(new Audio(celebrationSound));

    useEffect(() => {
        if (showCelebration) {
            // Allow autoplay only after user interaction
            audio.loop = true;
            audio.play().catch((err) => console.error("Audio play error:", err));
        } else {
            audio.pause();
            audio.currentTime = 0;
        }

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [showCelebration]);

    const handleClaim = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const status = await checkClaimStatus(address);
            if (!status.canClaim) {
                setMessage("⚠️ Please wait 24 hours between claims");
                return;
            }

            const result = await requestDrip(address);
            if (result.success) {
                setMessage("✅ 0.01 MON sent successfully!");
                setCooldown(24 * 60 * 60);
                setShowCelebration(true);
                setHasClaimed(true);

                // Start the audio ONLY when user clicks the claim button
                audio.play().catch((err) => console.error("Audio play error:", err));
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
        <div className="flex items-center justify-center min-h-screen">
            {showCelebration && <Celebration />}

            {!hasClaimed && (
                <div className="bg-white/20 backdrop-blur-lg shadow-lg rounded-2xl p-4 md:p-6 w-full max-w-md relative">
                    <h1 className="text-3xl font-extrabold text-white text-center mb-6">Monad Faucet</h1>
                    <form onSubmit={handleClaim} className="space-y-5">
                        <div>
                            <label htmlFor="address" className="block text-white text-sm font-semibold mb-2">
                                Your MON Address
                            </label>
                            <input
                                id="address"
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="0x..."
                                className="w-full p-4 text-gray-800 bg-white/10 border border-white/20 rounded-lg focus:ring-4 focus:ring-indigo-400 outline-none backdrop-blur-sm"
                                required
                            />
                        </div>
                        {!isLoading && <p className="capitalize italic text-center text-base md:text-xl text-white">Increase Your Volume To Claim</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-lg font-bold text-white transition-all shadow-md 
                                ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-400/50"}`}
                        >
                            {isLoading ? "Processing..." : "🚀 Claim 0.01 MON"}
                        </button>
                    </form>
                    {cooldown > 0 && <CountdownTimer seconds={cooldown} />}
                    {message && <p className="mt-4 text-center text-white text-sm font-medium">{message}</p>}
                </div>
            )}
        </div>
    );
}
