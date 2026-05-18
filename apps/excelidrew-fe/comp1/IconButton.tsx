import { ReactNode } from "react";

export function IconButton({
  icon,onClick,activated
}:{
  icon:ReactNode,
  onClick : () => void,
  activated : boolean
}){
  return <div className={`pointer rounded-full border p-2 bg-black hover:bg-pink-400${activated ? "text-red" : "text-white"}`} onClick = {onClick}>
    {icon}
  </div>
}