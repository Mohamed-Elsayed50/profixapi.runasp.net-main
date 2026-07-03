"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
// import { useToast } from "@/hooks/use-toast"; 

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();
  // const { toast } = useToast();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (res?.error) {
      alert("Invalid credentials, please try again.");
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4">
      {/* Background decoration - optional */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] opacity-5" />

      <Card className="w-full max-w-[400px] border-slate-200 shadow-xl z-10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center text-black">
            Pro<span className="text-amber-700">Fix</span>
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            Enter your credentials to access the dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-medium">Email Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="admin@profix.com" 
                        {...field} 
                        className="focus-visible:ring-amber-700 border-slate-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black font-medium">Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="focus-visible:ring-amber-700 border-slate-300"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-black hover:bg-black/90 text-white font-semibold transition-all h-11"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-amber-500" />
                    Authenticating...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          {/* Register links */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-amber-700 hover:text-amber-800 hover:underline transition-colors"
              >
                Register here
              </Link>
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
              <Link
                href="/register?tab=customer"
                className="hover:text-amber-700 transition-colors"
              >
                Register as Customer
              </Link>
              <span>·</span>
              <Link
                href="/register?tab=technician"
                className="hover:text-amber-700 transition-colors"
              >
                Register as Technician
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}