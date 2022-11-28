import { useEffect, useState } from "react";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const Sizing = z.object({
  desktop: z.object({ width: z.number(), height: z.number() }),
  mobile: z.object({ width: z.number(), height: z.number() }),
});

const Position = z.object({
  desktop: z.object({ right: z.number(), bottom: z.number() }),
  mobile: z.object({ right: z.number(), bottom: z.number() }),
});

const ThemeConfig = z.object({
  isDefault: z.boolean().optional(),
  fonts: z.object({
    primaryFontUrl: z.string(),
    boldFontUrl: z.string(),
    defaultFontUrl: z.string(),
  }),
  images: z.object({
    loadingImage: z.string(),
    heroBanner: z.string(),
    unexpectedErrorIcon: z.string(),
    sessionTimeoutIcon: z.string(),
    macroArticleIcon: z.string(),
  }),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.object({
      main: z.string(),
      light: z.string(),
      accent: z.string(),
      header: z.string(),
      disabled: z.string(),
      element: z.string(),
    }),
    hoverBackground: z.object({
      primaryHover: z.string(),
      secondaryHover: z.string(),
      accentHover: z.string(),
    }),
    messageBackgrounds: z.object({
      outbound: z.string(),
      inbound: z.string(),
    }),
    text: z.object({
      primaryLight: z.string(),
      secondaryLight: z.string(),
      primaryDark: z.string(),
      secondaryDark: z.string(),
      disabled: z.string(),
      buttonRegular: z.string(),
      buttonHover: z.string(),
      error: z.string(),
    }),
    border: z.object({
      default: z.string(),
      dividerOnDark: z.string(),
      active: z.string(),
      error: z.string(),
      disabled: z.string(),
    }),
    controls: z.object({
      uncheckedControl: z.string(),
      inboundChecked: z.string(),
      outboundChecked: z.string(),
      disabledControl: z.string(),
    }),
    launcher: z
      .object({
        background: z.string().optional(),
        hoverBackground: z.string().optional(),
      })
      .optional(),
    link: z.object({
      inboundDefaultLink: z.string(),
      inboundDisabledLink: z.string(),
      inboundHoverLink: z.string(),
      outboundDefaultLink: z.string(),
      outboundDisabledLink: z.string(),
      outboundHoverLink: z.string(),
    }),
    ratingIcon: z.object({
      INBOUND: z.string(),
      OUTBOUND: z.string(),
    }),
    boxShadow: z.string(),
  }),
  text: z.object({
    partnerFriendlyName: z.string(),
    uppercaseButtonText: z.boolean(),
  }),
  launcher: z.object({
    initializeFromLauncher: z.boolean(),
    imageSrc: z.string(),
    position: Position.optional(),
    sizing: Sizing,
  }),
  mainWidget: z
    .object({
      position: Position,
      sizing: Sizing.optional(),
    })
    .optional(),
});

function App() {
  const [widgetIds, setWidgetIds] = useState([
    "rbi_bk_internal",
    "keen_footwear",
    "keen_chat_trial",
    "solostove_us",
    "hum_nutrition",
  ]);
  const [themeConfigs, setThemeConfigs] = useState<Record<string, object>>({});
  const jsonSchema = JSON.stringify(
    zodToJsonSchema(ThemeConfig, "ThemeConfigSchema").definitions
      .ThemeConfigSchema,
    null,
    8
  );
  useEffect(() => {
    (async () => {
      for (const widgetId of widgetIds) {
        const res = await fetch(
          `https://app.gosimplr.com/chat-api/v1/chat/v2/themeConfig?widgetId=${widgetId}&schemaVersion=2`
        );
        const data = await res.json();
        setThemeConfigs((prevState) => ({
          ...prevState,
          [widgetId]: data?.themeConfig,
        }));
      }
    })();
  }, []);
  return (
    <div>
      {widgetIds.map((widgetId) => {
        const result = ThemeConfig.safeParse(themeConfigs[widgetId]);
        let errorText = "";
        if (!result.success) {
          // handle error then return
          errorText = "";
          result.error.issues.forEach((issue) => {
            errorText +=
              "Code: " +
              issue.code +
              "\t\t" +
              " Expected: " +
              //@ts-ignore
              issue.expected +
              "\t\t" +
              " Path: " +
              issue.path.join(".") +
              "\n";
          });
        } else {
          // do something
          errorText = "no error";
        }

        return (
          <div key={widgetId}>
            <h2>{widgetId}</h2>
            <p style={{ whiteSpace: "pre" }}>
              {themeConfigs[widgetId] ? errorText : "Loading..."}
            </p>
          </div>
        );
      })}

      <h1>Here is the schema used</h1>
      <p style={{ whiteSpace: "pre" }}>{jsonSchema}</p>
    </div>
  );
}

export default App;
