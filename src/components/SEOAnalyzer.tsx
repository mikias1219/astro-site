'use client';

import { useState, useEffect } from 'react';

interface SEOAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  metrics: {
    titleLength: number;
    descriptionLength: number;
    keywordCount: number;
    readabilityScore: number;
    hasMetaTitle: boolean;
    hasMetaDescription: boolean;
    hasKeywords: boolean;
    hasImages: boolean;
    hasHeadings: boolean;
  };
}

interface SEOAnalyzerProps {
  content: string;
  title?: string;
  metaDescription?: string;
  keywords?: string[];
  onAnalysisComplete?: (analysis: SEOAnalysis) => void;
}

export function SEOAnalyzer({
  content,
  title = '',
  metaDescription = '',
  keywords = [],
  onAnalysisComplete
}: SEOAnalyzerProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (content || title || metaDescription) {
      analyzeSEO();
    }
  }, [content, title, metaDescription, keywords]);

  const analyzeSEO = async () => {
    setAnalyzing(true);

    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    const analysisResult = performSEOAnalysis();
    setAnalysis(analysisResult);

    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }

    setAnalyzing(false);
  };

  const performSEOAnalysis = (): SEOAnalysis => {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Title analysis
    const titleLength = title.length;
    if (titleLength === 0) {
      issues.push('Missing title tag');
    } else if (titleLength < 30) {
      issues.push('Title is too short (less than 30 characters)');
      suggestions.push('Expand title to 30-60 characters for better SEO');
    } else if (titleLength > 60) {
      issues.push('Title is too long (more than 60 characters)');
      suggestions.push('Shorten title to 30-60 characters to avoid truncation in search results');
    }

    // Meta description analysis
    const descLength = metaDescription.length;
    if (descLength === 0) {
      issues.push('Missing meta description');
    } else if (descLength < 120) {
      issues.push('Meta description is too short (less than 120 characters)');
      suggestions.push('Expand meta description to 120-160 characters');
    } else if (descLength > 160) {
      issues.push('Meta description is too long (more than 160 characters)');
      suggestions.push('Shorten meta description to avoid truncation');
    }

    // Content analysis
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 300) {
      issues.push('Content is too short (less than 300 words)');
      suggestions.push('Add more content to improve search rankings');
    }

    // Keyword analysis
    const keywordDensity = calculateKeywordDensity(content, keywords);
    if (keywords.length === 0) {
      issues.push('No target keywords specified');
      suggestions.push('Add 2-5 primary keywords to optimize for');
    } else if (keywordDensity < 0.5) {
      suggestions.push('Increase keyword usage for better ranking potential');
    } else if (keywordDensity > 3) {
      issues.push('Keyword stuffing detected');
      suggestions.push('Reduce keyword density to avoid penalties');
    }

    // Heading analysis
    const headingCount = (content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || []).length;
    if (headingCount === 0) {
      issues.push('No headings found in content');
      suggestions.push('Add H1, H2, and H3 headings for better structure');
    }

    // Image analysis
    const imageCount = (content.match(/<img[^>]+>/gi) || []).length;
    if (imageCount === 0) {
      suggestions.push('Add relevant images with alt text for better user experience');
    }

    // Readability analysis
    const readabilityScore = calculateReadabilityScore(content);
    if (readabilityScore < 60) {
      issues.push('Content readability is poor');
      suggestions.push('Use shorter sentences and simpler words');
    }

    // Calculate overall score
    const score = calculateOverallScore({
      titleLength,
      descLength,
      wordCount,
      keywordDensity,
      headingCount,
      imageCount,
      readabilityScore,
      hasMetaTitle: titleLength > 0,
      hasMetaDescription: descLength > 0,
      hasKeywords: keywords.length > 0,
      hasImages: imageCount > 0,
      hasHeadings: headingCount > 0
    });

    return {
      score,
      issues,
      suggestions,
      metrics: {
        titleLength,
        descriptionLength: descLength,
        keywordCount: keywords.length,
        readabilityScore,
        hasMetaTitle: titleLength > 0,
        hasMetaDescription: descLength > 0,
        hasKeywords: keywords.length > 0,
        hasImages: imageCount > 0,
        hasHeadings: headingCount > 0
      }
    };
  };

  const calculateKeywordDensity = (text: string, keywords: string[]): number => {
    if (keywords.length === 0) return 0;

    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    let keywordOccurrences = 0;

    keywords.forEach(keyword => {
      const regex = new RegExp(keyword.toLowerCase(), 'g');
      const matches = text.toLowerCase().match(regex);
      keywordOccurrences += matches ? matches.length : 0;
    });

    return totalWords > 0 ? (keywordOccurrences / totalWords) * 100 : 0;
  };

  const calculateReadabilityScore = (text: string): number => {
    // Simplified Flesch Reading Ease calculation
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const syllables = text.split(/\s+/).reduce((count, word) => {
      // Very simplified syllable count
      return count + Math.max(1, word.length / 3);
    }, 0);

    if (sentences === 0 || words === 0) return 0;

    const avgSentenceLength = words / sentences;
    const avgSyllablesPerWord = syllables / words;

    // Flesch Reading Ease formula (simplified)
    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

    return Math.max(0, Math.min(100, score));
  };

  const calculateOverallScore = (metrics: any): number => {
    let score = 100;

    // Title score (30% weight)
    if (!metrics.hasMetaTitle) {
      score -= 30;
    } else if (metrics.titleLength < 30 || metrics.titleLength > 60) {
      score -= 15;
    }

    // Description score (20% weight)
    if (!metrics.hasMetaDescription) {
      score -= 20;
    } else if (metrics.descriptionLength < 120 || metrics.descriptionLength > 160) {
      score -= 10;
    }

    // Content score (20% weight)
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      score -= 10;
    } else if (wordCount < 600) {
      score -= 5;
    }

    // Keywords score (15% weight)
    if (!metrics.hasKeywords) {
      score -= 15;
    }

    // Structure score (15% weight)
    if (!metrics.hasHeadings) {
      score -= 7.5;
    }
    if (!metrics.hasImages) {
      score -= 7.5;
    }

    return Math.max(0, Math.min(100, score));
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
  };

  if (analyzing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
          <span className="text-gray-600">Analyzing SEO...</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-center">Enter content to see SEO analysis</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* SEO Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">SEO Score</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
            {analysis.score}/100 - {getScoreLabel(analysis.score)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              analysis.score >= 80 ? 'bg-green-500' :
              analysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${analysis.score}%` }}
          ></div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{analysis.metrics.titleLength}</div>
          <div className="text-sm text-gray-600">Title Length</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{analysis.metrics.descriptionLength}</div>
          <div className="text-sm text-gray-600">Description</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{analysis.metrics.keywordCount}</div>
          <div className="text-sm text-gray-600">Keywords</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{Math.round(analysis.metrics.readabilityScore)}</div>
          <div className="text-sm text-gray-600">Readability</div>
        </div>
      </div>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <div className="mb-6">
          <h4 className="text-md font-semibold text-red-600 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Issues Found ({analysis.issues.length})
          </h4>
          <ul className="space-y-2">
            {analysis.issues.map((issue, index) => (
              <li key={index} className="flex items-start text-sm text-red-700">
                <span className="text-red-500 mr-2">•</span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <h4 className="text-md font-semibold text-blue-600 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Suggestions ({analysis.suggestions.length})
          </h4>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start text-sm text-blue-700">
                <span className="text-blue-500 mr-2">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
