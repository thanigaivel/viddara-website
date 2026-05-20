declare module 'velocity-animate' {
  type VelocityProperties = Record<string, unknown>;
  type VelocityOptions = Record<string, unknown>;

  function Velocity(
    elements: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
    properties: VelocityProperties,
    options?: VelocityOptions
  ): void;

  export = Velocity;
}
