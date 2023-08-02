const { useState, useEffect, useRef } = React;
const { createStore } = Redux;
const { Provider, connect } = ReactRedux;

const defState = {
    session: 25,
    break: 5,
    active: false
}
const stateActions = {
    reset: "RESET",
    sessionInc: "SESSION_INCREMENT",
    sessionDec: "SESSION_DECREMENT",
    breakInc: "BREAK_INCREMENT",
    breakDec: "BREAK_DECREMENT",
    setPlaying: "SET_PLAYING"
}
const reducer = (state = defState, action) => {
    switch(action.type) {
        case stateActions.reset:
            return defState;
        case stateActions.breakInc:
            if (state.break == 60) return {...state, break: 60};
            return {...state, break: state.break + 1};
        case stateActions.breakDec:
            if (state.break == 1) return {...state, break: 1};
            return {...state, break: state.break - 1};
        case stateActions.sessionInc:
            if (state.session == 60) return {...state, session: 60};
            return {...state, session: state.session + 1};
        case stateActions.sessionDec:
            if (state.session == 1) return {...state, session: 1};
            return {...state, session: state.session - 1};
        case stateActions.setPlaying:
            return {...state, active: action.active};
        default:
            return state;
    }
}
const store = createStore(reducer);

const mapStateToProps = (state) => ({
    session: state.session,
    break: state.break,
    isActive: state.active
});

const mapDispatchToProps = {
    reset: () => ({type: stateActions.reset}),
    sessionInc: () => ({type: stateActions.sessionInc}),
    sessionDec: () => ({type: stateActions.sessionDec}),
    breakInc: () => ({type: stateActions.breakInc}),
    breakDec: () => ({type: stateActions.breakDec}),
    setActive: (active) => ({type: stateActions.setPlaying, active })
};

const Settings = (props) => {
    // When not active, not-active class is used and onClick is set to null
    const activeClassName = props.isActive ? "active text-muted" : "not-active";
    return (
        <div className="row gap-3">
            <div className="col d-flex justify-content-end">
                <div>
                    <p id="break-label" className="my-0 text-nowrap">Break Length</p>
                    <div className="d-flex justify-content-center align-items-center">
                        <i id="break-decrement" onClick={props.isActive ? null : props.breakDec} className={`fa-solid fa-arrow-down ${activeClassName}`}></i>
                        <span id="break-length" className="mx-2 user-select-none">{props.break}</span>
                        <i id="break-increment" onClick={props.isActive ? null : props.breakInc} className={`fa-solid fa-arrow-up ${activeClassName}`}></i>
                    </div>
                </div>
            </div>
            <div className="col d-flex justify-content-start">
                <div>
                    <p id="session-label" className="my-0 text-nowrap">Session Length</p>
                    <div className="d-flex justify-content-center align-items-center">
                        <i id="session-decrement" onClick={props.isActive ? null : props.sessionDec} className={`fa-solid fa-arrow-down ${activeClassName}`}></i>
                        <span id="session-length" className="mx-2 user-select-none">{props.session}</span>
                        <i id="session-increment" onClick={props.isActive ? null : props.sessionInc} className={`fa-solid fa-arrow-up ${activeClassName}`}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Timer = (props) => {
    let current = "session"
    const [count, setCount] = useState(props.session * 60);

    const intervalRef = useRef(null); // Ref store the interval so it can be accessed in both startTimer and pauseTimer
    const audioRef = useRef(null); // Used to play the sound when count reaches zero
    const labelRef = useRef(null);
    // useEffect to update count when props.session changes
    useEffect(() => {
        setCount(props.session * 60);
    }, [props.session]);

    // Format time from seconds to mm:ss format
    const formatTime = time => {
        if (time < 1) return "00:00";
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        if (minutes.toString().length == 1) minutes = "0" + minutes;
        if (seconds.toString().length == 1) seconds = "0" + seconds;
        return `${minutes}:${seconds}`;
    }

    const startTimer = () => {
        props.setActive(true);
        // The effect to update the count every second
        intervalRef.current = setInterval(() => {
            setCount(prevCount => {
                if (prevCount > 0) {
                    return prevCount - 1;
                } else {
                    clearInterval(intervalRef.current); // Clear the interval when count reaches 0
                    props.setActive(false);
                    audioRef.current.play();
                    if (current == "session") {
                        prepare("break");
                    }
                    else {
                        prepare("session");
                    }
                }
            });
        }, 1000);
    };

    // type == "session" || "break"
    const prepare = (type) => {
        labelRef.current.innerText = type;
        setCount(props[type] * 60);
        current = type;
        startTimer();
    }

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        props.setActive(false);
    }

    const resetTimer = () => {
        pauseTimer();
        audioRef.current.load(); // Stops the sound and rewinds it
        props.reset();
        labelRef.current.innerText = "session";
        setCount(props.session * 60);
    }

    return (
        <div className="text-center mt-5">
            <h2 id="timer-label" className="h1" ref={labelRef}>session</h2>
            <h2 id="time-left" className="h1">{formatTime(count)}</h2>
            <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
            <Controls isActive={props.isActive} startTimer={startTimer} pauseTimer={pauseTimer} resetTimer={resetTimer} />
        </div>
    );
}

const Controls = (props) => {
    return (
        <div>
            {props.isActive ? (<i id="start_stop" onClick={props.pauseTimer} className="fa-solid fa-pause m-1 pointer"></i>) : (<i id="start_stop" onClick={props.startTimer} className="fa-solid fa-play m-1 pointer"></i>)}
            <i id="reset" onClick={props.resetTimer} className="fa-solid fa-rotate m-1 pointer"></i>
        </div>
    );
}

const Footer = () => {
    return (
        <footer className="position-absolute bottom-0 end-0 w-100">
            <p className="text-center text-md-end my-2 mx-3 text-muted fs-5">Developed by <a className="link" href="https://linktr.ee/jovantomovic" target="_blank">Jovan Tomovic</a></p>
        </footer>
    );
}

const SettingsConnected = connect(mapStateToProps, mapDispatchToProps)(Settings);
const TimerConnected = connect(mapStateToProps, mapDispatchToProps)(Timer);

const App = (props) => {
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div>
                    <h1 className="text-center">25 + 5 Clock</h1>
                    <SettingsConnected />
                    <TimerConnected />
                </div>
            </div>
            <Footer />
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
