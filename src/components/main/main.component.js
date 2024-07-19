import '../../styles/main/main.css'
import Animal from "../animal/animal.component";
import axios from "axios";
import {useEffect, useState} from "react";

const MainComponent = () => {
    const [animals, setAnimals] = useState([])
    const [selected, setSelected] = useState([])
    const blacklist = [49, 50, 57, 52]
    const whitelist = [63, 60, 59, 67, 57, 72]

    useEffect(() => {
        updateAnimalList()
        updateAvatars()
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
            console.log(list.data)
            setAnimals(list.data)
        })
    }

    const selectAnimal = (animalId) => {
        if (selected.includes(animalId)) setSelected(old=>old.filter(a=>a!==animalId))
        else setSelected(old=> [...old, animalId])
    }

    const displayAnimals = () => {
        return animals.map(a => {
            if(blacklist.includes(a[1]))return ""
            return <Animal image={a[0].replace(".png", "-avatar.png")} selectAnimal={selectAnimal} id={a[1]}/>
        })
    }

    const showSelected = () => {
        console.log(selected)
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

    return (
        <div className="main-container">
            <button className={"breed-button"} onClick={breedAnimals}>BREED</button>
            {displayAnimals()}

            {showSelected()}

        </div>
    )
}
export default MainComponent;