import Image from 'next/image';
import { getSupabaseServerClient } from '@/lib/supabase/client';

interface MemberLogo {
  name: string;
  url: string;
}

async function getMemberLogos(): Promise<MemberLogo[]> {
  try {
    const supabase = getSupabaseServerClient();

    // List all files in the 'membersof' bucket
    const { data: files, error } = await supabase.storage
      .from('membersof')
      .list('', {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' },
      });

    if (error) {
      console.error('Error fetching member logos:', error);
      return [];
    }

    if (!files || files.length === 0) {
      return [];
    }

    // Filter out any folders (items without metadata) and non-image files
    const imageFiles = files.filter(file => {
      const ext = file.name.toLowerCase().split('.').pop();
      return file.id && ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '');
    });

    // Generate public URLs for each image
    const logos: MemberLogo[] = imageFiles.map(file => {
      const { data } = supabase.storage
        .from('membersof')
        .getPublicUrl(file.name);

      return {
        name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '), // Clean filename for alt text
        url: data.publicUrl,
      };
    });

    return logos;
  } catch (error) {
    console.error('Error in getMemberLogos:', error);
    return [];
  }
}

export default async function MemberLogosSection() {
  const logos = await getMemberLogos();

  // Don't render the section if there are no logos
  if (logos.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center text-neutral-900 dark:text-white mb-8">
          Proud Members Of
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {logos.map((logo, index) => (
            <div
              key={`member-logo-${index}`}
              className="flex items-center justify-center p-4 bg-white dark:bg-dark-bg-primary rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <Image
                src={logo.url}
                alt={logo.name}
                width={160}
                height={80}
                className="h-16 md:h-20 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
