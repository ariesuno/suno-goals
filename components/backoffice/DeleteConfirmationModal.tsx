'use client';

import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

type DeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText: string; // Texto que o usuário precisa digitar
  itemName?: string; // Nome do item sendo excluído (opcional)
  warningMessage?: string; // Mensagem de aviso adicional
};

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  itemName,
  warningMessage,
}: DeleteConfirmationModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (inputValue.toLowerCase().trim() !== confirmText.toLowerCase().trim()) {
      setError(`Você precisa digitar "${confirmText}" para confirmar`);
      return;
    }

    onConfirm();
    handleClose();
  };

  const handleClose = () => {
    setInputValue('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-neutral-2">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-suno-red" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-neutral-10">
                  {title}
                </h2>
                {itemName && (
                  <p className="text-sm text-neutral-8 mt-1">
                    {itemName}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-neutral-1 rounded transition-colors"
            >
              <X className="w-5 h-5 text-neutral-8" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-neutral-10">
              {description}
            </p>

            {warningMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-suno-red font-medium">
                  ⚠️ {warningMessage}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-10 mb-2">
                Para confirmar, digite{' '}
                <span className="font-mono font-bold text-suno-red">
                  {confirmText}
                </span>
              </label>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setError('');
                }}
                placeholder={`Digite "${confirmText}"`}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                  error
                    ? 'border-suno-red focus:ring-red-200'
                    : 'border-neutral-3 focus:ring-suno-red focus:border-suno-red'
                }`}
                autoFocus
              />
              {error && (
                <p className="text-xs text-suno-red mt-1">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-2 bg-neutral-1">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-neutral-10 hover:bg-neutral-2 rounded-lg transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!inputValue}
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                inputValue
                  ? 'bg-suno-red text-white hover:bg-red-700'
                  : 'bg-neutral-3 text-neutral-5 cursor-not-allowed'
              }`}
            >
              Excluir Permanentemente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

