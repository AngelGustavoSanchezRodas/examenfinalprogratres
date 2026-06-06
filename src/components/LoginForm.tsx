"use client";

import { useState } from "react";

interface LoginFormProps {
  onLoginSuccess: (token: string, username: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // It's good practice to use an env variable for API URLs, but for now we keep it as it was or use NEXT_PUBLIC_API_URL if it existed.
      // Assuming the user might want this to work out of the box, we leave the direct URL, but it's cleaner in a component.
      const res = await fetch(
        "https://backcvbgtmdesa.azurewebsites.net/api/login/authenticate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Username: username, Password: password }),
        }
      );

      if (!res.ok) throw new Error("Credenciales inválidas");

      const text = await res.text();
      let fetchedToken = text;
      
      if (text.startsWith("{")) {
        try {
          const json = JSON.parse(text);
          if (json.token) fetchedToken = json.token;
        } catch (err) {
            console.error("Error parsing JSON token response", err);
        }
      }

      fetchedToken = fetchedToken.replace(/^"|"$/g, "");

      sessionStorage.setItem("token", fetchedToken);
      sessionStorage.setItem("username", username);
      onLoginSuccess(fetchedToken, username);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message || "Error al iniciar sesión");
      } else {
        setErrorMsg("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse delay-1000"></div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative z-10 transition-all duration-500 hover:shadow-indigo-500/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
            Bienvenido
          </h1>
          <p className="text-indigo-200/70">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">
              Usuario
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm text-center animate-bounce">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transform transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Autenticando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
