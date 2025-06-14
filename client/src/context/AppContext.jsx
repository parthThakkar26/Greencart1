import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

//connect frontend with backend url
axios.defaults.withCredentials = true; // it will send cookies in API Request
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;


export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const currency = import.meta.env.VITE_CURRENCY;


  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products,setProducts] = useState([]);
  
  const [cartItems,setCartItems] = useState({})
  const [searchQuery,setSearchQuery] = useState({})

  //fetch seller status
  const fetchSeller = async () =>{
    try{
     const {data} = await axios.get('/api/seller/is-auth');
     if(data.success){
      setIsSeller(true);
     }
     else{
      setIsSeller(false);
     }
    } 
    catch(error){
      setIsSeller(false);

    }
  }

  //Fetch USer auth status, User data and cart Items
  const fetchUser = async ()=>{
    try {
      const {data} = await axios.get('/api/user/is-auth');

       if(data.success){
        setUser(data.user)
       
        setCartItems(data.user.cartItems || {})
        setshowUserLogin(false)
        navigate('/',{replace:true})
        console.log(data.message)
       }
      
    } catch (error) {
      setUser(null);
      
    }
  }



  //fetch all producta
  const fetchProducts = async() =>{
      try{
        
        const {data} = await axios.get('/api/product/list')
        if(data.success){
          setProducts(data.products)
        }
        else{
          toast.error( data.message)
        }

      }
      catch(error){
        toast.error(error.message);

      }
 }

  //add product to cart
  const addToCart = (itemId) =>{
    let cartData = structuredClone(cartItems);

    if(cartData[itemId]){
      cartData[itemId] += 1;
    }
    else{
       cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to Cart")
  }

  //update cart Item quantity
  const updateCartItem =(itemId,quantity) =>{
     let cartData = structuredClone(cartItems)
     cartData[itemId] = quantity
     setCartItems(cartData)
     toast.success("Cart Updated")
  }

  //remove from cart
  const removefromCart =(itemId) =>{
    let cartData =  structuredClone(cartItems);
    if(cartData[itemId]){
      cartData[itemId] -= 1;
      if(cartData[itemId] == 0){
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData)
  }

  //get cart item count
  const getCartCount = () =>{
    let totalcnt = 0;
    for(const item in cartItems){
      totalcnt += cartItems[item];
    }
    return totalcnt;
  }

  //get cartTotalAmount
  const getCartAmount = () =>{
    let totalamt = 0;
    for(const items in cartItems){
      let itemInfo = products.find((product) =>product._id === items)
      if(cartItems[items] > 0){
        totalamt += itemInfo.offerPrice * cartItems[items]
      }
    }
    return Math.floor(totalamt * 100) /100;
  }

  useEffect(() =>{
    fetchUser();
    fetchSeller();
   fetchProducts();
  },[])

  //update database cartItems
  useEffect(()=>{
    const updateCart = async()=>{
      try {
        const {data} = await axios.post("/api/cart/update",{cartItems})

        if(!data.success){
          toast.error(data.message)
        }
        
      } catch (error) {
         toast.error(error.message)
      }
    }
    if(user){
      updateCart( )
    }



  },[cartItems])
  const value = { navigate, user, setUser, isSeller, setIsSeller ,showUserLogin,setshowUserLogin,products,currency,addToCart,updateCartItem,removefromCart,cartItems,
    searchQuery,setSearchQuery ,getCartAmount , getCartCount , axios,fetchProducts, setCartItems
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
