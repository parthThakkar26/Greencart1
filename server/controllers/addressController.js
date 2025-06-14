import Address from "../models/Address.js";


//ADD Address: /api/address/add
export const addAddress = async (req, res)=>{
    try{
      //address data AND userId fetch from body
      const {address,userId} = req.body;

      //add this address in database
      await Address.create({...address,userId});

      //send res
      res.json({
        success:true,
        message:"Address added successfully"
      })
    }
    catch(error){
        console.log(error.message)
        res.json({
            success:false,
            message:error.message
        })

    }
}


    //Get Address:  /api/address/get
     export const getAddress = async(req,res)=>{
        try{

            const {userId} = req.body;
            const addresses = await Address.find({userId});
            res.json({
                success:true,
                address: addresses
            })
            
        }
        catch(error){
            console.log(error.message);
            res.json({
                success:false,
                message:error.message
            })

        }
     }