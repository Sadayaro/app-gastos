"use client";

import { useState } from "react";
import { PremiumDashboard } from "@/components/dashboard";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseStatus } from "@/lib/business-logic";

// Datos de ejemplo para demo
const MOCK_EXPENSES = [
  {
    id: "1",
    title: "Arriendo Departamento",
    amount: 450000,
    currency: "CLP",
    status: "pending" as ExpenseStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    category: { id: "home", name: "Hogar", color: "#8b5cf6", icon: "🏠" },
    isRecurring: true,
    recurrenceType: "monthly",
    alarmTriggered: true,
  },
  {
    id: "2",
    title: "Luz y Gas",
    amount: 45000,
    currency: "CLP",
    status: "upcoming" as ExpenseStatus,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    category: { id: "services", name: "Servicios", color: "#06b6d4", icon: "⚡" },
    isRecurring: true,
    recurrenceType: "monthly",
  },
  {
    id: "3",
    title: "Internet Fibra",
    amount: 25000,
    currency: "CLP",
    status: "paid" as ExpenseStatus,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    category: { id: "services", name: "Servicios", color: "#06b6d4", icon: "⚡" },
    isRecurring: true,
    recurrenceType: "monthly",
    hasDocument: true,
  },
  {
    id: "4",
    title: "Netflix + Spotify",
    amount: 15000,
    currency: "CLP",
    status: "paid" as ExpenseStatus,
    dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: { id: "entertainment", name: "Entretenimiento", color: "#ec4899", icon: "🎮" },
    isRecurring: true,
    recurrenceType: "monthly",
  },
  {
    id: "5",
    title: "Curso de React Avanzado",
    amount: 120000,
    currency: "CLP",
    status: "overdue" as ExpenseStatus,
    dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: { id: "education", name: "Educación", color: "#10b981", icon: "📚" },
    alarmTriggered: true,
  },
  {
    id: "6",
    title: "Supermercado Unimarc",
    amount: 85000,
    currency: "CLP",
    status: "pending" as ExpenseStatus,
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    category: { id: "food", name: "Alimentación", color: "#f97316", icon: "🍽️" },
  },
  {
    id: "7",
    title: "Bencina",
    amount: 35000,
    currency: "CLP",
    status: "upcoming" as ExpenseStatus,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    category: { id: "transport", name: "Transporte", color: "#f59e0b", icon: "🚗" },
  },
  {
    id: "8",
    title: "Seguro de Salud",
    amount: 80000,
    currency: "CLP",
    status: "pending" as ExpenseStatus,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    category: { id: "health", name: "Salud", color: "#ef4444", icon: "🏥" },
    isRecurring: true,
    recurrenceType: "monthly",
  },
];

export default function DashboardPage() {
  const [expenses, setExpenses] = useState(MOCK_EXPENSES);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddExpense = (data: any) => {
    console.log("Nuevo gasto:", data);
    // Aquí se conectaría con la API
    setIsFormOpen(false);
  };

  const handleMarkAsPaid = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status: "paid" as ExpenseStatus, paidAt: new Date() }
          : e
      )
    );
  };

  const handleExpenseClick = (id: string) => {
    console.log("Ver detalle de gasto:", id);
  };

  return (
    <>
      <PremiumDashboard
        expenses={expenses}
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
