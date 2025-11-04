'use client';

import { useState, useEffect } from 'react';

type EditableCellProps = {
  value: number;
  meta: number;
  unit: string;
  direction: 'up' | 'down';
  onSave: (newValue: number) => void;
  editable: boolean;
};

export default function EditableCell({ 
  value, 
  meta, 
  unit, 
  direction, 
  onSave, 
  editable 
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  useEffect(() => {
    setEditValue(value.toString());
  }, [value]);

  const formatValue = (val: number): string => {
    if (val === 0) return '\u00A0';
    if (unit === 'R$' || unit === 'H$') {
      return val.toLocaleString('pt-BR');
    }
    return val.toString();
  };

  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    const numValue = parseFloat(editValue.replace(/\./g, '').replace(',', '.')) || 0;
    onSave(numValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const hasData = value !== 0;

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="w-full h-full px-0.5 py-0.5 text-center text-[10px] md:text-[11px] lg:text-sm font-semibold bg-yellow-50 border-2 border-suno-red focus:outline-none"
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`px-0.5 py-0.5 md:px-1 md:py-1 lg:px-1.5 lg:py-1 text-center text-[10px] md:text-[11px] lg:text-sm font-semibold border-b border-neutral-2 h-[22px] md:h-[24px] lg:h-[26px] flex items-center justify-center bg-white ${
        hasData ? 'text-neutral-10' : 'text-neutral-3'
      } ${editable ? 'cursor-pointer hover:bg-blue-50' : ''}`}
      title={editable ? 'Clique duas vezes para editar' : 'Somente leitura'}
    >
      {formatValue(value)}
    </div>
  );
}

