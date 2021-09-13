import React from 'react'
const MovieContext = React.createContext(null)

export function MovieProvider(props) {
    const [page, setPage] = React.useState("search");
    const [stream, setStream] = React.useState("");
    const [streamData, setStreamData] = React.useState(null); //{ title: "", slug: "", type: "", episodes: [], seasons: [] }) 

    return (
        <MovieContext.Provider value={{
            navigate(str) {
                setPage(str)
            },
            page,
            setStreamUrl: setStream,
            streamUrl: stream,
            streamData,
            setStreamData(d) {
                setStreamData(p => {
                    return {...p,...d}
                })
            },
            resetStreamData() { setStreamData(null) }
        }}>
            {props.children}
        </MovieContext.Provider>
    )
}

export function useMovie(props) {
    return React.useContext(MovieContext);
}
