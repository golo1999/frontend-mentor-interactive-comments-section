export type TypeBackground = {
  cta: TypeBackgroundCta;
  me: string;
  modal: TypeBackgroundModal;
  primary: string;
  quaternary: string;
  scrollButton: TypeBackgroundState;
  secondary: string;
  tertiary: string;
};

type TypeBackgroundCta = {
  modal: TypeBackgroundCtaModal;
  primary: TypeBackgroundState;
  secondary: TypeBackgroundState;
};

type TypeBackgroundCtaModal = {
  cancel: TypeBackgroundState;
  delete: TypeBackgroundState;
};

interface TypeBackgroundModal {
  inner: string;
  outer: string;
}

interface TypeBackgroundState {
  default: string;
  hover: string;
}
