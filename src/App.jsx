import FaucetForm from "./components/FaucetForm";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <FaucetForm/>
    </div>
  );
}