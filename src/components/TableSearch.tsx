"use client"
import Image from "next/image";
import React ,{useState,useCallback,useEffect} from "react"
import { useSearchParams } from 'next/navigation';

interface SearchProps {
  search?: string; // Paramètre optionnel
}

const TableSearch:React.FC<SearchProps> = ({search}) => {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const searchData = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString()); 
    
    if (searchTerm) {
      params.set(search? search:"search", searchTerm);
      window.location.search = params.toString();

    } else {
      params.delete(search? search:"search"); // Supprime le paramètre si l'input est vide
    }

    // Redirige avec les nouveaux paramètres de recherche
     
  }  ,[searchTerm])
  useEffect(
    ()=>{
        searchData()
    },[searchTerm]
  )
  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="" width={14} height={14} />
      <input
        onChange={(e)=>setSearchTerm(e.target.value)}
        type="text"
        placeholder="Search..."
        className="w-[200px] p-2 bg-transparent outline-none"
      />
    </div>
  );
};

export default TableSearch;
