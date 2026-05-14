import { CardDemo } from "@/comp1/AuthPage";

export  default function Signup(){

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <CardDemo isSignin={false}></CardDemo>
    </div>
   

  )
}