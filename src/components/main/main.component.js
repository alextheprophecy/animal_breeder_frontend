import '../../styles/main/main.css'
import Animal from "../animal/animal.component";
import axios from "axios";
import {useEffect, useRef, useState} from "react";
import Animal_infoComponent from "./animal_info.component";
import AnimalInfo from "./animal_info.component";

const MainComponent = () => {
    const [animals, setAnimals] = useState([])
    const [selected, setSelected] = useState([])

    const [infoOpen, setInfoOpen] = useState(false)
    const [infoData, setInfoData] = useState({})

    const [consoleInfo, setConsoleInfo] = useState("")
    const consoleRef = useRef(null)

    const blacklist = [49, 102, 57, 52, 97, 96, 100, 103, 93, 87,89, 98,76, 61, 60, 62, 63, 64, 65, 66, 67, 68, 69,90, 48, 55, 71, 72, 59, 56, 51, 58, 75, 79, 82, 80, 77, 81, 83,]
    const whitelist = [63, 60, 59, 67, 57, 72]

    useEffect(() => {
        updateAnimalList()
        //updateAvatars()
    }, []);

    const updateAvatars = () => {
        axios.get("http://192.168.1.95:4000/animal/all", {params: {has_avatar: false}}).then(list => {
            list.data.forEach(animal => {
                axios.get("http://192.168.1.95:4000/animal/avatar", {params: {animal_id: animal[1]}}).then(list => {
                    console.log("UPDATED:: ", list.data)
                })
            })
        })
    }

    const updateAnimalList = () => {
        axios.get("http://192.168.1.95:4000/animal/all").then(list => {
            setAnimals(list.data)
        })
    }

    const selectAnimal = (animalId) => {
        if (selected.includes(animalId)) setSelected(old=>old.filter(a=>a!==animalId))
        else setSelected(old=> [...old, animalId])

        if (!selected.includes(animalId)){
            const animal = animals.find(a=>a[1]===animalId)
            setInfoData({image: animal[0], info: animal[2]})
            setInfoOpen(true)
        }

    }

    const displayAnimals = () => {
        return animals.map(a => {
            if(blacklist.includes(a[1]))return ""
            return <Animal image={a[0].replace(".png", "-avatar.png")} selectAnimal={selectAnimal} id={a[1]}/> //.replace(".png", "-avatar.png")
        })
    }

    const showSelected = () => {
        return selected.map(a => `${a}, `)
    }

    const breedAnimals = () => {
        if(selected.length!==2)return alert("you have not selected exactly two parents!")
        axios.post("http://192.168.1.95:4000/animal/create", {parents: selected}).then(animal_data_formatted => {
            const animal_data = animal_data_formatted.data
            alert(animal_data.is_new?"made a child!":"child already exists!")
            updateAnimalList()
            updateAvatars()
            //TODO:update avatar
            console.log(animal_data.data)
        })
    }

    const testStreamCreate = () => {
        if(selected.length!==2)return alert("you have not selected exactly two parents!")
        axios.get('http://192.168.1.95:4000/animal/create', {params: {parents: selected}, responseType: 'stream', adapter: 'fetch' }).then(response => {
            const stream = response.data;
            const reader = stream.pipeThrough(new TextDecoderStream()).getReader()

            let last_data = {}
            const readStream = () => {
                consoleRef.current.scrollTo(0, consoleRef.current.scrollHeight)
                return reader.read().then(({ value, done }) => {
                    if(done) return
                    setConsoleInfo(consoleInfo => consoleInfo.concat(value).concat("\n"))
                    last_data = value
                    return readStream() // Continue reading the stream
                }).catch(err=>console.log("ERROR", err))
            };

            readStream().then(() => {
                console.log(JSON.stringify(last_data))
                const animal_data = JSON.parse(last_data)
                alert(animal_data.is_new?"made a child!":"child already exists!")
                updateAnimalList()
            });
        }).catch(error => console.error('Error reading stream:', error))
    }

    const testStream = () => {
        axios.get('http://192.168.1.95:4000/animal/stream', {responseType: 'stream', adapter: 'fetch'}).then(response => {
            const stream = response.data;
            const reader = stream.pipeThrough(new TextDecoderStream()).getReader()
            setConsoleInfo("Oki")

            const readStream = () => {
                //consoleRef.current.scrollTo(0, consoleRef.current.scrollHeight)

                return reader.read().then(({ value, done }) => {
                    if(done) return

                    setConsoleInfo(consoleInfo => consoleInfo.concat(value).concat("\n"))
                    return readStream() // Continue reading the stream
                }).catch(err=>console.log("ERROR", err))
            };

            return readStream()
        }).catch(error => console.error('Error reading stream:', error));
    }



    return (
        <div className="main-container">
            {displayAnimals()}
            <button className={"breed-button"} onClick={()=> testStream()}>Breed</button>
            {showSelected()}
            <AnimalInfo open={infoOpen} infoData={infoData} closeInfo={()=> setInfoOpen(false)}/>
            <div className={"console"} ref={consoleRef}><div className={"console-text"}>{consoleInfo}</div></div>
        </div>
    )
}
export default MainComponent;