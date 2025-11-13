import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface RelatedService {
  title: string
  href: string
  description: string
}

interface RelatedServicesProps {
  services: RelatedService[]
}

export default function RelatedServices({ services }: RelatedServicesProps) {
  if (services.length === 0) return null

  return (
    <section className="py-16 bg-neutral-50 dark:bg-dark-bg-secondary transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-white text-center mb-12">
          You May Also Need
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="group p-6 bg-white dark:bg-dark-bg-primary rounded-lg hover:shadow-lg hover:border-primary border-2 border-transparent transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
              </div>
              <p className="text-sm text-lrp-text-secondary dark:text-dark-text-secondary">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
