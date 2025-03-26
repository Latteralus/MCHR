// pages/_app.js
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { session, ...restPageProps } = pageProps;

  return (
    <SessionProvider session={session}>
      <Component {...restPageProps} />
    </SessionProvider>
  );
}

export default MyApp;