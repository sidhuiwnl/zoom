import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ClerkProvider} from "@clerk/clerk-react";
import { BrowserRouter,Routes,Route } from "react-router";
import MeetApp from "./components/MeetApp.tsx";
import Recordings from "./pages/Recordings.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;


if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ClerkProvider
          publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/"}>
          <BrowserRouter>
              <Routes>
                  <Route path={"/"} element={ <App/>} />
                  <Route path={"/Add"} element={<MeetApp/>}/>
                  <Route path={"/Recordings"} element={<Recordings/>}/>
              </Routes>

          </BrowserRouter>
      </ClerkProvider>
  </StrictMode>,
)
