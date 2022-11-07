import 'styled-components';
interface IPalette {
  main: string
  contrastText: string
}
declare module 'styled-components' {
  export interface DefaultTheme {
    borderRadius: string
    palette: {
      common: {
        darkGray: string
        white: string
      }
      primary: IPalette
   }
  }
}