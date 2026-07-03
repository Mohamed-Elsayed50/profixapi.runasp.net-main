"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  UserPlus,
  WrenchIcon,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import { LocationPicker, type LatLng } from "@/src/components/ui/location-picker";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://profixapi.runasp.net";

type Tab = "customer" | "technician";

interface TechnicianType {
  id: string;
  name: string;
}

// ─── Customer Form ─────────────────────────────────────────────────────────────

interface CustomerForm {
  FullName: string;
  UserName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  Address: string;
  City: string;
  Country: string;
}

const CUSTOMER_INITIAL: CustomerForm = {
  FullName: "",
  UserName: "",
  Email: "",
  Password: "",
  PhoneNumber: "",
  Address: "",
  City: "",
  Country: "",
};

// ─── Technician Form ────────────────────────────────────────────────────────────

interface TechnicianForm {
  FullName: string;
  UserName: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  TechnicianTypeId: string;
  City: string;
}

const TECHNICIAN_INITIAL: TechnicianForm = {
  FullName: "",
  UserName: "",
  Email: "",
  Password: "",
  PhoneNumber: "",
  TechnicianTypeId: "",
  City: "",
};

// ─── Helper Components ─────────────────────────────────────────────────────────

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-amber-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function TextInput({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled,
  rightElement,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="
          w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5
          text-sm text-slate-800 shadow-sm outline-none
          placeholder:text-slate-400
          focus:border-amber-400 focus:ring-2 focus:ring-amber-100
          disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-150
          pr-10
        "
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  );
}

// ─── Register Content (inner, uses useSearchParams) ────────────────────────────

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as Tab | null;

  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam === "technician" ? "technician" : "customer"
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Customer state
  const [customerForm, setCustomerForm] = useState<CustomerForm>(CUSTOMER_INITIAL);
  const [customerLocation, setCustomerLocation] = useState<LatLng | null>(null);
  const setCustomer = (field: keyof CustomerForm, value: string) =>
    setCustomerForm((prev) => ({ ...prev, [field]: value }));

  // Technician state
  const [techForm, setTechForm] = useState<TechnicianForm>(TECHNICIAN_INITIAL);
  const [techLocation, setTechLocation] = useState<LatLng | null>(null);
  const setTech = (field: keyof TechnicianForm, value: string) =>
    setTechForm((prev) => ({ ...prev, [field]: value }));

  // Technician types
  const [techTypes, setTechTypes] = useState<TechnicianType[]>([]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/TechnicanType`)
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) setTechTypes(data);
      })
      .catch(() => {/* silently fail */});
  }, []);

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(false);
    setShowPassword(false);
  };

  // ─── Submit: Customer ────────────────────────────────────────────────────────
  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      const form = new FormData();
      Object.entries(customerForm).forEach(([key, value]) => {
        if (value.trim()) form.append(key, value);
      });
      if (customerLocation) {
        form.append("Latitude", String(customerLocation.lat));
        form.append("Longitude", String(customerLocation.lng));
      }
      await axios.post(`${API_BASE}/api/Customer/Register`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.title ||
          "Registration failed. Please try again."
        : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsPending(false);
    }
  };

  // ─── Submit: Technician ──────────────────────────────────────────────────────
  const handleTechSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!techLocation) {
      setError("Please set your location on the map. It is required for technicians.");
      return;
    }
    setError(null);
    setIsPending(true);
    try {
      const form = new FormData();
      Object.entries(techForm).forEach(([key, value]) => {
        if (value.trim()) form.append(key, value);
      });
      form.append("Latitude", String(techLocation.lat));
      form.append("Longitude", String(techLocation.lng));
      await axios.post(`${API_BASE}/api/Technician/Register`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message ||
          err.response?.data?.title ||
          "Registration failed. Please try again."
        : "An unexpected error occurred.";
      setError(msg);
    } finally {
      setIsPending(false);
    }
  };

  const customerValid =
    customerForm.FullName.trim() &&
    customerForm.UserName.trim() &&
    customerForm.Email.trim() &&
    customerForm.Password.trim();

  const techValid =
    techForm.FullName.trim() &&
    techForm.UserName.trim() &&
    techForm.Email.trim() &&
    techForm.Password.trim() &&
    techForm.TechnicianTypeId.trim() &&
    techLocation !== null;

  // ─── Success Screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Account Created!</h1>
          <p className="text-slate-500 mb-8">
            Your{" "}
            <span className="font-medium text-slate-700">
              {activeTab === "customer" ? "customer" : "technician"}
            </span>{" "}
            account has been registered successfully. You can now log in.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-black/80 transition-all"
            >
              Go to Login
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setCustomerForm(CUSTOMER_INITIAL);
                setCustomerLocation(null);
                setTechForm(TECHNICIAN_INITIAL);
                setTechLocation(null);
              }}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
            >
              Register Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100 p-4 py-12">
      {/* Subtle background dots */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(#92400e 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative w-full max-w-xl">
        {/* Back to login */}
        <Link
          href="/login"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-slate-800 px-8 py-7">
            <h1 className="text-2xl font-bold text-white">
              Pro<span className="text-amber-400">Fix</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Create your account to get started
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex border-b border-slate-100 bg-slate-50">
            <button
              id="tab-customer"
              onClick={() => switchTab("customer")}
              className={`
                flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-all border-b-2
                ${
                  activeTab === "customer"
                    ? "border-amber-500 text-amber-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }
              `}
            >
              <UserPlus className="h-4 w-4" />
              I&apos;m a Customer
            </button>
            <button
              id="tab-technician"
              onClick={() => switchTab("technician")}
              className={`
                flex flex-1 items-center justify-center gap-2 py-4 text-sm font-medium transition-all border-b-2
                ${
                  activeTab === "technician"
                    ? "border-amber-500 text-amber-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                }
              `}
            >
              <WrenchIcon className="h-4 w-4" />
              I&apos;m a Technician
            </button>
          </div>

          {/* Form body */}
          <div className="px-8 py-7">

            {/* ── Customer Form ──────────────────────────────────────────────── */}
            {activeTab === "customer" && (
              <form onSubmit={handleCustomerSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldGroup label="Full Name" required>
                    <TextInput
                      id="customer-fullname"
                      value={customerForm.FullName}
                      onChange={(v) => setCustomer("FullName", v)}
                      placeholder="John Doe"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Username" required>
                    <TextInput
                      id="customer-username"
                      value={customerForm.UserName}
                      onChange={(v) => setCustomer("UserName", v)}
                      placeholder="johndoe"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Email Address" required>
                    <TextInput
                      id="customer-email"
                      type="email"
                      value={customerForm.Email}
                      onChange={(v) => setCustomer("Email", v)}
                      placeholder="john@example.com"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Password" required>
                    <TextInput
                      id="customer-password"
                      type={showPassword ? "text" : "password"}
                      value={customerForm.Password}
                      onChange={(v) => setCustomer("Password", v)}
                      placeholder="••••••••"
                      disabled={isPending}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                  </FieldGroup>
                  <FieldGroup label="Phone Number">
                    <TextInput
                      id="customer-phone"
                      type="tel"
                      value={customerForm.PhoneNumber}
                      onChange={(v) => setCustomer("PhoneNumber", v)}
                      placeholder="+1 234 567 890"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="City">
                    <TextInput
                      id="customer-city"
                      value={customerForm.City}
                      onChange={(v) => setCustomer("City", v)}
                      placeholder="New York"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Country">
                    <TextInput
                      id="customer-country"
                      value={customerForm.Country}
                      onChange={(v) => setCustomer("Country", v)}
                      placeholder="USA"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Address">
                    <TextInput
                      id="customer-address"
                      value={customerForm.Address}
                      onChange={(v) => setCustomer("Address", v)}
                      placeholder="123 Main St"
                      disabled={isPending}
                    />
                  </FieldGroup>
                </div>

                {/* Map — optional for customers */}
                <div className="pt-1">
                  <LocationPicker
                    value={customerLocation}
                    onChange={setCustomerLocation}
                    required={false}
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Optional — helps technicians find you more easily.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  id="customer-submit"
                  type="submit"
                  disabled={isPending || !customerValid}
                  className="
                    w-full rounded-xl bg-black py-3 text-sm font-semibold text-white
                    hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    transition-all duration-150
                  "
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Create Customer Account
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ── Technician Form ────────────────────────────────────────────── */}
            {activeTab === "technician" && (
              <form onSubmit={handleTechSubmit} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FieldGroup label="Full Name" required>
                    <TextInput
                      id="tech-fullname"
                      value={techForm.FullName}
                      onChange={(v) => setTech("FullName", v)}
                      placeholder="Ahmed Hassan"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Username" required>
                    <TextInput
                      id="tech-username"
                      value={techForm.UserName}
                      onChange={(v) => setTech("UserName", v)}
                      placeholder="ahmedhassan"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Email Address" required>
                    <TextInput
                      id="tech-email"
                      type="email"
                      value={techForm.Email}
                      onChange={(v) => setTech("Email", v)}
                      placeholder="ahmed@example.com"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="Password" required>
                    <TextInput
                      id="tech-password"
                      type={showPassword ? "text" : "password"}
                      value={techForm.Password}
                      onChange={(v) => setTech("Password", v)}
                      placeholder="••••••••"
                      disabled={isPending}
                      rightElement={
                        <button
                          type="button"
                          onClick={() => setShowPassword((p) => !p)}
                          className="text-slate-400 hover:text-slate-600 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                  </FieldGroup>
                  <FieldGroup label="Phone Number">
                    <TextInput
                      id="tech-phone"
                      type="tel"
                      value={techForm.PhoneNumber}
                      onChange={(v) => setTech("PhoneNumber", v)}
                      placeholder="+1 234 567 890"
                      disabled={isPending}
                    />
                  </FieldGroup>
                  <FieldGroup label="City">
                    <TextInput
                      id="tech-city"
                      value={techForm.City}
                      onChange={(v) => setTech("City", v)}
                      placeholder="Cairo"
                      disabled={isPending}
                    />
                  </FieldGroup>

                  {/* Technician type — full width */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label htmlFor="tech-type" className="block text-sm font-medium text-slate-700">
                      Specialization (Type)
                      <span className="ml-1 text-amber-600">*</span>
                    </label>
                    <select
                      id="tech-type"
                      value={techForm.TechnicianTypeId}
                      onChange={(e) => setTech("TechnicianTypeId", e.target.value)}
                      disabled={isPending}
                      className="
                        w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5
                        text-sm text-slate-800 shadow-sm outline-none
                        focus:border-amber-400 focus:ring-2 focus:ring-amber-100
                        disabled:cursor-not-allowed disabled:opacity-50
                        transition-all duration-150
                      "
                    >
                      <option value="">— Select your specialization —</option>
                      {techTypes.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    {techTypes.length === 0 && (
                      <p className="text-xs text-slate-400">Loading specializations…</p>
                    )}
                  </div>
                </div>

                {/* Map — REQUIRED for technicians */}
                <div className="pt-1">
                  <LocationPicker
                    value={techLocation}
                    onChange={setTechLocation}
                    required={true}
                  />
                  <p className="mt-1 text-xs text-slate-400">
                    Required — customers use this to find nearby technicians.
                  </p>
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  id="tech-submit"
                  type="submit"
                  disabled={isPending || !techValid}
                  className="
                    w-full rounded-xl bg-black py-3 text-sm font-semibold text-white
                    hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                    transition-all duration-150
                  "
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                      Creating account…
                    </>
                  ) : (
                    <>
                      <WrenchIcon className="h-4 w-4" />
                      Create Technician Account
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-amber-700 hover:text-amber-800 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page export wrapped in Suspense (required for useSearchParams) ────────────

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-100">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
