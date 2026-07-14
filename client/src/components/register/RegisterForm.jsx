import { useState } from "react";
import { registerUser } from "../../api/users";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121116] px-4">
      <div className="w-full max-w-sm rounded-lg border border-[#302E38] bg-[#1C1B22] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#302E38] bg-[#18171D]">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          <span className="ml-2 font-mono text-xs text-[#8B8894]">
            register.sh
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div>
            <label
              htmlFor="username"
              className="block font-mono text-xs text-[#C6FF3D] mb-1.5"
            >
              &gt; username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#302E38] text-[#F1EFE9] py-1.5
                         focus:outline-none focus:border-[#C6FF3D] transition-colors"
              placeholder="username"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs text-[#C6FF3D] mb-1.5"
            >
              &gt; email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#302E38] text-[#F1EFE9] py-1.5
                         focus:outline-none focus:border-[#C6FF3D] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs text-[#C6FF3D] mb-1.5"
            >
              &gt; password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-0 border-b border-[#302E38] text-[#F1EFE9] py-1.5
                         focus:outline-none focus:border-[#C6FF3D] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 font-mono text-sm bg-[#C6FF3D] text-[#121116] font-semibold py-2.5 rounded
                       hover:bg-[#D4FF66] transition-colors cursor-pointer"
          >
            run register()
          </button>

          {success && (
            <p className="font-mono text-xs text-[#C6FF3D]">
              ✓ user created successfully
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
