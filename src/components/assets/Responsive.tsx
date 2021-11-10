import React, { useEffect, useState } from 'react';

interface ResponsiveProps {
  small: React.ComponentElement<any, any>;
  big: React.ComponentElement<any, any>;
  breakpoint?: number;
  pure?: boolean;
}

export default function Responsive(props: ResponsiveProps) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const mediaQuery = window.matchMedia(
    `(max-width: ${props.breakpoint || '768'}px)`,
  );
  const handleMediaQueryChange = (mediaQueryProps: any): void => {
    if (mediaQueryProps.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  useEffect(() => {
    try {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } catch (e) {
      mediaQuery.addListener(handleMediaQueryChange);
    }

    handleMediaQueryChange(mediaQuery);

    return function cleanup(): void {
      try {
        mediaQuery.removeEventListener('change', handleMediaQueryChange);
      } catch (e) {
        mediaQuery.removeListener(handleMediaQueryChange);
      }
    };
  });

  return props.pure ? (
    isSmallScreen ? (
      props.small
    ) : (
      props.big
    )
  ) : (
    <div style={{ height: '100%', width: '100%' }}>
      {isSmallScreen ? props.small : props.big}
    </div>
  );
}
