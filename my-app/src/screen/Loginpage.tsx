import { useEffect, useState, useRef } from "react";
import bgImage from "../assets/BillingProcess.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [baseUrlMissing, setBaseUrlMissing] = useState(false);
  const [baseUrlInput, setBaseUrlInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();
  const settingsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 🔹 Check BASE_URL on first load
useEffect(() => {
  const baseUrl = localStorage.getItem("BASE_URL");
  console.log("Checking BASE_URL:", baseUrl);

  if (!baseUrl) {
    setBaseUrlMissing(true);
    return;
  }

  const token = localStorage.getItem("access_token");
  const expiry = localStorage.getItem("token_expiry");

  console.log("Saved Token:", token);
  console.log("Saved Expiry:", expiry);

  if (token && expiry) {
    if (Date.now() < Number(expiry)) {
      navigate("/itemsPage", { replace: true });
      return;
    }

    // Token expired
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_expiry");
    localStorage.removeItem("user");
  }
}, [navigate]);

  // 🔹 Fetch outlets





  // 🔹 Close settings dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Save BASE_URL
  const handleSaveBaseUrl = () => {
    if (!baseUrlInput.trim()) return;

    localStorage.setItem("BASE_URL", baseUrlInput.trim());

    setBaseUrlMissing(false);
    alert("ℹ️ Base URL saved. Please restart the app to take effect.");
    console.log("BASE_URL updated:", baseUrlInput.trim());
  };

  const handleEditBaseUrl = () => {
    const currentBaseUrl = localStorage.getItem("BASE_URL") || "";
    setBaseUrlInput(currentBaseUrl);
    setBaseUrlMissing(true); // reuse same popup
    setShowSettings(false);
  };



  // 🔹 Login submit with detailed logs
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

 
  

    setErrorMessage("");

    try {
      setLoading(true);
 const result = await login(username, password);

localStorage.setItem("username", username);

console.log("Login successful:", result);

navigate("/itemsPage");
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SHOW BASE URL POPUP FIRST
  if (baseUrlMissing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Enter Server Base URL
          </h2>

          <input
            type="text"
            value={baseUrlInput}
            onChange={(e) => setBaseUrlInput(e.target.value)}
            placeholder="https://your-api-url.com"
            className="w-full border border-slate-300 px-4 py-2 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-sky-500"
          />

          <button
            onClick={handleSaveBaseUrl}
            className="w-full bg-sky-600 text-white py-2 rounded-lg hover:bg-sky-700"
          >
            Save & Continue
          </button>
        </div>
      </div>
    );
  }

  // ✅ LOGIN PAGE
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl z-10 overflow-visible">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <h1 className="text-white text-lg font-semibold tracking-wide">
            KIOSK <span className="text-sky-400">LOGIN</span>
          </h1>

          <div ref={settingsRef} className="relative">
            <button
              type="button"
              onClick={() => setShowSettings((p) => !p)}
              className="text-slate-300 hover:text-white text-xl"
            >
              ⚙️
            </button>

        {showSettings && (
  <div className="absolute right-0 mt-3 w-56 bg-white border rounded-lg shadow-xl z-[999]">
    <div
      onClick={handleEditBaseUrl}
      className="px-4 py-3 text-sm cursor-pointer
      text-red-600
      hover:bg-red-50
      rounded-lg"
    >
      Change Server URL
    </div>
  </div>
)}
          </div>
        </div>
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded text-center">
            {errorMessage}
          </div>
        )}
        <div className="p-6">
          <p className="text-center text-sm text-slate-500 mb-6">
            Secure POS terminal authentication
          </p>

       

        

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                USERNAME
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                required
              />
            </div>

            <button
              disabled={ loading}
              className={`w-full py-3 rounded-lg font-semibold transition
                ${
                   !loading
                    ? "bg-sky-600 hover:bg-sky-700 text-white"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
