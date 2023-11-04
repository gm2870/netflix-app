
export const getMyListFromStorage = () => {
    if(typeof window === 'undefined') return [];
    const myList: number[] = [];
    const userStr = localStorage.getItem('user');
    if(userStr) {
      const user = JSON.parse(userStr);
      myList.push(...user.favorites)
    }
    return myList;
  }
  
  export const setMyListToStorage = (myListIds: number[]) => {
    const userStr = localStorage.getItem('user');
    if(userStr) {
      const user = JSON.parse(userStr);
      localStorage.setItem('user',JSON.stringify({
        ...user,
        favorites:myListIds
      }))
    }
  }