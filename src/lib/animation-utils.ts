export async function revealTextChars(element: HTMLElement) {
  const { animate, stagger } = await import('animejs');
  const text = element.textContent || '';
  element.innerHTML = text
    .split('')
    .map((c) =>
      `<span style="opacity:0;display:inline-block">${c === ' ' ? '&nbsp;' : c}</span>`
    )
    .join('');

  animate(Array.from(element.querySelectorAll('span')), {
    opacity: [0, 1],
    translateY: [15, 0],
    delay: stagger(25),
    duration: 500,
    ease: 'outQuad',
  });
}

export async function velocityTransition(
  element: HTMLElement,
  properties: Record<string, unknown>,
  options?: Record<string, unknown>
) {
  if (typeof window === 'undefined') return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Velocity = (await import('velocity-animate') as any).default ?? (await import('velocity-animate') as any);
    Velocity(element, properties, { duration: 300, queue: false, ...options });
  } catch {
    // Fallback: apply styles directly
    Object.entries(properties).forEach(([key, value]) => {
      (element.style as unknown as Record<string, unknown>)[key] = value;
    });
  }
}
