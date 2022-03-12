import Link from 'next/link';
import React from 'react';
import { Button } from '../components/Button';
import { ConversationCard } from '../components/ConversationCard';
import { Header } from '../components/Header';
import Axios from '../core/axios';

export default function Rooms() {
  const [rooms, setRooms] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const { data } = await Axios.get('/rooms.json');
      setRooms(data);
    })();
  });

  return (
    <>
      <Header />
      <div className="container">
        <div className="mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button color="green">+ Start room</Button>
        </div>

        <div className="mt-20">
          {rooms.map((obj) => {
            <Link key={obj.id} href="/rooms/test-room">
              <a>
                <ConversationCard
                  title={obj.title}
                  guests={['Гора', 'Негр']}
                  avatars={[
                    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80',
                    'https://images.unsplash.com/photo-1626820247794-d4facae27c4a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
                  ]}
                  guestsCount={2}
                  speakersCount={2}
                />
              </a>
            </Link>;
          })}
        </div>
      </div>
    </>
  );
}
