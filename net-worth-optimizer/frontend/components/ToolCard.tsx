'use client';

import Link from 'next/link';

interface ToolCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}

export default function ToolCard({
  href,
  icon,
  title,
  description,
  features,
  gradientFrom,
  gradientTo,
  borderColor,
}: ToolCardProps) {
  return (
    <Link
      href={href}
      className={`group block bg-gradient-to-br ${gradientFrom} ${gradientTo} border ${borderColor} rounded-xl p-6 hover:scale-[1.02] transition-all duration-200 hover:shadow-xl`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
        {title}
      </h3>
      <p className="text-gray-300 text-sm mb-4">{description}</p>
      <ul className="space-y-1">
        {features.map((feature, idx) => (
          <li key={idx} className="text-xs text-gray-400 flex items-center gap-2">
            <span className="text-green-400">+</span>
            {feature}
          </li>
        ))}
      </ul>
    </Link>
  );
}
