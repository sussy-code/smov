import React from 'react'
import './Card.css'

// fullWidth: boolean
// show: boolean
// doTransition: boolean
export function Card(props) {

    const [showing, setShowing] = React.useState(false);
    const measureRef = React.useRef(null)
    const [height, setHeight] = React.useState(0);

    React.useEffect(() => {
        if (!measureRef?.current) return;
        setShowing(props.show);
        setHeight(measureRef.current.clientHeight)
    }, [props.show, measureRef])

    return (
        <div className={`card-wrapper ${ props.fullWidth ? 'full' : '' }`} style={{
            height: props.doTransition ? (showing ? height : 0) : "initial",
        }}>
            <div className={`card ${ showing ? 'show' : '' } ${ props.doTransition ? 'doTransition' : '' }`} ref={measureRef}>
                {props.children}
            </div>
        </div>
    )
}
