import { useRef, useState, useEffect } from "react"
import "./SelectBox.css"

function Option({ option, onClick }) {
    return (
        <div className="option" onClick={onClick}>
            <input
                type="radio"
                className="radio"
                id={option.id} />
            <label htmlFor={option.id}>
                <div className="item">{option.name}</div>
            </label>
        </div>
    )
}

export function SelectBox({ options }) {
    if (!Array.isArray(options)) {
        throw "Items must be an array!"
    }

    const [selectedItem, setSelectedItem] = useState(0)
    const [active, setActive] = useState(false)

    const containerRef = useRef();

    const handleClick = e => {
        if (containerRef.current.contains(e.target)) {
            // inside click
            return;
        }
        // outside click
        closeDropdown()
    };

    const closeDropdown = () => {
        setActive(false)
    }

    useEffect(() => {
        // add when mounted
        document.addEventListener("mousedown", handleClick);
        document.addEventListener("scroll", closeDropdown);
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
            document.removeEventListener("scroll", closeDropdown)
        };
    }, []);

    const onOptionClick = (option, i) => {
        setSelectedItem(i)
        closeDropdown()
    }

    return (
        <div className="select-box" ref={containerRef}>
            <div className={"options-container" + (active ? " active" : "")}>
                {options.map((opt, i) => (
                    <Option option={opt} key={i} onClick={() => onOptionClick(opt, i)} />
                ))}
            </div>
            <div className="selected" onClick={() => setActive(a => !a)}>
                {options ? (
                    <Option option={options[selectedItem]} />
                ) : null}
            </div>
        </div>
    )
}