import React from "react";

// Reusable Empty State component for consistent UX across pages
// Props:
// - icon: React component (e.g., from lucide-react)
// - title: string (already translated)
// - description: string (already translated)
// - className: optional additional classes
// - size: 'sm' | 'md' | 'lg' (default 'lg') controls icon and spacing
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  className = "",
  size = "lg",
}) => {
  const sizes = {
    sm: {
      wrapper: "py-8",
      icon: "w-10 h-10",
      title: "text-sm",
      desc: "text-xs",
    },
    md: {
      wrapper: "py-12",
      icon: "w-14 h-14",
      title: "text-base",
      desc: "text-sm",
    },
    lg: {
      wrapper: "py-16",
      icon: "w-16 h-16",
      title: "text-base",
      desc: "text-xs",
    },
  }[size] || {
    wrapper: "py-16",
    icon: "w-16 h-16",
    title: "text-base",
    desc: "text-xs",
  };

  return (
    <div className={`text-center ${sizes.wrapper} m-auto ${className}`}>
      {Icon && (
        <Icon
          className={`${sizes.icon} mx-auto mb-4 text-gray-300 dark:text-gray-600`}
        />
      )}
      {title && <p className={`font-semibold ${sizes.title}`}>{title}</p>}
      {description && (
        <p className={`mt-2 ${sizes.desc} text-gray-500 dark:text-gray-400`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
