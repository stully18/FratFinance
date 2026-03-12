'use client';

import Link from 'next/link';

interface ToolCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  gradientFrom?: string;
  gradientTo?: string;
  borderColor?: string;
}

export default function ToolCard({
  href,
  icon,
  title,
  description,
  features,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-all duration-200"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-zinc-50 mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-zinc-400 text-sm mb-4">{description}</p>
      <ul className="space-y-1.5">
        {features.map((feature, idx) => (
          <li key={idx} className="text-xs text-zinc-500 flex items-center gap-2">
            <span className="text-blue-500">+</span>
            {feature}
          </li>
        ))}
      </ul>
    </Link>
  );
}
