import { z, ZodFormattedError } from "zod";

const Sizing = z.object({
  desktop: z.object({ width: z.number(), height: z.number() }),
  mobile: z.object({ width: z.number(), height: z.number() }),
});

const Position = z.object({
  desktop: z.object({ right: z.number(), bottom: z.number() }).strict(),
  mobile: z.object({ right: z.number(), bottom: z.number() }).strict(),
});

const Color = z
  .string()
  .regex(/(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\)]*\)/i);

const URL = z
  .string()
  .regex(
    /https:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i
  );

export const ThemeConfig = z
  .object({
    isDefault: z.boolean().optional(),
    fonts: z
      .object({
        primaryFontUrl: URL,
        boldFontUrl: URL,
        defaultFontUrl: URL,
      })
      .strict(),
    images: z
      .object({
        loadingImage: URL,
        heroBanner: URL,
        unexpectedErrorIcon: URL,
        sessionTimeoutIcon: URL,
        macroArticleIcon: URL,
        tooltip: URL.optional(),
      })
      .strict(),
    colors: z
      .object({
        primary: Color,
        secondary: Color,
        background: z
          .object({
            main: Color,
            light: Color,
            accent: Color,
            header: Color,
            disabled: Color,
            element: Color,
          })
          .strict(),
        hoverBackground: z
          .object({
            primaryHover: Color,
            secondaryHover: Color,
            accentHover: Color,
          })
          .strict(),
        messageBackgrounds: z
          .object({
            outbound: Color,
            inbound: Color,
          })
          .strict(),
        text: z
          .object({
            primaryLight: Color,
            secondaryLight: Color,
            primaryDark: Color,
            secondaryDark: Color,
            disabled: Color,
            buttonRegular: Color,
            buttonHover: Color,
            error: Color,
          })
          .strict(),
        border: z
          .object({
            default: Color,
            dividerOnDark: Color,
            active: Color,
            error: Color,
            disabled: Color,
          })
          .strict(),
        controls: z
          .object({
            uncheckedControl: Color,
            inboundChecked: Color,
            outboundChecked: Color,
            disabledControl: Color,
          })
          .strict(),
        launcher: z
          .object({
            background: Color.optional(),
            hoverBackground: Color.optional(),
          })
          .strict()
          .optional(),
        link: z
          .object({
            inboundDefaultLink: Color,
            inboundDisabledLink: Color,
            inboundHoverLink: Color,
            outboundDefaultLink: Color,
            outboundDisabledLink: Color,
            outboundHoverLink: Color,
          })
          .strict(),
        ratingIcon: z
          .object({
            INBOUND: Color,
            OUTBOUND: Color,
          })
          .strict(),
        boxShadow: Color,
      })
      .strict(),
    text: z
      .object({
        partnerFriendlyName: z.string(),
        uppercaseButtonText: z.boolean(),
        routeToAgentMessage: z.string().optional(),
      })
      .strict(),
    launcher: z
      .object({
        initializeFromLauncher: z.boolean(),
        imageSrc: URL,
        position: Position.optional(),
        sizing: Sizing,
      })
      .strict(),
    mainWidget: z
      .object({
        position: Position,
        sizing: Sizing.optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

export const zErrorFormatter = (
  error: ZodFormattedError<z.infer<typeof ThemeConfig>>,
  depth = 0,
  finalStrs = [],
  curKey = "Global"
) => {
  Object.entries(error).forEach(([key, val]) => {
    if (key === "_errors") {
      finalStrs.push(
        // @ts-expect-error
        "       ".repeat(depth) +
          " " +
          curKey +
          " -- " +
          // @ts-expect-error
          (val.join(", ") || "No error")
      );
    } else {
      // @ts-expect-error
      zErrorFormatter(error[key], depth + 1, finalStrs, key);
    }
  });
  return finalStrs.join("\n");
};

export const initialThemeConfigStr = `colors: {
  primary: '#000000',
  secondary: '#60269E',


  background: {
    main: '#FFFFFF',
    light: '#FFFFFFF',
    accent: '#60269E’,
    disabled: '#EDEDED',
    element: '#EDEDED',
    header: '#000000’,
  },


  hoverBackground: {
    primaryHover: '#F1E9F9’,
    secondaryHover: '#292929',
    accentHover: '#7947AD',
  },


  messageBackgrounds: {
    outbound: '#F4F4F4',
    inbound: '#60269E',
  },


  text: {
    primaryDark: '#000000',
    secondaryDark: '#757575',
    primaryLight: '#FFFFFF',
    secondaryLight: '#E4CBFF',
    disabled: '#ACACAC',
    buttonRegular: '#60269E',
    buttonHover: '#7947AD',
    error: '#FF6D6D',
    qr: '#60269E',
  },


  border: {
    default: '#D4D4D4’,
    active: '#60269E’,
    disabled: '#D4D4D4’,
    error: '#FF6D6D’,
    dividerOnDark: '#7947AD’,
  },


  controls: {
    uncheckedControl: ‘#ACACAC’,
    inboundChecked: '#FFFFFF’,
    outboundChecked: '#60269E’,
    disabledControl: '#D4D4D4’,
  },
  
  
  ratingIcon: {
    INBOUND: '#F9D51C’,
    OUTBOUND: '#000000’,
  },


  launcher: {
    background: ‘#60269E’,
    hoverBackground: ‘#7947AD’,
    imageSrc: ,
    initializeFromLauncher: true,
    boxShadow: '0px 12px 16px 0px ##40166D (24%)',
  },


 link: {       inboundDefaultLink: '#FFFFFF',       outboundDefaultLink: '#3115F2’,
    inboundHoverLink: '#FFFFFF',       outboundHoverLink: '#21137A’,
    inboundDisabledLink: '#FFFFFF (56%)’,       outboundDisabledLink: '#5C5C5C’,
  },


  accent: {
    preTransitAccent: '#EF6C00', 
    inTransitAccent: '#512DA8’,
    successAccent: '#388E3C’,
    noInfoAccent: '#757575’,
  },


  system: {
    errorIcon: '#EC5427', 
    errorHoverIcon: '#DA3F11’,
  },

}`;
