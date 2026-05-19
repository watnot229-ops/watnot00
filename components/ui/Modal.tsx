"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
      <div 
        className="absolute inset-0" 
        onClick={onClose}
      />
      <div 
        className={cn(
          "relative w-full max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10 sm:max-w-md p-6 text-white",
          className
        )}
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-xl font-heading font-semibold text-white">{title}</h2>}
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
