// Replaces the frosted-glass web component (archived; it was loaded unpinned from unpkg)
// with CSS backdrop-filter (see .frosted in index.css). It keeps the old markup shape,
// an outer element with the page's class plus an inner .glass-content, so the
// existing component CSS (.trip-card .glass-content, ...) still applies.
//   <Glass className="trip-card" overlayColor="rgba(255, 255, 255, 0.5)" blurAmount="1.6rem">
import React from 'react';

export default function Glass({
  className = '',
  overlayColor,
  blurAmount,
  style,
  children,
  ...rest
}) {
  const vars = {};
  if (overlayColor) vars['--glass-overlay'] = overlayColor;
  if (blurAmount) vars['--glass-blur'] = blurAmount;
  return (
    <div className={`frosted ${className}`.trim()} style={{ ...vars, ...style }} {...rest}>
      <div className="glass-content">{children}</div>
    </div>
  );
}
