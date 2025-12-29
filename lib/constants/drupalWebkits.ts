export interface DrupalWebkit {
  id: string;
  name: string;
  category: 'Layout' | 'Content' | 'Media' | 'Navigation' | 'Form' | 'Interactive';
  description: string;
  useCases: string[];
  documentation: string;
  example?: string;
}

export const DRUPAL_WEBKITS: DrupalWebkit[] = [
  {
    id: 'hero-banner',
    name: 'Hero Banner',
    category: 'Layout',
    description: 'Full-width banner with headline, subtext, and CTA. Supports background images, videos, or gradients.',
    useCases: ['Homepage', 'Landing Pages', 'Campaign Pages'],
    documentation: 'https://uto.asu.edu/webspark-2/hero-banner',
    example: 'Large heading + 2-3 sentence description + 1-2 action buttons'
  },
  {
    id: 'content-sections',
    name: 'Content Sections',
    category: 'Layout',
    description: 'Flexible content blocks with heading, body text, and optional media. Supports multiple layouts.',
    useCases: ['About Pages', 'Program Pages', 'General Content'],
    documentation: 'https://uto.asu.edu/webspark-2/content-sections'
  },
  {
    id: 'card-grid',
    name: 'Card Grid',
    category: 'Layout',
    description: '2, 3, or 4 column responsive grid of cards with images, titles, descriptions, and links.',
    useCases: ['Programs', 'Services', 'Team Members', 'News'],
    documentation: 'https://uto.asu.edu/webspark-2/card-arrangements'
  },
  {
    id: 'feature-blocks',
    name: 'Feature Blocks',
    category: 'Layout',
    description: 'Icon + heading + description blocks arranged in grids. Perfect for highlighting key features.',
    useCases: ['Benefits', 'Services', 'Features', 'Statistics'],
    documentation: 'https://uto.asu.edu/webspark-2/feature-blocks'
  },

  {
    id: 'accordion',
    name: 'Accordion',
    category: 'Content',
    description: 'Expandable/collapsible content sections. Great for FAQs and dense information.',
    useCases: ['FAQs', 'Course Details', 'Requirements'],
    documentation: 'https://uto.asu.edu/webspark-2/accordion'
  },
  {
    id: 'tabs',
    name: 'Tabbed Content',
    category: 'Content',
    description: 'Organize related content into horizontal tabs. Reduces page length.',
    useCases: ['Program Options', 'Department Info', 'Multi-category Content'],
    documentation: 'https://uto.asu.edu/webspark-2/tabs'
  },
  {
    id: 'quote-block',
    name: 'Quote Block',
    category: 'Content',
    description: 'Large pull quotes or testimonials with attribution. Visually prominent.',
    useCases: ['Testimonials', 'Student Stories', 'Expert Quotes'],
    documentation: 'https://uto.asu.edu/webspark-2/quote-block'
  },

  {
    id: 'image-gallery',
    name: 'Image Gallery',
    category: 'Media',
    description: 'Lightbox-enabled image galleries. Grid or carousel layouts available.',
    useCases: ['Campus Tours', 'Event Photos', 'Research Images'],
    documentation: 'https://uto.asu.edu/webspark-2/image-gallery'
  },
  {
    id: 'video-embed',
    name: 'Video Embed',
    category: 'Media',
    description: 'Responsive video player for YouTube, Vimeo, or native video files.',
    useCases: ['Program Videos', 'Lectures', 'Testimonials'],
    documentation: 'https://uto.asu.edu/webspark-2/video'
  },
  {
    id: 'media-sidebar',
    name: 'Media + Sidebar',
    category: 'Media',
    description: 'Image or video alongside text content. Configurable left/right positioning.',
    useCases: ['Faculty Profiles', 'Program Overviews', 'News Stories'],
    documentation: 'https://uto.asu.edu/webspark-2/media-sidebar'
  },

  {
    id: 'breadcrumb',
    name: 'Breadcrumb Navigation',
    category: 'Navigation',
    description: 'Hierarchical navigation trail. Auto-generated from page structure.',
    useCases: ['All Pages', 'Deep Navigation'],
    documentation: 'https://uto.asu.edu/webspark-2/breadcrumb'
  },
  {
    id: 'anchor-menu',
    name: 'Anchor Menu',
    category: 'Navigation',
    description: 'Sticky sidebar or top menu linking to page sections. Smooth scroll enabled.',
    useCases: ['Long Pages', 'Documentation', 'Reports'],
    documentation: 'https://uto.asu.edu/webspark-2/anchor-menu'
  },

  {
    id: 'contact-form',
    name: 'Contact Form',
    category: 'Form',
    description: 'Customizable contact forms with spam protection. Integrates with Salesforce.',
    useCases: ['Contact Pages', 'Inquiries', 'Support'],
    documentation: 'https://uto.asu.edu/webspark-2/forms'
  },
  {
    id: 'search-filter',
    name: 'Search & Filter',
    category: 'Interactive',
    description: 'Filterable content lists with search, tags, and category filters.',
    useCases: ['Programs', 'Faculty Directory', 'News Archive'],
    documentation: 'https://uto.asu.edu/webspark-2/search-filter'
  },

  {
    id: 'timeline',
    name: 'Timeline',
    category: 'Interactive',
    description: 'Vertical or horizontal timeline for chronological content.',
    useCases: ['History', 'Milestones', 'Process Steps'],
    documentation: 'https://uto.asu.edu/webspark-2/timeline'
  },
  {
    id: 'data-table',
    name: 'Data Table',
    category: 'Interactive',
    description: 'Sortable, filterable tables. Responsive mobile view.',
    useCases: ['Course Listings', 'Staff Directory', 'Statistics'],
    documentation: 'https://uto.asu.edu/webspark-2/tables'
  },
  {
    id: 'call-to-action',
    name: 'Call to Action Block',
    category: 'Interactive',
    description: 'Prominent CTA with heading, text, and button. Multiple color schemes.',
    useCases: ['Apply Now', 'Donate', 'Register', 'Learn More'],
    documentation: 'https://uto.asu.edu/webspark-2/cta'
  }
];

export const getWebkitsByCategory = (category: DrupalWebkit['category']) => {
  return DRUPAL_WEBKITS.filter(kit => kit.category === category);
};

export const recommendWebkitsForPage = (pageType: string): DrupalWebkit[] => {
  const recommendations: Record<string, string[]> = {
    'home': ['hero-banner', 'feature-blocks', 'card-grid', 'call-to-action'],
    'about': ['content-sections', 'media-sidebar', 'quote-block', 'timeline'],
    'programs': ['hero-banner', 'tabs', 'accordion', 'card-grid'],
    'contact': ['content-sections', 'contact-form', 'media-sidebar'],
    'news': ['card-grid', 'search-filter', 'media-sidebar'],
    'faculty': ['card-grid', 'search-filter', 'media-sidebar'],
  };

  const ids = recommendations[pageType.toLowerCase()] || [];
  return DRUPAL_WEBKITS.filter(kit => ids.includes(kit.id));
};
