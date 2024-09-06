import { DefaultTheme } from "styled-components";

import { Colors } from "colors";

export const DARK_THEME: DefaultTheme = {
  colors: {
    background: {
      cta: {
        modal: {
          cancel: {
            default: Colors.Neutral.GraniteGray,
            hover: Colors.Neutral.SonicSilver,
          },
          delete: {
            default: Colors.Primary.CoralRed,
            hover: Colors.Primary.PastelRed,
          },
        },
        primary: {
          default: Colors.Primary.BrightNavyBlue,
          hover: Colors.Primary.TuftsBlue,
        },
        secondary: {
          default: Colors.Neutral.Platinum,
          hover: Colors.Neutral.ChineseSilver,
        },
      },
      me: Colors.Primary.BrightNavyBlue,
      modal: {
        inner: Colors.Neutral.RaisinBlack,
        outer: Colors.Neutral.SmokyBlack700,
      },
      primary: Colors.Neutral.EerieBlack,
      quaternary: Colors.Neutral.EerieBlack,
      scrollButton: {
        default: Colors.Neutral.JapaneseIndigo,
        hover: Colors.Neutral.PoliceBlue,
      },
      secondary: Colors.Neutral.RaisinBlack,
      tertiary: Colors.Neutral.JapaneseIndigo,
    },
    border: {
      primary: Colors.Neutral.Arsenic,
      secondary: Colors.Neutral.GrayishBlue,
    },
    icon: {
      error: Colors.Primary.CoralRed,
      primary: {
        default: Colors.Neutral.LightGray,
        hover: Colors.Primary.LightGrayishBlue,
      },
      secondary: {
        default: Colors.Neutral.VeryLightGray,
        hover: Colors.Primary.ModerateBlue,
      },
      tertiary: {
        default: Colors.Neutral.Platinum,
        hover: Colors.Neutral.ChineseSilver,
      },
    },
    line: Colors.Neutral.Arsenic,
    loading: Colors.Primary.BrightNavyBlue,
    text: {
      action: {
        delete: {
          default: Colors.Primary.CoralRed,
          hover: Colors.Primary.PastelRed,
        },
        edit: {
          default: Colors.Primary.BrightNavyBlue,
          hover: Colors.Primary.TuftsBlue,
        },
        reply: {
          default: Colors.Primary.BrightNavyBlue,
          hover: Colors.Primary.TuftsBlue,
        },
      },
      comment: {
        dateTime: Colors.Neutral.PhilippineSilver,
        replyToUser: Colors.Primary.BrightNavyBlue,
        score: Colors.Primary.BrightNavyBlue,
        text: Colors.Neutral.Platinum,
        username: Colors.Neutral.LinkWater,
      },
      cta: {
        modal: {
          cancel: Colors.Neutral.White,
          delete: Colors.Neutral.Platinum,
        },
        primary: {
          default: Colors.Neutral.VeryLightGray,
          hover: Colors.Neutral.LightGray,
        },
        secondary: {
          default: Colors.Neutral.JapaneseIndigo,
          hover: Colors.Neutral.PoliceBlue,
        },
      },
      error: {
        description: Colors.Neutral.PhilippineGray,
        title: Colors.Neutral.Platinum,
      },
      loading: Colors.Neutral.Platinum,
      me: Colors.Neutral.Platinum,
      modal: {
        message: Colors.Neutral.PhilippineGray,
        title: Colors.Neutral.Platinum,
      },
      navbar: {
        option: Colors.Neutral.Platinum,
        title: Colors.Neutral.Platinum,
        user: { emailAddress: Colors.Primary.PastelRed },
      },
      notFound: {
        description: Colors.Neutral.PhilippineGray,
        subtitle: Colors.Neutral.Platinum,
        title: Colors.Primary.BrightNavyBlue,
      },
      primary: Colors.Neutral.Platinum,
      quaternary: Colors.Primary.BrightNavyBlue,
      scrollButton: {
        default: Colors.Neutral.VeryLightGray,
        hover: Colors.Neutral.LightGray,
      },
      secondary: Colors.Neutral.LinkWater,
      tertiary: Colors.Neutral.PhilippineSilver,
    },
  },
};

export const LIGHT_THEME: DefaultTheme = {
  colors: {
    background: {
      cta: {
        modal: {
          cancel: {
            default: Colors.Neutral.GrayishBlue,
            hover: Colors.Neutral.LightGray,
          },
          delete: {
            default: Colors.Primary.SoftRed,
            hover: Colors.Primary.PaleRed,
          },
        },
        primary: {
          default: Colors.Primary.ModerateBlue,
          hover: Colors.Primary.LightGrayishBlue,
        },
        secondary: {
          default: Colors.Neutral.VeryLightGray,
          hover: Colors.Neutral.BrightGray,
        },
      },
      me: Colors.Primary.ModerateBlue,
      modal: {
        inner: Colors.Neutral.White,
        outer: Colors.Neutral.Black700,
      },
      primary: Colors.Neutral.VeryLightGray,
      quaternary: Colors.Neutral.LightGray,
      scrollButton: {
        default: Colors.Primary.ModerateBlue,
        hover: Colors.Primary.Toolbox,
      },
      secondary: Colors.Neutral.White,
      tertiary: Colors.Primary.ModerateBlue,
    },
    border: {
      primary: Colors.Neutral.LightGray,
      secondary: Colors.Neutral.DarkBlue,
    },
    icon: {
      error: Colors.Primary.SoftRed,
      primary: {
        default: Colors.Neutral.VeryLightGray,
        hover: Colors.Primary.LightGrayishBlue,
      },
      secondary: {
        default: Colors.Primary.LightGrayishBlue,
        hover: Colors.Primary.ModerateBlue,
      },
      tertiary: {
        default: Colors.Neutral.VeryLightGray,
        hover: Colors.Neutral.BrightGray,
      },
    },
    line: Colors.Neutral.LightGray,
    loading: Colors.Primary.ModerateBlue,
    text: {
      action: {
        delete: {
          default: Colors.Primary.SoftRed,
          hover: Colors.Primary.PaleRed,
        },
        edit: {
          default: Colors.Primary.ModerateBlue,
          hover: Colors.Primary.LightGrayishBlue,
        },
        reply: {
          default: Colors.Primary.ModerateBlue,
          hover: Colors.Primary.LightGrayishBlue,
        },
      },
      comment: {
        dateTime: Colors.Neutral.GrayishBlue,
        replyToUser: Colors.Primary.ModerateBlue,
        score: Colors.Primary.ModerateBlue,
        text: Colors.Neutral.GrayishBlue,
        username: Colors.Neutral.DarkBlue,
      },
      cta: {
        modal: {
          cancel: Colors.Neutral.White,
          delete: Colors.Neutral.LightGray,
        },
        primary: {
          default: Colors.Neutral.LightGray,
          hover: Colors.Neutral.VeryLightGray,
        },
        secondary: {
          default: Colors.Primary.ModerateBlue,
          hover: Colors.Primary.Toolbox,
        },
      },
      error: {
        description: Colors.Neutral.GrayishBlue,
        title: Colors.Neutral.DarkBlue,
      },
      loading: Colors.Neutral.GrayishBlue,
      me: Colors.Neutral.LightGray,
      modal: {
        message: Colors.Neutral.GrayishBlue,
        title: Colors.Neutral.DarkBlue,
      },
      navbar: {
        option: Colors.Neutral.LightGray,
        title: Colors.Neutral.VeryLightGray,
        user: { emailAddress: Colors.Primary.PaleRed },
      },
      notFound: {
        description: Colors.Neutral.GrayishBlue,
        subtitle: Colors.Neutral.DarkBlue,
        title: Colors.Primary.ModerateBlue,
      },
      primary: Colors.Neutral.GrayishBlue,
      quaternary: Colors.Primary.ModerateBlue,
      scrollButton: {
        default: Colors.Neutral.VeryLightGray,
        hover: Colors.Neutral.LightGray,
      },
      secondary: Colors.Neutral.DarkBlue,
      tertiary: Colors.Neutral.GrayishBlue,
    },
  },
};
