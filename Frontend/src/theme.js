// theme.js

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"; // import utility for setting light and dark mode props

// 2. Add your color mode config import utility for setting light and dark mode props

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  tab: {
    fontWeight: "semibold", // change the font weight
  },
  tabpanel: {
    fontFamily: "mono", // change the font family
  },
});

// define custom sizes
const sizes = {
  xl: definePartsStyle({
    // define the parts that will change for each size
    tab: {
      fontSize: "xl",
      py: "4",
      px: "6",
    },
    tabpanel: {
      py: "4",
      px: "6",
    },
  }),
};

// define custom variants
const colorfulVariant = definePartsStyle((props) => {
  const { colorScheme: c } = props; // add colorScheme as a prop

  return {
    tab: {
      border: "2px solid",
      borderColor: "transparent",
      bg: mode("#fff", "gray.800")(props),
      borderTopRadius: "lg",
      borderBottom: "none",
      _selected: {
        bg: mode(`${c}.300`, `${c}.600`)(props),
        color: mode(`${c}.900`, `${c}.100`)(props),
        borderColor: "inherit",
        borderBottom: "none",
        mb: "-2px",
      },
    },
    tablist: {
      borderBottom: "2x solid",
      borderColor: "inherit",
    },
    tabpanel: {
      border: "2px solid",
      borderColor: "inherit",
      borderBottomRadius: "lg",
      borderTopRightRadius: "lg",
    },
  };
});

const variants = {
  colorful: colorfulVariant,
};

// define which sizes, variants, and color schemes are applied by default
const defaultProps = {
  size: "xl",
  variant: "colorful",
  colorScheme: "green",
};

const tabsTheme = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants,
  defaultProps,
});

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// 3. extend the theme
const theme = extendTheme({
  components: {
    Tabs: tabsTheme,
  },
  config,
});

export default theme;
