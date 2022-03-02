import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { WelcomeStep } from '../components/steps/WelcomeStep/'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Clubhouse</title>
      </Head>

      <WelcomeStep />
    </div>
  );
}
