import { useRef, useState, useEffect } from "react"
import "./SelectBox.css"

function Option({ option, ...props }) {
    return (
        <div className="option" {...props}>
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

export function SelectBox({ options, selectedItem, setSelectedItem }) {
    if (!Array.isArray(options)) {
        throw new Error("Items must be an array!")
    }

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
        // return function to be called when unmounted
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onOptionClick = (e, option, i) => {
        e.stopPropagation()
        setSelectedItem(i)
        closeDropdown()
    }

    const handleSelectedKeyPress = event => {
        if (event.code === 'Enter' || event.code === 'Space'){
            setActive(a => !a);
        }
    }

    const handleOptionKeyPress = (option, i) => event => {
        if (event.code === 'Enter' || event.code === 'Space'){
            onOptionClick(event, option, i);
        }
    }

    return (
        <div className="select-box" ref={containerRef} onClick={() => setActive(a => !a)} >
            <div className="selected" tabIndex={0} onKeyPress={handleSelectedKeyPress}>
                {options ? (
                    <Option option={options[selectedItem]} />
                ) : null}
            </div>
            <div className={"options-container" + (active ? " active" : "")}>
                {options.map((opt, i) => (
                    <Option option={opt} key={i} onClick={(e) => onOptionClick(e, opt, i)} tabIndex={active ? 0 : undefined} onKeyPress={active ? handleOptionKeyPress(opt, i) : undefined} />
                ))}
            </div>
        </div>
    )
}
