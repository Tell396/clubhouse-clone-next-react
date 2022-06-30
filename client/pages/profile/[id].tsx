import { useRouter } from 'next/router';
import React from 'react';
import { Header } from '../../components/Header';
import { Profile } from '../../components/Profile';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Header />
      <div className="container mt-40">
        <Profile
          avatarUrl="https://i.pinimg.com/originals/b6/a2/bf/b6a2bfae90ff4c3fed3e1f1088070e04.jpg"
          fullname="Zubenko Mihail"
          username={id}
          about="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae mauris sed massa auctor venenatis ac id nibh. Etiam ligula nibh, maximus et scelerisque quis, facilisis vitae orci. Sed efficitur hendrerit leo id efficitur. Etiam mi dui, pretium vitae velit ut, tristique ultricies urna. Ut at nunc vitae metus pharetra sagittis. Pellentesque et malesuada risus. Vestibulum blandit, lorem sed facilisis egestas, dui ante iaculis ligula, ut porttitor magna massa sit amet ex. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc at tempus quam, vel cursus nibh. Phasellus nec varius ligula.
          "
        />
      </div>
    </>
  );
}
