export type ExpertiseItem = {
  iconIndex: number;
  title: string;
  description: string;
};

export const expertiseItems: ExpertiseItem[] = [
  {
    iconIndex: 0,
    title: 'Frontend Engineering',
    description:
      'Pixel-perfect UIs with React, TypeScript, and immersive experiences on the modern web.',
  },
  {
    iconIndex: 1,
    title: 'Backend Architecture',
    description:
      'Scalable APIs, services, and real-time systems built for performance and reliability at any scale.',
  },
  {
    iconIndex: 2,
    title: 'AI Integration',
    description:
      'Practical LLM integrations, intelligent pipelines, and automation embedded in production apps.',
  },
  {
    iconIndex: 3,
    title: 'Performance & scale',
    description:
      'Deep optimisation—from LCP and bundle strategy to data layers and maintainable architecture.',
  },
];
