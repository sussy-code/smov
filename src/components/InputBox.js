import React from 'react';
import { Arrow } from './Arrow';
import './InputBox.css'

// props = { onSubmit: (str) => {}, placeholder: string}
export function InputBox({ onSubmit, placeholder }) {
    const [value, setValue] = React.useState("");

    return (
        <form className="inputBar" onSubmit={(e) => {
            e.preventDefault();
            onSubmit(value)
            return false;
        }}>
            <input
                type='text'
                className="inputTextBox"
                id="inputTextBox"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button className="inputSearchButton"><span className="text">Search<span className="arrow"><Arrow/></span></span></button>
        </form>
    )
}
