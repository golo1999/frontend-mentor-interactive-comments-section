export type TypeText = {
  action: TypeTextAction;
  comment: TypeTextComment;
  cta: TypeTextCta;
  error: TypeTextError;
  loading: string;
  me: string;
  modal: TypeTextModal;
  navbar: TypeTextNavbar;
  notFound: TypeTextNotFound;
  primary: string;
  quaternary: string;
  scrollButton: TypeTextScrollButton;
  secondary: string;
  tertiary: string;
};

type TypeTextAction = {
  delete: TypeTextActionState;
  edit: TypeTextActionState;
  reply: TypeTextActionState;
};

interface TypeTextActionState {
  default: string;
  hover: string;
}

type TypeTextComment = {
  dateTime: string;
  replyToUser: string;
  score: string;
  text: string;
  username: string;
};

type TypeTextCta = {
  modal: TypeTextCtaModal;
  primary: TypeTextCtaState;
  secondary: TypeTextCtaState;
};

interface TypeTextCtaModal {
  cancel: string;
  delete: string;
}

interface TypeTextCtaState {
  default: string;
  hover: string;
}

interface TypeTextError {
  description: string;
  title: string;
}

interface TypeTextModal {
  message: string;
  title: string;
}

type TypeTextNavbar = {
  option: string;
  title: string;
  user: TypeTextNavbarUser;
};

interface TypeTextNavbarUser {
  emailAddress: string;
}

type TypeTextNotFound = {
  description: string;
  subtitle: string;
  title: string;
};

type TypeTextScrollButton = {
  default: string;
  hover: string;
};
