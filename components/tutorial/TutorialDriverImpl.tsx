"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { driver } from "driver.js";
import type { DriveStep, Driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface TutorialDriverProps {
  steps: DriveStep[];
  storageKey: string;
  autoStart?: boolean;
  showButton?: boolean;
}

export default function TutorialDriverImpl({
  steps,
  storageKey,
  autoStart = false,
  showButton = true,
}: TutorialDriverProps) {
  const [isClient, setIsClient] = useState(false);
  const driverRef = useRef<Driver | null>(null);

  const announceToScreenReader = useCallback((message: string) => {
    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.className = "sr-only";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => document.body.removeChild(el), 1000);
  }, []);

  const startTutorial = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const driverObj = driver({
      showProgress: true,
      progressText: "{{current}} dari {{total}}",
      nextBtnText: "Selanjutnya →",
      prevBtnText: "← Sebelumnya",
      doneBtnText: "Selesai",
      allowKeyboardControl: true,
      allowClose: true,
      overlayClickBehavior: "close",
      popoverClass: "tutorial-popover",
      steps: steps,
      onDestroyed: () => {
        localStorage.setItem(storageKey, "true");
        announceToScreenReader("Panduan ditutup. Tekan H kapan saja untuk mengulangi.");
      },
    });

    driverRef.current = driverObj;
    announceToScreenReader("Panduan dimulai. Gunakan tombol panah untuk navigasi, Escape untuk menutup.");
    driverObj.drive();
  }, [steps, storageKey, announceToScreenReader]);

  useEffect(() => {
    setIsClient(true);

    const seen = localStorage.getItem(storageKey);
    if (!seen && autoStart) {
      setTimeout(() => {
        startTutorial();
      }, 1000);
    }
  }, [storageKey, autoStart, startTutorial]);

  useEffect(() => {
    if (!isClient) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === "h" || e.key === "H") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          e.preventDefault();
          startTutorial();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isClient, startTutorial]);

  if (!isClient || !showButton) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={startTutorial}
        size="lg"
        className="rounded-full shadow-lg"
        aria-label="Mulai panduan (atau tekan H)"
      >
        <HelpCircle className="h-5 w-5 mr-2" />
        Panduan
      </Button>
    </div>
  );
}
