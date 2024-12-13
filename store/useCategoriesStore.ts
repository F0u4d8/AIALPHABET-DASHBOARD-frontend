import { auth } from "@/auth";
import toast from "react-hot-toast";
import { create } from "zustand";



export const useCategoriesStore = create((set , get ) =>({
categories : [],
isCategoriesLoading : false ,
isCategoriesPagesLoading : false ,

totalCategoriesPages : 1 , 

getCategoriesPages : async (query : string) => {
set({isCategoriesPagesLoading : true})

try {
    
  
    
} catch (error : any) {
    toast.error(error.response.data.message);

} finally {
    set({isCategoriesPagesLoading : false})
  
}

}




}))