"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, Lock } from "lucide-react";

export function LoginScreen({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;

      if (!password.trim()) {
        setError("Password is required");
        return;
      }

      const response = await axios.post(
        "/auth",
        { password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsLoginSuccess(true);
        router.refresh();
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-900">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (isLoginSuccess) return <>{children}</>;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 p-4">
      <style>
        {`
                    input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    box-shadow: 0 0 0 1000px #262e3b inset !important; /* replace with your bg color */
  -webkit-box-shadow: 0 0 0 1000px #262e3b inset !important;
  caret-color: white !important;
  border: 1px solid #4b5563 !important;
  -webkit-text-fill-color: white !important;
  color: white !important;
  border-radius: 0.5rem !important;
  }
          [data-lastpass-icon-root] {
            display: none !important;
          }

          [data-lastpass-root=""] {
            display: none !important;
        }
                `}
      </style>
      <div className="w-full max-w-md space-y-6 rounded-xl border border-zinc-700/30 bg-zinc-800 p-8 backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10">
            <Lock className="h-7 w-7 text-indigo-400" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-zinc-100">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-zinc-300"
              >
                Password
              </Label>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="h-11 border-zinc-600 bg-zinc-700/50 text-zinc-100 placeholder:text-zinc-500 focus:border-indigo-500/60 focus-visible:ring-indigo-500/30 focus-visible:ring-2 transition-all duration-300"
                placeholder="••••••••"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                autoSave="off"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertDescription className="flex items-center text-sm text-red-300">
                <svg
                  className="mr-2 h-4 w-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 py-2 text-base font-medium text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
