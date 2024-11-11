import Board from "@/components/Board";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Morpion',
};


export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <Board/>
      </div>
    </main>
  );
}