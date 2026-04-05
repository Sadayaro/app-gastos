"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  Repeat,
  Bell,
  Upload,
  ChevronDown,
  Check,
  Camera,
  FileUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "home", name: "Hogar", icon: "🏠", color: "#8b5cf6" },
  { id: "services", name: "Servicios", icon: "⚡", color: "#06b6d4" },
  { id: "entertainment", name: "Entretenimiento", icon: "🎮", color: "#ec4899" },
  { id: "education", name: "Educación", icon: "📚", color: "#10b981" },
  { id: "health", name: "Salud", icon: "🏥", color: "#ef4444" },
  { id: "transport", name: "Transporte", icon: "🚗", color: "#f59e0b" },
  { id: "food", name: "Alimentación", icon: "🍽️", color: "#f97316" },
  { id: "shopping", name: "Compras", icon: "🛍️", color: "#6366f1" },
  { id: "other", name: "Otros", icon: "📦", color: "#64748b" },
];

const RECURRENCE_TYPES = [
  { id: "weekly", name: "Semanal" },
  { id: "biweekly", name: "Quincenal" },
  { id: "monthly", name: "Mensual" },
  { id: "quarterly", name: "Trimestral" },
  { id: "yearly", name: "Anual" },
];

const ALARM_OFFSETS = [
  { value: 7, label: "7 días antes" },
  { value: 2, label: "2 días antes" },
  { value: 1, label: "1 día antes" },
  { value: 0, label: "El mismo día" },
];

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Partial<ExpenseFormData>;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  categoryId: string;
  dueDate: string;
  description?: string;
  isRecurring: boolean;
  recurrenceType?: string;
  recurrenceEnd?: string;
  alarmOffset: number;
  document?: File;
}

export function ExpenseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: ExpenseFormProps) {
  const [step, setStep] = useState<"basic" | "details" | "confirm">("basic");
  const [formData, setFormData] = useState<ExpenseFormData>({
    title: initialData?.title || "",
    amount: initialData?.amount || 0,
    categoryId: initialData?.categoryId || "",
    dueDate: initialData?.dueDate || new Date().toISOString().split("T")[0],
    description: initialData?.description || "",
    isRecurring: initialData?.isRecurring || false,
    recurrenceType: initialData?.recurrenceType || "monthly",
    recurrenceEnd: initialData?.recurrenceEnd || "",
    alarmOffset: initialData?.alarmOffset ?? 7,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        document: selectedFile || undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: "100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="absolute inset-x-0 bottom-0 max-w-md mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="card-premium rounded-t-3xl rounded-b-none min-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
              <h2 className="text-lg font-semibold text-foreground">
                {step === "basic" && "Nuevo Gasto"}
                {step === "details" && "Detalles"}
                {step === "confirm" && "Confirmar"}
              </h2>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Step 1: Basic Info */}
              {step === "basic" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Nombre del gasto
                    </label>
                    <div className="relative">
                      <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Ej: Arriendo, Luz, Internet..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Monto
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.amount || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground text-lg font-semibold placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    {formData.amount > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatCurrency(formData.amount)}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Categoría
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {CATEGORIES.map((cat) => (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setFormData({ ...formData, categoryId: cat.id })
                          }
                          className={cn(
                            "p-3 rounded-xl text-center transition-all",
                            formData.categoryId === cat.id
                              ? "ring-2 ring-primary"
                              : "bg-secondary hover:bg-secondary/80"
                          )}
                        >
                          <span className="text-2xl">{cat.icon}</span>
                          <p className="text-xs mt-1 text-foreground">
                            {cat.name}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Fecha de vencimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData({ ...formData, dueDate: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-0 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === "details" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  {/* Recurring */}
                  <div className="card-premium p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Repeat className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            Gasto recurrente
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Se repite automáticamente
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            isRecurring: !formData.isRecurring,
                          })
                        }
                        className={cn(
                          "w-12 h-7 rounded-full transition-colors relative",
                          formData.isRecurring ? "bg-primary" : "bg-secondary"
                        )}
                      >
                        <motion.div
                          animate={{
                            x: formData.isRecurring ? 20 : 2,
                          }}
                          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
                        />
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {formData.isRecurring && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3"
                        >
                          <select
                            value={formData.recurrenceType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                recurrenceType: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 rounded-xl bg-secondary border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            {RECURRENCE_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>

                          <div>
                            <label className="text-xs text-muted-foreground mb-1 block">
                              Fin de recurrencia (opcional)
                            </label>
                            <input
                              type="date"
                              value={formData.recurrenceEnd}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  recurrenceEnd: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2.5 rounded-xl bg-secondary border-0 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Alarm */}
                  <div className="card-premium p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Recordatorio
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cuándo avisarte
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {ALARM_OFFSETS.map((offset) => (
                        <motion.button
                          key={offset.value}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              alarmOffset: offset.value,
                            })
                          }
                          className={cn(
                            "px-3 py-2 rounded-xl text-sm transition-all",
                            formData.alarmOffset === offset.value
                              ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-400/50"
                              : "bg-secondary text-muted-foreground"
                          )}
                        >
                          {offset.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Document */}
                  <div className="card-premium p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Comprobante
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Adjuntar boleta o factura
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-3 rounded-xl bg-secondary flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/80 transition-colors"
                        >
                          <Camera className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Foto
                          </span>
                        </motion.div>
                      </label>
                      <label className="flex-1">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <motion.div
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-3 rounded-xl bg-secondary flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/80 transition-colors"
                        >
                          <FileUp className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            PDF
                          </span>
                        </motion.div>
                      </label>
                    </div>

                    {selectedFile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-emerald-400 truncate">
                          {selectedFile.name}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Notas adicionales..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border-0 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Confirm */}
              {step === "confirm" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center py-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-primary/20 flex items-center justify-center">
                      <Receipt className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-1">
                      {formData.title}
                    </h3>
                    <p className="text-3xl font-bold text-gradient">
                      {formatCurrency(formData.amount)}
                    </p>
                  </div>

                  <div className="card-premium p-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Categoría</span>
                      <span className="text-foreground">
                        {CATEGORIES.find((c) => c.id === formData.categoryId)
                          ?.name || "Sin categoría"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vencimiento</span>
                      <span className="text-foreground">
                        {new Date(formData.dueDate).toLocaleDateString("es-CL", {
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recordatorio</span>
                      <span className="text-foreground">
                        {
                          ALARM_OFFSETS.find(
                            (a) => a.value === formData.alarmOffset
                          )?.label
                        }
                      </span>
                    </div>
                    {formData.isRecurring && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Recurrencia</span>
                        <span className="text-foreground">
                          {RECURRENCE_TYPES.find(
                            (t) => t.id === formData.recurrenceType
                          )?.name}
                        </span>
                      </div>
                    )}
                    {selectedFile && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Comprobante</span>
                        <span className="text-emerald-400">Adjunto</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t border-white/[0.08] space-y-2">
              {step === "basic" && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("details")}
                  disabled={!formData.title || !formData.amount || !formData.categoryId}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-semibold text-white transition-all",
                    formData.title && formData.amount && formData.categoryId
                      ? "btn-gradient"
                      : "bg-secondary text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Continuar
                </motion.button>
              )}

              {step === "details" && (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("basic")}
                    className="flex-1 py-3.5 rounded-xl font-semibold bg-secondary text-foreground"
                  >
                    Atrás
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("confirm")}
                    className="flex-[2] py-3.5 rounded-xl font-semibold text-white btn-gradient"
                  >
                    Revisar
                  </motion.button>
                </div>
              )}

              {step === "confirm" && (
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("details")}
                    className="flex-1 py-3.5 rounded-xl font-semibold bg-secondary text-foreground"
                  >
                    Editar
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] py-3.5 rounded-xl font-semibold text-white btn-gradient disabled:opacity-50"
                  >
                    {isSubmitting ? "Guardando..." : "Guardar Gasto"}
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
