import { useState } from "react";
import { registerUser, loginUser } from "../../api/users";
import { useNavigate } from "react-router";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("Sign In");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await registerUser(username, email, password);
      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const user = await loginUser(email, password);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/main");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="w-full max-w-sm rounded-lg border border-border-dark bg-bg-card shadow-2xl overflow-hidden">
        <div className="flex justify-center gap-2 px-4 py-3 border-b border-border-dark bg-bg-header">
          <span className="text-accent font-mono">{type}</span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {type === "Sign Up" ? (
            <div>
              <label
                htmlFor="username"
                className="block font-mono text-xs text-accent mb-1.5"
              >
                &gt; username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
                placeholder="username"
              />
            </div>
          ) : (
            ""
          )}

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs text-accent mb-1.5"
            >
              &gt; email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs text-accent mb-1.5"
            >
              &gt; password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
            />
          </div>

          {type === "Sign Up" ? (
            <button
              type="submit"
              className="mt-2 font-mono text-sm bg-accent text-bg-main font-semibold py-2.5 rounded
                       hover:bg-accent-hover transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="mt-2 font-mono text-sm bg-accent text-bg-main font-semibold py-2.5 rounded
                       hover:bg-accent-hover transition-colors cursor-pointer"
            >
              Sign In
            </button>
          )}

          {type === "Sign Up" ? (
            <p className="font-light tracking-wider text-neutral-400 font-mono text-xs select-none">
              Have an account?
              <span
                onClick={() => setType("Sign In")}
                className="text-accent hover:text-accent-hover cursor-pointer transition-colors ml-1"
              >
                Sign In
              </span>
            </p>
          ) : (
            <p className="font-light tracking-wider text-neutral-400 font-mono text-xs select-none">
              Create an account?
              <span
                onClick={() => setType("Sign Up")}
                className="text-accent hover:text-accent-hover cursor-pointer transition-colors ml-1"
              >
                Sign Up
              </span>
            </p>
          )}

          {type === "Sign Up" && success && (
            <p className="font-mono text-xs text-accent">
              ✓ user created successfully
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
