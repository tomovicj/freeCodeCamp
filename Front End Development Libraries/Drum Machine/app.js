const { useEffect, useState } = React;
const SOUNDS = [
  {
    keyboardKey: "Q",
    name: "Heater 1",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3"
  },
  {
    keyboardKey: "W",
    name: "Heater 2",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3"
  },
  {
    keyboardKey: "E",
    name: "Heater 3",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3"
  },
  {
    keyboardKey: "A",
    name: "Heater 4",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3"
  },
  {
    keyboardKey: "S",
    name: "Clap",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3"
  },
  {
    keyboardKey: "D",
    name: "Open-HH",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3"
  },
  {
    keyboardKey: "Z",
    name: "Kick-n'-Hat",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3"
  },
  {
    keyboardKey: "X",
    name: "Kick",
    src: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3"
  },
  {
    keyboardKey: "C",
    name: "Closed-HH",
    src: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3"
  },
];

const Display = (props) => {
  return (
    <div id="display">{props.name}</div>
  );
}
const Pad = (props) => {
  const playSound = (event) => {
    const validKeys = ["Q", "W", "E", "A", "S", "D", "Z", "X", "C"];
    let audio;
    if (event.type == "click") {
      audio = event.target.querySelector("audio"); 
    }
    if (event.type == "keydown" && validKeys.includes(event.key.toUpperCase())) {
      audio = document.getElementById(event.key.toUpperCase());
    }
    if (audio != undefined) {
      audio.play();
      audio.parentNode.classList.add("active");
      props.setState(audio.parentNode.id.replace("_", " "));
    }
  }

  const handleEnd = (event) => {
    event.target.parentNode.classList.remove("active");
    props.setState("");
  }

  useEffect(() => {
    const pad = document.getElementById(props.name.replace(" ", "_"));
    // Add event listeners when the component mounts
    pad.addEventListener('click', playSound);
    document.addEventListener('keydown', playSound);

    // Remove event listeners when the component unmounts
    return () => {
      pad.removeEventListener('click', (event) => playSound(event, props.setState));
      document.removeEventListener('keydown', (event) => playSound(event, props.setState));
    };
  }, []);

  return (
    <div className="drum-pad" id={props.name.replace(" ", "_")}>
      {props.keyboardKey}
      <audio src={props.src} onEnded={handleEnd} id={props.keyboardKey} className="clip" />
    </div>
  );
}
const Footer = (props) => {
  return (
    <footer>Developed by <a href="https://linktr.ee/jovantomovic" target="_blank">Jovan Tomovic</a></footer>
  );
}
const Drum = (props) => {
  const [state, setState] = useState("");
  const pads = SOUNDS.map(sound => (<Pad {...sound} key={sound.keyboardKey} setState={setState} />));
  return (
    <div id="drum-machine">
      <Display name={state} />
      <hr />
      <div id="pads">
        {pads}
      </div>
      <hr />
      <Footer />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Drum />);
