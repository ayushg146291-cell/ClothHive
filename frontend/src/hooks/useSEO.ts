import { useEffect } from 'react'

interface SEOProps {
  title?: string
  description?: string
}

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    const defaultTitle = 'ClothHive - Premium Spatial Fashion'
    const defaultDescription = 'Premium fashion crafted for the modern individual. Designed with purpose, worn with confidence.'

    document.title = title ? `${title} | ClothHive` : defaultTitle

    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description || defaultDescription)

  }, [title, description])
}
