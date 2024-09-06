import { OperationType } from "enums";

export type Operation = {
  from?: string;
  op?: string;
  operationType?: OperationType;
  path?: string;
  value?: any;
};
