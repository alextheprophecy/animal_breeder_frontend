import '../../styles/main/animal_info.css'

const AnimalInfo = ({open, infoData, closeInfo}) => {

    const showInfo = () => {
        if(infoData.info){
            const hungerPercentage = infoData.info.hunger? (100*infoData.info.hunger/10) :0
            const agePercentage = infoData.info.maxAge? (100*infoData.info.maxAge/100) :0

            return(
                <div>
                    <div className={"info-animal-name"}>
                        {infoData.info.name}
                    </div>

                    <img className={"info-animal-image"} src={infoData.image}/>
                    <div className={"info-animal-stats"}>
                        <div className={"info-animal-stats-bar"} style={{width:`${hungerPercentage}%`}}>
                            <div className={"info-animal-stats-bar-label"}>Hunger </div>
                        </div>

                        <div className={"info-animal-stats-bar"} style={{width:`${agePercentage}%`}}>
                            <div className={"info-animal-stats-bar-label"}>Age </div>
                        </div>

                    </div>
                    <div className={"info-animal-description"}>
                        {infoData.info.behaviour}
                    </div>
                </div>)
        }
        return ""
    }

    return (
        <div className={"animal-info-container"}  onClick={()=>closeInfo()} style={
            {
                top : (open?"10%":"100%"),
                transition: open?'all 0.4s cubic-bezier(0.5,0.03,0.36,1.3)' : 'all 0.32s cubic-bezier(0.55,-0.23,0.92,0.87)',
            }}>

            {showInfo()}


        </div>
    )
}


export default AnimalInfo;