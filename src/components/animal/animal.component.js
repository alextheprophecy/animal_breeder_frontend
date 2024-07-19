import '../../styles/animal/animal.css'
import {useEffect, useState} from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const Animal = (props) => {
    const WINDOW = useWindowDimensions() //TODO: fetch values from parent
    const BOUNDS = {width: WINDOW.width - (300/2), height: WINDOW.height - 150} //TODO: care that the offset are hardcoded

    const [pos, setPos] = useState(randomPos())
    const [selected, setSelected] = useState(false)

    function randomPos() {return {x: Math.random() * BOUNDS.width, y: Math.random() * BOUNDS.height}}
    function randomBetween(min, max) {return min + Math.random()*(max-min)}
    function moveRandom() {setPos(randomPos())}

    const imageStyle = () => {
        /*return "-webkit-filter: drop-shadow(1px 1px 0 black)
        drop-shadow(-1px -1px 0 black);
        filter: drop-shadow(1px 1px 0 black)
        drop-shadow(-1px -1px 0 black)"*/
    }
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
        <div className="animal-container" style={{left: `${pos.x}px`, top: `${pos.y}px`, zIndex:selected?5:2}}>
            <img src={props.image} onClick={()=> {
                props.selectAnimal(props.id)
                setSelected(!selected)
            }} style={{width: '100%',
                filter: selected?"drop-shadow(0 0 10px white)":"contrast(75%)"}}/>
        </div>
    )
}


export default Animal;