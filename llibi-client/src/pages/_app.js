import '@/styles/globals.css'
import '@radix-ui/themes/styles.css'
import { ThemeProvider } from '@material-tailwind/react'

// import { Theme } from '@radix-ui/themes'

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      {/* <Theme> */}
        <Component {...pageProps} />
      {/* </Theme> */}
    </ThemeProvider>
  )
}

/* import 'tailwindcss/tailwind.css'
const App = ({ Component, pageProps }) => <Component {...pageProps} />
export default App
 */
