

import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import InputDemo from "./components/Input.tsx";

export default function App() {
    return (
       <div className="roboto-medium w-[400px] h-[400px]">
           <h1>Zoom</h1>
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <h1>Hello</h1>
                <InputDemo />
            </SignedIn>
       </div>
    );
}