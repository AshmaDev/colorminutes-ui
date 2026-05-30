"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth-provider";

function LoginFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      const from = searchParams.get("from") ?? "/meetings";
      router.push(from);
      router.refresh();
    },
    onError: (err: Error) => setError(err.message),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    mutation.mutate({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    });
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to manage your HOA board meeting minutes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="secretary@youroakwoodhoa.org"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/register" className="font-medium text-foreground underline-offset-4 hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export function LoginForm() {
  return (
    <Suspense>
      <LoginFormInner />
    </Suspense>
  );
}
