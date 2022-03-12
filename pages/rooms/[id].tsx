import { useRouter } from 'next/router';
import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  return (
    <>
      <Header />

      <div className="container mt-40">
        <BackButton title={'All rooms'} href={'/rooms'} />
      </div>
      <Room title={'Думы'} />
    </>
  );
}
