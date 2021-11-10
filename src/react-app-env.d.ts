/// <reference types="react-scripts" />

type ReactCustomElementProps = Partial<{
  children: React.ReactNode;
  style: React.CSSProperties;
}>;

type ValueOf<T> = T[keyof T];
type TypeGuard<T extends (args: any) => any> = T extends (
  args: any,
) => args is infer R
  ? R
  : any;
type Nullish<T> = {
  [P in keyof T]: T[P] | null;
};
type PartialNullish<T> = Partial<Nullish<T>>;
type Arrayify<T> = {
  [P in keyof T]: T[P][];
};
type Some = string | number | boolean | symbol | bigint | object;
type ThenArgRecursive<T> = T extends PromiseLike<infer U>
  ? ThenArgRecursive<U>
  : T;

declare namespace ReactTypes {
  type onClick<T> = (event: React.MouseEvent<T, MouseEvent>) => void;

  type onChange = (event: onChangeEvent) => void;

  type onMouseEnter = (event: React.MouseEvent<any, MouseEvent>) => void;

  type onMouseLeave = (event: React.MouseEvent<any, MouseEvent>) => void;

  type onKeyDown = (event: keyboardEvent) => void;

  type onChangeEvent = React.ChangeEvent<HTMLInputElement>;

  type keyboardEvent = React.KeyboardEvent<HTMLInputElement>;

  type value = string | number | string[];
}
