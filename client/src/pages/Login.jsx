import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    // if (!form.email.includes("@") || form.password.length < 6) {
    //   return setError("Enter a valid email and password (min 6 characters).");
    // }
    setError("");
    setLoading(true);
    try {
      const response = await login(form);
      const role = response.data.user.role;
      navigate(
        role === "owner" ? "/dashboard" : role === "admin" ? "/admin" : "/",
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] bg-white lg:grid-cols-[0.9fr_1.1fr]">
      <div className="bg-primary p-8 text-white">
        <p className="eyebrow">welcome back</p>
        <h1 className="mt-3 text-4xl font-black">Login to BizPromo</h1>
        <p className="mt-4 text-white/90">
          Manage your business profile or continue discovering small-scale
          enterprises.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-primary">Account Login</h2>

        {error && (
          <p className="rounded bg-danger/10 p-3 text-sm text-danger">
            {error}
          </p>
        )}

        <label className="block">
          <span className="label">Email</span>
          <input
            type="email"
            autoComplete="email"
            className="input"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block">
          <span className="label">Password</span>
          <input
            type="password"
            autoComplete="current-password"
            className="input"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-muted">
          No account?{" "}
          <Link className="font-semibold text-primary" to="/register">
            Register
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
