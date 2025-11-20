import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../lib/toast";
import Loader from "../components/Loader";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
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
      await register(name, email, password);
      setLoading(false);
      setShowSuccessLoader(true);
      toast.success("Registration successful!", "You can now sign in to your account");
      
     
      setTimeout(() => {
        setShowSuccessLoader(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error("Registration failed", errorMessage);
      setLoading(false);
    }
  };

  return (
    <>
      {showSuccessLoader && <Loader message="Creating your account..." />}
      <div className="min-h-screen flex items-center justify-center px-4 relative bg-black overflow-hidden">
   
      <div className="absolute inset-0  from-yellow-600/10 via-black to-yellow-800/10" />

  
      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-black/80 p-10 sm:p-12 rounded-2xl border border-yellow-500/30 backdrop-blur-xl shadow-[0_0_75px_rgba(255,215,0,0.55)]
 space-y-8">

          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-white drop-shadow-[0_0_8px_rgba(255,215,0,0.3)] mb-3 leading-tight">
              Get Started
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Create your account to start organizing
            </p>
          </div>

   
          <form onSubmit={handleSubmit} className="space-y-6">

            {error && (
              <div className="bg-red-900/40 border border-red-500 text-white px-4 py-3 rounded-lg text-sm shadow-[0_0_12px_rgba(239,68,68,0.35)] leading-relaxed">
                {error}
              </div>
            )}

            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2.5 leading-normal">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3.5 bg-black/60 text-white border border-yellow-500/40 rounded-xl placeholder-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-base leading-normal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2.5 leading-normal">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3.5 bg-black/60 text-white border border-yellow-500/40 rounded-xl placeholder-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-base leading-normal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2.5 leading-normal">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3.5 bg-black/60 text-white border border-yellow-500/40 rounded-xl placeholder-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all text-base leading-normal"
                />
              </div>
            </div>

         
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-yellow-500 text-black font-bold rounded-xl border border-yellow-600 hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(255,215,0,0.45)] transition-all disabled:opacity-50 text-base leading-normal"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-white/60 text-sm pt-4 leading-relaxed">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-yellow-400 hover:text-yellow-300 font-semibold"
              >
                Sign in
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Register;
