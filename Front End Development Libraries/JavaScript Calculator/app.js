const { useState, useEffect } = React;

const Display = (props) => {
    return (
        <div id="screen">
            {props.equation.length > 1 || (props.equation.length && props.equation[0] != "") ? (<p id="equation">{props.equation.join("")}</p>) : <Credits />}
            <p id="display">{props.last === "" ? props.equalTo : props.last}</p>
        </div>
    );
}

const KeyPad = React.memo((props) => {
     // Define the symbols and their corresponding names for the buttons
    const buttons = [
        { symbol: "/", name: "divide" },
        { symbol: "*", name: "multiply" },
        { symbol: "7", name: "seven" },
        { symbol: "8", name: "eight" },
        { symbol: "9", name: "nine" },
        { symbol: "-", name: "subtract" },
        { symbol: "4", name: "four" },
        { symbol: "5", name: "five" },
        { symbol: "6", name: "six" },
        { symbol: "+", name: "add" },
        { symbol: "1", name: "one" },
        { symbol: "2", name: "two" },
        { symbol: "3", name: "three" },
        { symbol: "0", name: "zero" },
        { symbol: ".", name: "decimal" }
    ];

    return(
        <div id="keypad">
            <button onClick={props.clear} id="clear" className="button">AC</button>
            <button onClick={props.backsapce} id="backsapce" className="button"><i className="fa-solid fa-delete-left"></i></button>
            {buttons.map(button => (<button onClick={props.handleInput} id={button.name} className="button" key={button.name}>{button.symbol}</button>))}
            <button onClick={props.equal} id="equals" className="button">=</button>
        </div>
    );
});

// Credits component to display developer information
const Credits = () => {
    return (
        <p className="credits">Developed by <a className="link" href="https://linktr.ee/jovantomovic" target="_blank">Jovan Tomovic</a></p>
    );
}

const Calculator = () => {

    const [equation, setEquation] = useState([]);
    const [last, setLast] = useState("");
    const [equalTo, setEqualTo] = useState("0");
    const [isLastUpdated, setIsLastUpdated] = useState(false);

    const lastToEquation = (value) => {
        if (last[0] == "-" && !/\d/.test(equation[equation.length - 1])) {
            setEquation(current => [...current, `(${last})`]);    // Adds parentheses to the negative number if next to the operator
        } else {
            setEquation(current => [...current, last]);
        }
        setLast(value);
    }

    const handleInput = (event) => {
        const value = event.target.innerText;
        if (equalTo !== "0") {
            if (/[+\-*\/]/.test(value)) {
                // If there's a non-zero result already displayed and an operator is pressed,
                // set the equation to the current result and update the last input with the operator
                setEquation([equalTo]);
                setLast(value);
                setEqualTo("0");
            } else {
                // Clear the calculator's state and update the last input with the new value
                clear();
                setLast(value);
            }
        }

        // If there's no last input and the pressed button is a digit or a minus sign, handle the special cases and update the last input accordingly
        if (last === "" && /[\d\-.]/.test(value)) {
            if (value == ".") {
                setLast("0.");
            } else {
                setLast(value);
            }
        }


        if (/\d/.test(last)) {
            if (/\d/.test(value)) {
                if (value == "0" && last == "0") {
                    // Ignore consecutive leading zeros
                } else {
                    setLast(current => current + value)
                }
            } else if (value == ".") {
                if (!last.includes(".")) {
                    setLast(current => current + ".");
                }
            } else {
                lastToEquation(value);
            }

        } else {
            if (/\d/.test(value)) {
                if (last[0] == "-" && /[+\-*\/]/.test(equation[equation.length - 1])) {
                    setLast(current => current + value);
                } else {
                    lastToEquation(value);
                }
            } else {
                if (value == "-" && !/[+\-*\/\(\)]/.test(equation[equation.length - 1])) {
                    lastToEquation(value);
                } else if (value == ".") {
                    lastToEquation("0.");
                } else if (/[+\-*\/\(\)]/.test(equation[equation.length - 1])) {
                    setEquation(current => current.slice(0, -1));
                    setLast(value);
                } else {
                    setLast(value);
                }
            }
        }
    }

    // Clears all data
    const clear = () => {
        setEquation([]);
        setLast("");
        setEqualTo("0");
    }

    
    const backsapce = () => {
        if (equalTo !== "0") setEqualTo("0");
        if (last.length > 1) {
            setLast(current => current.slice(0, -1));
        } else if (equation.length > 0) {
            if (/^\(.*\)$/.test(equation[equation.length - 1])) {
                setLast(equation[equation.length - 1].slice(1, -1));    // Get rid of parentheses e.g. (-253) when moving it from equation to last
            } else {
                setLast(equation[equation.length - 1]);
            }
            setEquation(current => current.slice(0, -1));
        } else {
            setLast("");
        }
    }

    // Do calculations
    const equal = () => {
        // Check LAST CHARACTER in last. So that negative numbers are not included 
        if (/[+\-*\/]$/.test(last)) {
            setLast("");
        } else {
            lastToEquation("");
        }
        setIsLastUpdated(true);
    }
    // Used to make sure that both last and equation are fully updated before doing calculations
    useEffect(() => {
        if (isLastUpdated) {    // Used to not run the calculation on first render
            const unSanitized = equation.join("");    // Crates equation string
            const sanitized = unSanitized.replace(/[^\d+\-*\/.()]/, "");    // Sanitize the equation string
            console.log(sanitized);
            const value = eval(sanitized);    // Calculates
            setEqualTo(value);
            setIsLastUpdated(false);
        }
    }, [isLastUpdated]);
    
    return (
        <main id="calculator">
            <Display last={last} equation={equation} equalTo={equalTo} />
            <KeyPad handleInput={handleInput} backsapce={backsapce} clear={clear} equal={equal} />
        </main>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Calculator />);
