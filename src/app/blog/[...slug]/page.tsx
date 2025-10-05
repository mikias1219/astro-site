import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/Header';
import { Footer } from '../../../components/Footer';
import Link from 'next/link';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  meta_description?: string;
  meta_keywords?: string;
  author?: string;
  published_at?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

interface PageProps {
  params: {
    slug: string[];
  };
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://astroarupshastri.com'}/api/blog-posts/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const post = await response.json();
    return post.is_published ? post : null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: post.title,
    description: post.meta_description || post.excerpt || post.title,
    keywords: post.meta_keywords,
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || post.title,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author || 'Dr. Arup Shastri'],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const publishDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-orange-600">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-orange-600">Blog</Link>
              <span>/</span>
              <span className="text-gray-800">{post.title}</span>
            </nav>
          </div>
        </section>

        {/* Article Header */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">AS</span>
                </div>
                <span className="font-semibold text-gray-800">{post.author || 'Dr. Arup Shastri'}</span>
              </div>
              <span>•</span>
              <span>{publishDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <article 
              className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Article Footer */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AS</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{post.author || 'Dr. Arup Shastri'}</p>
                    <p className="text-sm text-gray-500">Vedic Astrologer</p>
                  </div>
                </div>
                
                <Link 
                  href="/blog"
                  className="inline-flex items-center text-orange-600 hover:text-orange-700 font-semibold"
                >
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Articles CTA */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Explore More Articles
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Discover more insights about Vedic astrology and spiritual guidance
            </p>
            <Link 
              href="/blog"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Browse All Articles
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return [];
}
