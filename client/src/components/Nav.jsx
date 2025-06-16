import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
export default function Nav() {
    const { userId } = useContext(AuthContext);
    return(
    <nav className="w-full bg-[#FFFAFA] p-2 flex items-center justify-center gap-3 text-5xl text-[#e76f51]">
        <h1 style={{ fontFamily: "Kranky, cursive" }}>SKILL</h1>
        <h1 style={{ fontFamily: "Lemon, sans" }}>SWAP</h1>
    </nav>
    );
}