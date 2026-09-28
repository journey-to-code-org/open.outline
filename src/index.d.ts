export interface Heading {
  level: number;
  text: string;
  id?: string;
  [key: string]: unknown;
}

export type OutlineItem<T extends Heading = Heading> = T & {
  children: OutlineItem<T>[];
};

export interface FlattenOptions {
  includeChildren?: boolean;
}

export function buildOutline<T extends Heading>(
  headings: readonly T[]
): OutlineItem<T>[];

export function flattenOutline<T extends Heading>(
  outline: readonly OutlineItem<T>[],
  options?: FlattenOptions
): Array<T | OutlineItem<T>>;

export function getOutlineDepth<T extends Heading>(
  outline: readonly OutlineItem<T>[]
): number;

export function countOutlineItems<T extends Heading>(
  outline: readonly OutlineItem<T>[]
): number;
