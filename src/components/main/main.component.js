import '../../styles/main/main.css'
import Animal from "../animal/animal.component";
import axios from "axios";
import {useEffect, useState} from "react";
import Animal_infoComponent from "./animal_info.component";
import AnimalInfo from "./animal_info.component";

const MainComponent = () => {
    const [animals, setAnimals] = useState([])
    const [selected, setSelected] = useState([])

    const [infoOpen, setInfoOpen] = useState(false)
    const [infoData, setInfoData] = useState({})


    const blacklist = [49, 50, 57, 52, 61, 60, 62, 63, 64, 65, 66, 67, 68, 69, 48, 55, 71, 72, 59, 56, 51, 58]
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

    //            <button className={"breed-button"} onClick={breedAnimals}>BREED</button>
    return (
        <div className="main-container">
            {displayAnimals()}
            <button className={"breed-button"} onClick={()=>{}}>Breed</button>
            {showSelected()}
            <AnimalInfo open={infoOpen} infoData={infoData} closeInfo={()=>setInfoOpen(false)}/>
        </div>
    )
}
export default MainComponent;