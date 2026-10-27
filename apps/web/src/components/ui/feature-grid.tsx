"use client"

import { useId, type ReactNode } from 'react';

export interface FeatureGridProps {
  heading?: string;
  subheading?: string;
  className?: string;
}

const features: { title: string; description: string; icon: ReactNode }[] = [
  {
    title: 'Prompt to production TSX',
    description:
      'Describe the interface you need and get a typed React component, props interface, and Tailwind layout ready to land in a production codebase.',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        className='h-6 w-6'
      >
        <path d='M8 8 4.5 12 8 16' />
        <path d='m16 8 3.5 4-3.5 4' />
        <path d='m13 6-2 12' />
      </svg>
    ),
  },
  {
    title: 'Own the source shadcn-style copy into project',
    description:
      'Generated files are copied into your repository, so you can read, edit, and version the source the same way you own shadcn components.',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        className='h-6 w-6'
      >
        <path d='M4 7.5A1.5 1.5 0 0 1 5.5 6H9l2 2h7.5A1.5 1.5 0 0 1 20 9.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18z' />
        <path d='M12 11v6' />
        <path d='m9.5 14.5 2.5 2.5 2.5-2.5' />
      </svg>
    ),
  },
  {
    title: 'CLI and MCP for coding agents',
    description:
      'Generate and refine components from the terminal or over MCP so coding agents can work inside your repository with the same ui-gen workflow.',
    icon: (
      <svg
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.75'
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
        className='h-6 w-6'
      >
        <rect x='3' y='4' width='18' height='14' rx='2' />
        <path d='m7 9 2.5 2L7 13' />
        <path d='M12 13h5' />
        <path d='M8 21h8' />
        <path d='M12 18v3' />
      </svg>
    ),
  },
];

export function FeatureGrid({
  heading = 'From prompt to components you own',
  subheading = 'ui-gen writes production TSX, copies shadcn-style source into your project, and stays available to coding agents through the CLI and MCP.',
  className,
}: FeatureGridProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={['bg-zinc-50 text-zinc-950', className].filter(Boolean).join(' ')}
    >
      <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8'>
        <header className='max-w-2xl'>
          <p className='text-sm font-semibold tracking-wide text-zinc-500'>ui-gen</p>
          <h2
            id={headingId}
            className='mt-2 text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl'
          >
            {heading}
          </h2>
          <p className='mt-4 text-base leading-7 text-zinc-600'>{subheading}</p>
        </header>
        <ul className='mt-12 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature) => (
            <li key={feature.title} className='min-w-0'>
              <article className='flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm'>
                <div className='mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-semibold tracking-tight text-zinc-950'>
                  {feature.title}
                </h3>
                <p className='mt-2 text-sm leading-6 text-zinc-600'>{feature.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
