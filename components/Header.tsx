import Image from 'next/image';
import PrintButton from './PrintButton';
import YearSelector from './YearSelector';

type HeaderProps = {
  title?: string;
  collaboratorName?: string;
  currentYear?: number;
  showYearSelector?: boolean;
  onYearChange?: (year: number) => void;
};

export default function Header({ 
  title = 'Book de Indicadores',
  collaboratorName,
  currentYear,
  showYearSelector = true,
  onYearChange
}: HeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <Image
          src="/images/Suno Positivo.svg"
          alt="Suno"
          width={120}
          height={40}
          priority
        />
        <div className="flex items-center gap-4">
          {showYearSelector && (
            <YearSelector 
              currentYear={currentYear} 
              onYearChange={onYearChange}
            />
          )}
          <PrintButton />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-neutral-10 mb-2">
            {title}
          </h1>
          {collaboratorName && (
            <p className="text-neutral-8 text-lg">
              Colaborador: <span className="font-semibold">{collaboratorName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

