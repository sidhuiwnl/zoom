import Navbar from "./components/Navbar.tsx";
import HomeSection from "./components/HomeSection.tsx";

export default function App() {
    return (
       <div className="flex flex-col w-screen h-screen">
           <Navbar/>
           <HomeSection/>
       </div>
    );
}