import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../lib/toast";
import Loader from "../components/Loader";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      setLoading(false);
      setShowSuccessLoader(true);
      toast.success("Login successful!", "Welcome back");


      setTimeout(() => {
        setShowSuccessLoader(false);
        navigate("/boards");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      setError(errorMessage);
      toast.error("Login failed", errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccessLoader && <Loader message="Signing you in..." />}
      <div className="min-h-screen flex items-center justify-center px-4 bg-black relative overflow-hidden">

        <div className="absolute inset-0  from-yellow-600/10 via-black to-yellow-800/10"></div>


        <div className="relative z-10 w-full max-w-lg">
          <div className="bg-black/80 p-10 sm:p-12 rounded-2xl border border-yellow-500/30 backdrop-blur-xl shadow-[0_0_75px_rgba(255,215,0,0.55)] space-y-8">


            <div className="text-center space-y-2">

              <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                Welcome Back to Task Board
              </h2>
              <p className="text-white/60 text-sm">Sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/40 border border-red-500 text-white px-4 py-3 rounded-lg shadow-[0_0_12px_rgba(239,68,68,0.35)] text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">

                <div>
                  <label className="block text-sm text-white/90 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-black/60 border border-yellow-500/40 placeholder-yellow-500/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/90 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-black/60 border border-yellow-500/40 placeholder-yellow-500/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.45)] transition-all disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <p className="text-center text-white/60 text-sm">
                Don’t have an account?{" "}
                <Link to="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
