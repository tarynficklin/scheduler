// Replaces react-fade-in (unmaintained): each child fades and slides in, one after
// another, with a CSS animation (see .fade-in in index.css). Same props as before:
//   delay               ms between children (default 50)
//   transitionDuration  ms per child (default 400)
import React, { Children } from 'react';

export default function FadeIn({ delay = 50, transitionDuration = 400, className, childClassName, children }) {
  const step = Number(delay) || 0;
  const duration = Number(transitionDuration) || 0;
  return (
    <div className={className}>
      {Children.map(children, (child, i) =>
        child === null || child === undefined || child === false ? null : (
          <div
            className={childClassName ? `fade-in ${childClassName}` : 'fade-in'}
            style={{ animationDuration: `${duration}ms`, animationDelay: `${step * (i + 1)}ms` }}
          >
            {child}
          </div>
        )
      )}
    </div>
  );
}
