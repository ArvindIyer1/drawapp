import { Signup } from "./signup/page";
import Link from "next/link";
import { Button } from "@/components/ui/button";  // add this

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      Collaborative Whiteboard
      Smart Drawing

      <Button asChild>
        <Link href="/signin">Signin</Link>
      </Button>
      <Button asChild>
        <Link href="/signup">Signup</Link>
      </Button>
    </div>
  );
}