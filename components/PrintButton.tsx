'use client';

import { Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function PrintButton() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleScreenshot = async () => {
    try {
      setIsCapturing(true);
      
      // Encontra a tabela de indicadores
      const tableElement = document.querySelector('[data-indicator-table]') as HTMLElement;
      
      if (!tableElement) {
        alert('Tabela não encontrada');
        return;
      }

      // Captura a tabela como canvas
      const canvas = await html2canvas(tableElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Melhor qualidade
        logging: false,
        useCORS: true,
        windowWidth: tableElement.scrollWidth,
        windowHeight: tableElement.scrollHeight,
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
          link.download = 'suno-goals-indicadores.png';
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
      ref={buttonRef}
      onClick={handleScreenshot}
      disabled={isCapturing}
      className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed print:hidden ${
        copied ? 'bg-status-green text-white' : 'bg-suno-red text-white'
      }`}
      aria-label="Copiar tabela de indicadores como imagem"
    >
      <Camera className="w-4 h-4" />
      {copied ? '✓ Copiado!' : isCapturing ? 'Capturando...' : 'Screenshot'}
    </button>
  );
}

