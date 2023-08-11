const { useState, useEffect, useRef } = React;
// const { createStore } = Redux;
// const { Provider, connect } = ReactRedux;


const Calculator = () => {
    const buttons = [
        ["/", "divide"],
        ["X", "multiply"],
        ["7", "seven"],
        ["8", "eight"],
        ["9", "nine"],
        ["-", "subtract"],
        ["4", "four"],
        ["5", "five"],
        ["6", "six"],
        ["+", "add"],
        ["1", "one"],
        ["2", "two"],
        ["3", "three"],
        ["0", "zero"],
        [".", "decimal"]
    ];

    const [arr, setArr] = useState([]);
    const [last, setLast] = useState("0");

    const handleChange = (value) => {
        setArr(current => [...current, last]);
        setLast(value);
    }

    const handleInput = (event) => {
        if (event.target.innerText === ".") {
            if (last.includes(".")) return;
            if (!/\d/.test(last)) handleChange("0.");
            else setLast(current => current + ".");
        }
        else if (/\d/.test(last)) {  // If last is a number
            if (last[0] === "0" && last[1] != ".") setLast(event.target.innerText);  // Replace first zero in a number if not decimal number eg. 0.28
            else setLast(current => current + event.target.innerText);

        }
        else if (!/\d/.test(last)) {

        }
    }

    const reset = () => {
        setArr([]);
        setLast("0");
    }

    const backsapce = () => {
        if (last.length > 1) setLast(current => current.slice(0, -1));
        else setLast("0");
    }

    // useEffect(() => {console.log(last)}, [last]);
    
    return (
        <div id="calculator">
            <div id="display">{last}</div>
            <button onClick={reset} id="clear">AC</button>
            <button onClick={backsapce} id="backsapce"><i className="fa-solid fa-delete-left"></i></button>
            {buttons.map(value => (<button onClick={handleInput} id={value[1]} key={value[1]}>{value[0]}</button>))}
            <button onClick="" id="equals">=</button>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);
