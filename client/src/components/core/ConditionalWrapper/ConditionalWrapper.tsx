import { Fragment, ReactNode } from "react";

interface Props {
  children: ReactNode;
  condition: any;
  wrapper: (children: ReactNode) => ReactNode;
}

// https://dev.to/dailydevtips1/conditional-wrapping-in-react-46o5
export function ConditionalWrapper({ children, condition, wrapper }: Props) {
  return <Fragment>{condition ? wrapper(children) : children}</Fragment>;
}
