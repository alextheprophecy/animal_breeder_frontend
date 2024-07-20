import '../../styles/animal/animal.css'
import {useEffect, useRef, useState} from "react";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const Animal = (props) => {
    const WINDOW = useWindowDimensions() //TODO: fetch values from parent
    const BOUNDS = {width: WINDOW.width - (300/2), height: WINDOW.height - 150} //TODO: care that the offset are hardcoded

    const [pos, setPos] = useState(randomPos())
    const [selected, setSelected] = useState(false)

    function randomPos() {return {x: Math.random() * BOUNDS.width, y: Math.random() * BOUNDS.height}}
    function getRandomInterval (min, max) {return min + Math.random()*(max-min)}
    function moveRandom() {setPos(randomPos())}
    const CallInterval = (minSeconds, maxSeconds, callback) => {
        useEffect(() => {
            let timer
            const refresh = () => {
                timer = setTimeout(() => {
                    callback()
                    refresh()
                }, getRandomInterval(minSeconds, maxSeconds) * 1000)
            }
            refresh()
            return () => clearTimeout(timer)
        }, [])
    }

    //CallInterval(1, 7, ()=> moveRandom())

    const [imageTransform, setImageTransform] = useState('translate(0px, 0px');
    const animationId = useRef(null);

    useEffect(() => {
        let last = 0;
        const updatePosition = (now) => {
            if(!last || now - last >= 1000*getRandomInterval(3, 8)) {
                last = now;
                const newPos = randomPos()
                setImageTransform(`translate(${newPos.x}px, ${newPos.y}px)`)
            }
            animationId.current = requestAnimationFrame(updatePosition)
        };

        updatePosition()
        return () => cancelAnimationFrame(animationId.current)
    }, []);

    return (
        <div className="animal-container" style={{transform: imageTransform, zIndex: (selected?5:2)}}>
            <img src={props.image} onMouseDown={()=> {
                props.selectAnimal(props.id)
                setSelected(!selected)
            }} style={{width: '100%', filter: selected?"drop-shadow(0 0 10px white)":"contrast(75%)"}}/>
        </div>
    )
}


export default Animal;