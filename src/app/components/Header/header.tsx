import { Bell } from "lucide-react";
import { Logo } from "../Images/logo";
import "./header.scss";
import Admin from "./Admin";
import { useState, useEffect, useRef } from "react";
import MsgBox from "./msgBox";

interface HeaderProps { onClick?:() => void; }

export function Header(props: HeaderProps) {
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openMsg, setOpenMsg] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setOpenAdmin(false);
        setOpenMsg(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMsgBox = () => {
    setOpenMsg((prev) => !prev);
    setOpenAdmin(false);
  };

  const toggleAdminBox = () => {
    setOpenAdmin((prev) => !prev);
    setOpenMsg(false);
  };

  return (
    <header ref={headerRef}>
      <div className="logo">
        <Logo />
        <h1>Logoipsum</h1>
      </div>
      <div className="avatar">
        <div className="admin-area">
          <div className="alert-notification">
            <Bell onClick={toggleMsgBox} />
            {openMsg && <MsgBox onClick={toggleMsgBox} />}
          </div>
          <img
            src="./avatar.jpg"
            onClick={(event: React.MouseEvent<HTMLImageElement>) => toggleAdminBox()}
            className={openAdmin ? "active" : ""}
          />
          {openAdmin && <Admin onClick={toggleAdminBox} />}
        </div>
      </div>
    </header>
  );
}
