import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Logo() {
    const { userId } = useContext(AuthContext);

    return (
        <Link 
            to={userId ? `/dashboard/${userId}` : "/"} 
            className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 sm:gap-2 md:gap-3 text-2xl sm:text-3xl md:text-4xl text-[#e76f51]"
        >
            <h1 style={{ fontFamily: "Kranky, cursive" }}>SKILL</h1>
            <h1 style={{ fontFamily: "Lemon, sans" }}>SWAP</h1>
        </Link>
    );
}