"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PremiumDashboard } from "@/components/dashboard";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseStatus } from "@/lib/business-logic";
import { useSession } from "next-auth/react";

interface Expense {
  id: string;
  title: string;
  amount: number;
  currency: string;
  status: ExpenseStatus;
  dueDate: string;
  paidAt?: string;
  category: {
    id: string;
    name: string;
    color: string;
    icon: string;
  } | null;
  isRecurring: boolean;
  recurrenceType: string | null;
  alarmTriggered: boolean;
  hasDocument?: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchExpenses();
    }
  }, [status, router]);

  async function fetchExpenses() {
    try {
      const response = await fetch("/api/expenses");
      if (response.ok) {
        const data = await response.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddExpense = async (data: any) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const newExpense = await response.json();
        setExpenses((prev) => [newExpense, ...prev]);
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}/pay`, { method: "POST" });
      if (response.ok) {
        setExpenses((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, status: "paid" as ExpenseStatus, paidAt: new Date().toISOString() }
              : e
          )
        );
      }
    } catch (error) {
      console.error("Error marking as paid:", error);
    }
  };

  const handleExpenseClick = (id: string) => {
    router.push(`/expenses/${id}`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <PremiumDashboard
        expenses={expenses.map(e => ({
          ...e,
          dueDate: new Date(e.dueDate),
          paidAt: e.paidAt ? new Date(e.paidAt) : undefined,
        }))}
        onAddExpense={() => setIsFormOpen(true)}
        onExpenseClick={handleExpenseClick}
        onMarkAsPaid={handleMarkAsPaid}
      />
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddExpense}
      />
    </>
  );
}
