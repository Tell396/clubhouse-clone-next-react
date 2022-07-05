import React from 'react';

import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { TwitterStep } from '../components/steps/TwitterStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';

const stepsComponents = {
  0: WelcomeStep,
  1: TwitterStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

export const MainContext = React.createContext<MainContextProps>({} as MainContextProps);

type MainContextProps = {
  step: number;
  onNextStep: () => void;
  userData: User;
  setUserData: React.Dispatch<React.SetStateAction<User>>;
  setFieldValue: (field: keyof User, value: string) => void
};

type User = {
  id: number;
  fullname: string;
  avatarUrl: string;
  isActive: number;
  username: string;
  phone: string;
};


export default function Home() {
  const [step, setStep] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<User>();
  const Step = stepsComponents[step];
  
  console.log(userData)

  const onNextStep = () => {
    setStep((prev) => prev + 1);
  };

  const setFieldValue = (field, value: string) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <MainContext.Provider value={{ step, onNextStep, userData, setUserData, setFieldValue }}>
      <Step />
    </MainContext.Provider>
  );
}
