import { BookOwner } from '@/types/indicator';
import { User, Users } from 'lucide-react';

type BookHeaderProps = {
  owner: BookOwner;
};

export default function BookHeader({ owner }: BookHeaderProps) {
  const isTeam = owner.type === 'team';
  
  return (
    <div className="flex items-center gap-3 mb-4 md:mb-5 lg:mb-6">
      {/* Ícone */}
      <div className={`p-2 md:p-2.5 lg:p-3 rounded-lg ${
        isTeam ? 'bg-suno-red/10' : 'bg-neutral-1'
      }`}>
        {isTeam ? (
          <Users className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-suno-red" />
        ) : (
          <User className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-neutral-8" />
        )}
      </div>
      
      {/* Informações */}
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <h3 className="font-display font-bold text-base md:text-lg lg:text-xl text-neutral-10">
            {owner.name}
          </h3>
          {owner.role && (
            <span className="text-xs md:text-sm lg:text-base text-neutral-5 font-medium">
              {owner.role}
            </span>
          )}
        </div>
        {owner.teamName && (
          <p className="text-xs md:text-sm lg:text-base text-neutral-8 mt-0.5">
            {owner.teamName}
          </p>
        )}
      </div>
    </div>
  );
}

