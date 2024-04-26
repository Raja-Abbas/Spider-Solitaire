import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import Undo1 from '../assets/undoImage.png';
import Star from '../assets/StarImage.png';
import Image from '../assets/Image4.png'

function MyTimer({ expiryTimestamp }) {
  const {
    seconds,
    minutes,
    hours,
    pause,
    resume,
    restart,
  } = useTimer({ expiryTimestamp, onExpire: () => handleExpire() });

  const [timerExpired, setTimerExpired] = useState(false);
  const [backgroundStyle, setBackgroundStyle] = useState(''); // State to store background styles
  const [backgroundStyle2, setBackgroundStyle2] = useState(''); // State to store background styles

  const handleExpire = () => {
    setTimerExpired(true);
  };

  const handleRestart = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + 60);
    restart(time);
    setTimerExpired(false); 
  };

  const handleNewGame = () => {
    window.location.reload(); 
  };

  const handleExit = () => {
    window.history.back();
  };

  const handlePause = () => {
    // Add background styles when paused
    setBackgroundStyle('bg-gray-900 bg-opacity-75 z-50 w-screen h-screen absolute top-0 right-0');
    setBackgroundStyle2('w-[150px] ml-auto m-2');
    pause();
  };

  const handleResume = () => {
    // Remove background styles when resumed
    setBackgroundStyle('');
    setBackgroundStyle2('');
    resume();
  };

  return (
    <div className={`w-[100%] ${backgroundStyle}`}>
      {timerExpired ? (
        <div className='popup m-0 p-0 absolute h-screen w-screen bg-black text-white left-0 flex flex-col text-center justify-center overflow-hidden z-[10000]'>
          <img className='w-30 h-40 m-auto mb-0 mt-0' src={Image} alt=""/>
          <div className='text-[30px] italic'>Good game!</div>
          <div className='text-[40px] italic mb-10'>Your time is up!</div>
          <button onClick={handleNewGame} className='w-max mx-auto hover:p-2 hover:bg-white hover:underline transition-all text-[20px] italic mb-5 text-orange-500'>New Game</button>
          <button onClick={handleRestart} className='w-max mx-auto hover:p-2 hover:bg-white hover:underline transition-all text-[20px] italic mb-5 text-orange-500'>Restart</button>
          <button onClick={handleExit} className='w-max mx-auto hover:p-2 hover:bg-white hover:underline transition-all text-[20px] italic mb-5 text-orange-500'>Exit Game</button>
        </div>
      ) : (
        <div className={`${backgroundStyle2} mt-5 w-[150px] shadow-2xl border-4 border-cyan-800 p-2 bg-black text-white z-10000 m-2 rounded-xl flex flex-col justify-center`} style={{textAlign: 'center'}}>
          <div className='font-bold mb-4' style={{fontSize: '30px'}}>
            <span>{hours}</span>:
<span>{minutes}</span>:

<span>{seconds}</span>
</div>
<div className='flex flex-col justify-center font-bold'>
<button className='hover:underline transition-all text-[20px] italic mb-3 text-orange-500' onClick={handlePause}>Pause</button>
<button className='hover:underline transition-all text-[20px] italic mb-3 text-orange-500' onClick={handleResume}>Resume</button>
</div>
{/* <div className='flex justify-center'>
<div className='cursor-pointer'>
<img className='w-10 h-auto' src={Star} alt='Star Image'/>
<p>Stars</p>
</div>
</div> */}
</div>
)}
</div>
);
}

export default function App() {
const time = new Date();
time.setSeconds(time.getSeconds() + 900);

return (
<div>
<MyTimer expiryTimestamp={time} />
</div>
);
}