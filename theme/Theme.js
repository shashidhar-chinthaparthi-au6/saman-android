// theme/Theme.js
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
    text: 'black',
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#001F3F', // Navy Blue
    text: 'white',
  },
};
