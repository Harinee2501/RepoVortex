import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if the user is already logged in (i.e., if there's an active session)
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session) {
        // If the session exists, log out the user to force them to log in again
        await supabase.auth.signOut(); // Log out the existing user
        localStorage.removeItem("loggedIn"); // Remove the session from local storage
      }
    };

    // Call checkSession to clear any active session on component mount
    checkSession();
  }, []);

  const handleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        setError(error.message);
        return;
      }
  
      if (data?.user?.email_confirmed_at === null) {
        setError("Please confirm your email address before logging in.");
        return;
      }
  
      // ✅ Store user_id in localStorage after login
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user_id", data.user.id);  // <-- add this line
  
      alert("Login successful!");
      router.replace("/dashboard");
    } catch (error) {
      setError("An error occurred during login.");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Log In</h1>
      <input
        className="p-2 border mb-4 w-64 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="p-2 border mb-4 w-64 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Log In
      </button>
    </div>
  );
}
