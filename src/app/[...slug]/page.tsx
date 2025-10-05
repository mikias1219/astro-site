import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

interface DynamicPage {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description?: string;
  meta_keywords?: string;
  anchor_text?: string;
  anchor_link?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: {
    slug: string[];
  };
}

async function getDynamicPage(slug: string): Promise<DynamicPage | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://astroarupshastri.com'}/api/pages/${slug}`, {
      cache: 'no-store', // Always fetch fresh data for dynamic pages
    });

    if (!response.ok) {
      return null;
    }

    const page = await response.json();
    return page.is_published ? page : null;
  } catch (error) {
    console.error('Error fetching dynamic page:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const page = await getDynamicPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
      description: 'The requested page could not be found.',
    };
  }

  return {
    title: page.title,
    description: page.meta_description || page.title,
    keywords: page.meta_keywords,
    openGraph: {
      title: page.title,
      description: page.meta_description || page.title,
      type: 'website',
    },
  };
}

export default async function DynamicPageComponent({ params }: PageProps) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const page = await getDynamicPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 text-center">
              {page.title}
            </h1>
            {page.meta_description && (
              <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
                {page.meta_description}
              </p>
            )}
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
            
            {/* Internal Link Section */}
            {page.anchor_text && page.anchor_link && (
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Related Content</h3>
                <a 
                  href={page.anchor_link}
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                >
                  {page.anchor_text}
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}

            {/* Meta Information */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span>Last updated: {new Date(page.updated_at).toLocaleDateString()}</span>
                {page.meta_keywords && (
                  <span>Keywords: {page.meta_keywords}</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// Generate static params for known pages (optional optimization)
export async function generateStaticParams() {
  // You can pre-generate static paths for commonly accessed pages
  // For now, we'll let Next.js handle dynamic rendering
  return [];
}
