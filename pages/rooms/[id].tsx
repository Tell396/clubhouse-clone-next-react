import { useRouter } from 'next/router';
import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import Axios from '../../core/axios';

export default function ProfilePage({ room }) {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header />

      <div className="container mt-40">
        <BackButton title={'All rooms'} href={'/rooms'} />
      </div>
      <Room title={room.title} />
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const { data } = await Axios.get('/rooms.json');
    const roomId = ctx.query.id;
    const room = data.find((obj) => obj.id === '6069d72643dbf66bb5af225a');

    return {
      props: {
        room,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {
        rooms: [],
      },
    };
  }
};
