import Board from "@/components/Board";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Morpion',
};


export default function Home() {
  return (
    <main
      className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
      <div className="p-8 bg-white shadow-xl rounded-lg">
        <Board/>
      </div>
    </main>
  );
}