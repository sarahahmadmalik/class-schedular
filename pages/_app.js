import '@/styles/globals.css';
import { AppProvider } from '@/Contexts/DataContexts';

export default function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
