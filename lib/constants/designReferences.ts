export interface DesignReference {
  id: string;
  name: string;
  url: string;
  category: 'University' | 'Corporate' | 'Modern' | 'Minimal' | 'Bold';
  description: string;
  highlights: string[];
  relevance: string;
}

export const DESIGN_REFERENCES: DesignReference[] = [
  {
    id: 'stanford',
    name: 'Stanford University',
    url: 'https://www.stanford.edu',
    category: 'University',
    description: 'Clean, academic design with strong visual hierarchy and excellent accessibility.',
    highlights: [
      'Clear navigation structure',
      'High-quality photography',
      'Consistent typography',
      'Mobile-first responsive design'
    ],
    relevance: 'Similar institution with modern, accessible design approach'
  },
  {
    id: 'mit',
    name: 'MIT',
    url: 'https://www.mit.edu',
    category: 'University',
    description: 'Bold, innovative design that reflects their tech-forward brand.',
    highlights: [
      'Strong brand colors',
      'Interactive elements',
      'Grid-based layouts',
      'Dynamic content sections'
    ],
    relevance: 'Excellent example of balancing innovation with usability'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    url: 'https://stripe.com',
    category: 'Corporate',
    description: 'Modern, clean design with subtle animations and excellent UX patterns.',
    highlights: [
      'Micro-interactions',
      'Clear CTAs',
      'Gradient backgrounds',
      'Product-focused layout'
    ],
    relevance: 'Industry-leading UX patterns and modern design language'
  },
  {
    id: 'linear',
    name: 'Linear',
    url: 'https://linear.app',
    category: 'Modern',
    description: 'Minimalist, fast-loading design with exceptional typography and spacing.',
    highlights: [
      'Generous white space',
      'Subtle animations',
      'Perfect typography',
      'Dark mode support'
    ],
    relevance: 'Example of modern, performance-focused web design'
  },
  {
    id: 'berkeley',
    name: 'UC Berkeley',
    url: 'https://www.berkeley.edu',
    category: 'University',
    description: 'Accessible, content-rich design with clear information architecture.',
    highlights: [
      'Content-first approach',
      'Excellent search',
      'Multiple audience paths',
      'Rich media integration'
    ],
    relevance: 'Similar university context with diverse audience needs'
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    url: 'https://www.airbnb.com',
    category: 'Bold',
    description: 'Bold, image-heavy design with excellent filter and search UX.',
    highlights: [
      'Large imagery',
      'Intuitive filters',
      'Card-based layout',
      'Mobile-optimized'
    ],
    relevance: 'Excellent search and filter patterns for content discovery'
  }
];

export const getDesignReferencesByCategory = (category: DesignReference['category']) => {
  return DESIGN_REFERENCES.filter(ref => ref.category === category);
};