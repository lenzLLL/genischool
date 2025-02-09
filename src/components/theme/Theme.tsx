import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import { useSelector } from '@/store/Store';
import { useEffect } from 'react';
import components from './Components';
import typography from './Typography';
import { shadows, darkshadows } from './Shadows';
import { DarkThemeColors } from './DarkThemeColors';
import { LightThemeColors } from './LightThemeColors';
import { baseDarkTheme, baselightTheme } from './DefaultColors';
import * as locales from '@mui/material/locale';

export const BuildTheme = (config: any = {}) => {
  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const darkthemeOptions = DarkThemeColors.find((theme) => theme.name === config.theme);
  const theme = createTheme(
    _.merge({}, baselightTheme, locales, "light", {
      direction: config.direction,
    }),
  );
  theme.components = components(theme);

  return theme;
};

const ThemeSettings = () => {
  // const activDir = useSelector((state: AppState) => state.customizer.activeDir);
  // const activeTheme = useSelector((state: AppState) => state.customizer.activeTheme);
  const theme = BuildTheme({
    theme: "light",
  });
  // useEffect(() => {
  //   document.dir = activDir;
  // }, [activDir]);

  return theme;
};

export { ThemeSettings };
