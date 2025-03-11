import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
      },
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export default theme;
