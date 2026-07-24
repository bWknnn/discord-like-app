import { useEffect, useState } from "react";
import { registerUser, loginUser } from "../../api/users";
import { useNavigate } from "react-router";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [type, setType] = useState("Sign In");

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/app", { replace: true });
    }
  }, [navigate]);

  async function onSubmitHandler(event) {
    event.preventDefault();
    setErrorMessage("");

    if (type === "Sign Up") {
      try {
        await registerUser(username, email, password);

        setSuccess(true);
        setUsername("");
        setEmail("");
        setPassword("");
      } catch (error) {
        setErrorMessage(error.message || "Registration failed. Please try again.");
      }

      return;
    }

    try {
      const user = await loginUser(email, password);

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/app", { replace: true });
    } catch (error) {
      setErrorMessage(error.message || "Login failed. Please check your credentials.");
    }
  }

  function switchToSignIn() {
    setType("Sign In");
    setSuccess(false);
    setErrorMessage("");
    setUsername("");
    setEmail("");
    setPassword("");
  }

  function switchToSignUp() {
    setType("Sign Up");
    setSuccess(false);
    setErrorMessage("");
    setUsername("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main px-4">
      <div className="w-full max-w-sm rounded-lg border border-border-dark bg-bg-card shadow-2xl overflow-hidden">
        <div className="flex justify-center gap-2 px-4 py-3 border-b border-border-dark bg-bg-header">
          <span className="text-accent font-mono">{type}</span>
        </div>

        <form onSubmit={onSubmitHandler} className="p-6 flex flex-col gap-5">
          {errorMessage && (
            <div className="font-mono text-xs text-badge bg-badge/10 border border-badge/30 p-2.5 rounded flex items-center gap-2 animate-in fade-in duration-150">
              <span>⚠</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {type === "Sign Up" && (
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
                onChange={(event) => setUsername(event.target.value)}
                className="input"
                placeholder="username"
                required
              />
            </div>
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
              onChange={(event) => setEmail(event.target.value)}
              className="input"
              placeholder="you@example.com"
              required
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
              onChange={(event) => setPassword(event.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 font-mono text-sm bg-accent text-bg-main font-semibold py-2.5 rounded hover:bg-accent-hover transition-colors cursor-pointer"
          >
            {type === "Sign Up" ? "Sign Up" : "Sign In"}
          </button>

          {type === "Sign Up" ? (
            <p className="font-light tracking-wider text-neutral-400 font-mono text-xs select-none">
              Have an account?
              <button
                type="button"
                onClick={switchToSignIn}
                className="text-accent hover:text-accent-hover cursor-pointer transition-colors ml-1"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="font-light tracking-wider text-neutral-400 font-mono text-xs select-none">
              Create an account?
              <button
                type="button"
                onClick={switchToSignUp}
                className="text-accent hover:text-accent-hover cursor-pointer transition-colors ml-1"
              >
                Sign Up
              </button>
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
