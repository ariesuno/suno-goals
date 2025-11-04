'use client';

import { Camera } from 'lucide-react';
import { useState } from 'react';
import html2canvas from 'html2canvas';

type ScreenshotButtonProps = {
  targetSelector: string;
  fileName?: string;
  label?: string;
};

export default function ScreenshotButton({ 
  targetSelector,
  fileName = 'suno-goals-indicadores.png',
  label = 'Screenshot'
}: ScreenshotButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleScreenshot = async () => {
    try {
      setIsCapturing(true);

      // Encontra o elemento alvo
      const targetElement = document.querySelector(targetSelector) as HTMLElement;

      if (!targetElement) {
        alert('Tabela não encontrada');
        return;
      }

      // Captura o elemento como canvas
      const canvas = await html2canvas(targetElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Melhor qualidade
        logging: false,
        useCORS: true,
        windowWidth: targetElement.scrollWidth,
        windowHeight: targetElement.scrollHeight,
      });

      // Converte para blob e copia para clipboard
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Erro ao capturar imagem');
          return;
        }

        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);

          // Feedback visual
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000);
        } catch (err) {
          console.error('Erro ao copiar:', err);
          // Fallback: download da imagem
          const url = canvas.toDataURL();
          const link = document.createElement('a');
          link.download = fileName;
          link.href = url;
          link.click();
          alert('Imagem salva. Copie manualmente para a área de transferência.');
        }
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao capturar screenshot:', error);
      alert('Erro ao capturar screenshot. Tente novamente.');
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <button
      onClick={handleScreenshot}
      disabled={isCapturing}
      className={`flex items-center gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 font-semibold text-sm md:text-base lg:text-lg rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed print:hidden ${
        copied ? 'bg-status-green text-white' : 'bg-suno-red text-white'
      }`}
      aria-label={`Copiar ${label} como imagem`}
    >
      <Camera className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
      {copied ? '✓ Copiado!' : isCapturing ? 'Capturando...' : label}
    </button>
  );
}

