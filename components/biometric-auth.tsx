"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Fingerprint, Shield, Smartphone, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Web Authentication API types
interface BiometricCredential extends Credential {
  id: string;
  type: "public-key";
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse | AuthenticatorAssertionResponse;
}

interface BiometricAuthProps {
  isEnabled: boolean;
  onEnable: () => Promise<void>;
  onAuthenticate: () => Promise<boolean>;
  onDisable: () => Promise<void>;
}

interface BiometricPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

/**
 * Verifica si el dispositivo soporta autenticación biométrica
 */
export function useBiometricSupport() {
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSupport = async () => {
      try {
        // Verificar si la Web Authentication API está disponible
        if (typeof window === "undefined" || !window.PublicKeyCredential) {
          setIsSupported(false);
          return;
        }

        // Verificar si el dispositivo soporta autenticación de plataforma (biometría)
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsSupported(available);
      } catch {
        setIsSupported(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupport();
  }, []);

  return { isSupported, isLoading };
}

/**
 * Componente de prompt de autenticación biométrica
 */
export function BiometricPrompt({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: BiometricPromptProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSupported } = useBiometricSupport();

  const authenticate = useCallback(async () => {
    setIsAuthenticating(true);
    setError(null);

    try {
      // Configuración de la autenticación
      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(32),
        allowCredentials: [],
        userVerification: "required",
        timeout: 60000,
      };

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (credential) {
        onSuccess();
      } else {
        throw new Error("Autenticación cancelada");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error en autenticación biométrica";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsAuthenticating(false);
    }
  }, [onSuccess, onError]);

  // Intentar autenticar automáticamente al abrir
  useEffect(() => {
    if (isOpen && isSupported) {
      const timer = setTimeout(() => {
        authenticate();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isSupported, authenticate]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm"
        >
          <div className="card-premium p-8 text-center">
            {/* Icono animado */}
            <motion.div
              animate={
                isAuthenticating
                  ? {
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/20 flex items-center justify-center"
            >
              {isSupported ? (
                <Fingerprint className="w-12 h-12 text-primary" />
              ) : (
                <Smartphone className="w-12 h-12 text-muted-foreground" />
              )}
            </motion.div>

            <h2 className="text-xl font-bold text-foreground mb-2">
              {isSupported
                ? "Verificación biométrica"
                : "Verificación no disponible"}
            </h2>

            <p className="text-muted-foreground mb-6">
              {isSupported
                ? "Coloca tu huella o usa Face ID para continuar"
                : "Tu dispositivo no soporta autenticación biométrica"}
            </p>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-sm text-red-400"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              {isSupported && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={authenticate}
                  disabled={isAuthenticating}
                  className="w-full py-3.5 rounded-xl font-semibold text-white btn-gradient disabled:opacity-50"
                >
                  {isAuthenticating ? "Verificando..." : "Autenticar"}
                </motion.button>
              )}

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3.5 rounded-xl font-semibold bg-secondary text-foreground"
              >
                Cancelar
              </motion.button>
            </div>

            <p className="text-xs text-muted-foreground mt-6">
              Tus datos biométricos nunca salen de tu dispositivo
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Componente para configurar la autenticación biométrica
 */
export function BiometricSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { isSupported, isLoading: isCheckingSupport } = useBiometricSupport();

  // Cargar estado guardado
  useEffect(() => {
    const saved = localStorage.getItem("biometricEnabled");
    setIsEnabled(saved === "true");
  }, []);

  const enableBiometric = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Crear credencial para registro biométrico
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "App Gastos",
          id: window.location.hostname,
        },
        user: {
          id: new Uint8Array(16),
          name: "user",
          displayName: "Usuario",
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none",
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (credential) {
        localStorage.setItem("biometricEnabled", "true");
        setIsEnabled(true);
        setMessage({
          type: "success",
          text: "Autenticación biométrica activada correctamente",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "No se pudo activar la autenticación biométrica",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const disableBiometric = async () => {
    localStorage.setItem("biometricEnabled", "false");
    setIsEnabled(false);
    setMessage({
      type: "success",
      text: "Autenticación biométrica desactivada",
    });
  };

  if (isCheckingSupport) {
    return (
      <div className="card-premium p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
            <div className="h-3 w-48 bg-secondary rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card-premium p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              isSupported
                ? isEnabled
                  ? "bg-emerald-500/20"
                  : "bg-primary/20"
                : "bg-secondary"
            )}
          >
            {isEnabled ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Shield
                className={cn(
                  "w-5 h-5",
                  isSupported ? "text-primary" : "text-muted-foreground"
                )}
              />
            )}
          </div>
          <div>
            <h3 className="font-medium text-foreground">
              Autenticación biométrica
            </h3>
            <p className="text-sm text-muted-foreground">
              {isSupported
                ? isEnabled
                  ? "Activa - Usa huella o Face ID"
                  : "Usa Face ID o huella digital para acceder"
                : "No disponible en este dispositivo"}
            </p>
          </div>
        </div>

        {isSupported && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={isEnabled ? disableBiometric : enableBiometric}
            disabled={isLoading}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
              isEnabled
                ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                : "bg-primary/20 text-primary hover:bg-primary/30"
            )}
          >
            {isLoading
              ? "Procesando..."
              : isEnabled
              ? "Desactivar"
              : "Activar"}
          </motion.button>
        )}
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "mt-3 p-3 rounded-xl text-sm flex items-center gap-2",
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/10 text-red-400 border border-red-500/30"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message.text}
        </motion.div>
      )}

      {isSupported && !isEnabled && (
        <div className="mt-3 p-3 rounded-xl bg-secondary/50 text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <Fingerprint className="w-4 h-4 shrink-0 mt-0.5" />
            Tus datos biométricos se almacenan de forma segura en tu dispositivo
            y nunca se comparten con nuestros servidores.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Hook para proteger rutas/componentes con biometría
 */
export function useBiometricAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isSupported } = useBiometricSupport();

  useEffect(() => {
    // Verificar si la biometría está habilitada
    const biometricEnabled = localStorage.getItem("biometricEnabled") === "true";

    if (biometricEnabled && isSupported) {
      setShowPrompt(true);
    } else {
      setIsAuthenticated(true);
    }
  }, [isSupported]);

  const handleSuccess = () => {
    setIsAuthenticated(true);
    setShowPrompt(false);
  };

  const handleError = () => {
    // En caso de error, permitir acceso con contraseña o cerrar
    setShowPrompt(false);
  };

  return {
    isAuthenticated,
    showPrompt,
    handleSuccess,
    handleError,
  };
}

export default BiometricPrompt;
