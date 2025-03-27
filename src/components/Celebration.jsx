import { useEffect, useState } from "react";
import click from "../assets/clic.png";

export default function Celebration() {
    const [balloons, setBalloons] = useState([]);

    useEffect(() => {
        const generateBalloons = () => {
            const newBalloons = [];
            const columns = 10; // Number of vertical columns
            const rows = 5; // Number of horizontal rows
            
            for (let i = 0; i < columns * rows; i++) {
                const col = i % columns;
                const row = Math.floor(i / columns);
                
                // Evenly distribute horizontally
                const leftPercentage = (col / columns) * 90 + 5;
                
                // Stagger the vertical starting positions
                const startOffset = (row / rows) * -100;
                
                newBalloons.push({
                    id: i,
                    left: `${leftPercentage}vw`,
                    animationDelay: `${(col * 0.1) + (row * 0.3)}s`, // Stagger delays
                    startOffset: `${startOffset}%`, // Stagger starting positions
                    duration: `${3 + Math.random() * 2}s`, // Vary durations slightly
                });
            }
            setBalloons(newBalloons);
        };

        generateBalloons();
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {balloons.map((balloon) => (
                <div
                    key={balloon.id}
                    className="balloon"
                    style={{
                        left: balloon.left,
                        animationDelay: balloon.animationDelay,
                        top: balloon.startOffset,
                        animationDuration: balloon.duration,
                    }}
                >
                    <p className="capitalize italic text-2xl">stop gooning</p>
                </div>
            ))}
            <div className="confetti w-full text-center flex flex-col justify-center items-center h-full absolute z-[99999]">
                <p className="text-2xl lg:text-5xl xl:text-7xl font-bold font-piedra absolute top-40 bg-gradient-to-r from-purple-800 via-pink-600 to-yellow-500 text-transparent bg-clip-text drop-shadow-lg">I KNOW THE KIND OF PERSON YOU ARE</p>
                <img src={click} alt="" className="rounded-b-xl absolute left-4 md:static"/>
            </div>
        </div>
    );
}