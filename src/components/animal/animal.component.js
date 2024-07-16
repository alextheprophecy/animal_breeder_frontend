import '../../styles/animal/animal.css'
import {useEffect, useState} from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const Animal = ({id, image}) => {
    const WINDOW = useWindowDimensions() //TODO: fetch values from parent
    const BOUNDS = {width: WINDOW.width - (300/2), height: WINDOW.height - 150} //TODO: care that the offset are hardcoded

    let [pos, setPos] = useState(randomPos())
    function randomPos() {return {x: Math.random() * BOUNDS.width, y: Math.random() * BOUNDS.height}}
    function randomBetween(min, max) {return min + Math.random()*(max-min)}
    function moveRandom() {setPos(randomPos())}
    const CallInterval = (minSeconds, maxSeconds, callback) => {
        useEffect(() => {
            let timer
            const refresh = () => {
                timer = setTimeout(() => {
                    callback()
                    refresh()
                }, randomBetween(minSeconds, maxSeconds) * 1000)
            }
            refresh()
            return () => clearTimeout(timer)
        }, [])
    }

    CallInterval(1, 7, ()=> moveRandom())

    return (
        <div className="animal-container" style={{left: `${pos.x}px`, top: `${pos.y}px`}}>
            <img src={image} style={{width: '100%'}}/>
        </div>
    )
}


export default Animal;