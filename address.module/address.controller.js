


class AddressController{
  constructor(addressService){
    this.addressService = addressService
  }
async createAddress(req, res){
  try {
    const Address = await this.addressService.createAddress(req.body)
    res.status(201).json({message: "Address enregistre", Address})
  } catch (error){
    console.error("Erreur lors de la creation:", error)
    res.status(500).json({error: "Erreur serveur"})
  }
}

async getAllAddresses(req, res){
  try {
    const address = await this.addressService.getAllAddresses()
    res.status(200).json(address)
  } catch(error){
    console.error("Erreur en recuperant les utilisateurs:", error)
res.status(500).json({error: "Erreur serveur"})
  }
}

async getAddressById(req, res){
  try {
    const {id} = req.params
    const address = await this.addressService.getAddressById()
    if(!address){
      return res.status(404).json({message: "Address non trouve"})
    }
    res.status(200).json(address)
  } catch(error){
    console.error("Erreur lors de la recuperation de l'address:", error)
    res.status(500).json({error: "Erreur serveur"})
  }
}

async updateAddressById(req, res){
  try{
    const {id} = req.params
    const updateData =req.body
    const updatedAddress = await this.addressService.updateAddressById(id, updateData)
    if(!updatedAddress){
      return res.status(404).json({message: "Address non trouve"})
    }
res.status(200).json({message: "Address mis a jour", address: updatedAddress})
  } catch(error) {
    console.error("Erreur lors de la a jour:", error)
    res.status(500).json({error: "Erreur serveur"})

  }
}

async deleteAddressById(req, res)
{try{
  const {id}= req.params
  const deletedAddress = await this.addressService.deleteAddressById(id)
  if(!deletedAddress){
    return res.status(404).json({message: "Address non trouve"})
  }
  res.status(200).json({message: "Utilisateur supprime", user: deletedAddress})
}catch(error){
  console.error("Erreur lors de la suppresion:", error)
  res.status(500).json({error: "Erreur serveur"})
}

}


}


export default  AddressController