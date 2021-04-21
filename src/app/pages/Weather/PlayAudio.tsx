import React from 'react';
import Sound from 'react-sound';

const PlayAudio = props => {
  return (
    <>
      <Sound
        playStatus={Sound.status.PLAYING}
        url={props.soundUrl}
        loop={true}
        playFromPosition={300}
      />
      <audio autoPlay loop>
        <source src={props.soundUrl} type="audio/mp3" />
      </audio>
    </>
  );
};

export default PlayAudio;
