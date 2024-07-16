import '../../styles/main/main.css'
import Animal from "../animal/animal.component";

const MainComponent = () => {

    return (
        <div className="main-container">
            <Animal image={'pictures/bear_spider.jpg'}/>
            <Animal image={'pictures/frogHead_caterpillar.webp'}/>
            <Animal image={'pictures/eagleHead_mosquito.webp'}/>
        </div>
    )
}
export default MainComponent;