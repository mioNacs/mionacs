declare module "animejs" {
  interface AnimeParams {
    targets?: string | Element | Element[] | NodeList | object;
    duration?: number;
    delay?: number | ((el: HTMLElement, i: number) => number);
    easing?: string;
    scale?: number | number[];
    rotateY?: number | number[];
    rotateX?: number | number[];
    translateX?: number | number[];
    translateY?: number | number[];
    opacity?: number | number[];
    width?: string | ((el: HTMLElement) => string);
    borderColor?: string | string[];
    [key: string]: unknown;
  }

  interface AnimeInstance {
    finished: Promise<void>;
  }

  function anime(params: AnimeParams): AnimeInstance;

  export default anime;
}
