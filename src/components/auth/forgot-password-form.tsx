"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
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

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (data) => {
      setMessage(data.message);
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message);
      setMessage(null);
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const formData = new FormData(event.currentTarget);
    mutation.mutate({ email: formData.get("email") as string });
  }

  return (
    <Card className="w-full max-w-md border-border/80 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Reset your password</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link. In development,
          check the API console for the link.
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
          {message && (
            <p className="text-sm text-muted-foreground" role="status">
              {message}
            </p>
          )}
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
            {mutation.isPending ? "Sending…" : "Send reset link"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
