import Image from 'next/image';
import type { TeamMember } from '@/lib/api/team';
import { User } from 'lucide-react';

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="bg-white dark:bg-dark-bg-tertiary rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
      {/* Photo */}
      <div className="relative h-64 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <User className="w-24 h-24 text-neutral-300 dark:text-neutral-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
          {member.name}
        </h3>

        {member.departmentRole && (
          <p className="text-sm text-primary dark:text-primary-light font-semibold mb-3">
            {member.departmentRole}
          </p>
        )}

        {/* Vehicles */}
        {member.vehicles && member.vehicles.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase mb-2">
              Vehicles
            </p>
            <div className="flex flex-wrap gap-2">
              {member.vehicles.map((vehicle, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full"
                >
                  {vehicle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
