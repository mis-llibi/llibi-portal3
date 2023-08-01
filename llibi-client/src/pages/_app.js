import '@/styles/globals.css'
import { ThemeProvider } from '@material-tailwind/react'

export default function MyApp({ Component, pageProps }) {
    return (
        <ThemeProvider>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

/* import 'tailwindcss/tailwind.css'
const App = ({ Component, pageProps }) => <Component {...pageProps} />
export default App
 */
