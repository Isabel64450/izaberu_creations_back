
import AddressRepository from "./address.repository.js";

class AddressService {
  constructor(AddressRepository) {
    this.AddressRepository = AddressRepository;
  }

 async createAddress(addressData) {
  const allAddresses = await this.AddressRepository.getAllAddresses();
  const alreadyExists = allAddresses.some(addr =>
    addr.number === addressData.number &&
    addr.rue === addressData.rue &&
    addr.ville === addressData.ville &&
    addr.codePostal === addressData.codePostal &&
    addr.complement === addressData.complement 
  );

  if (alreadyExists) {
    throw new Error("Cette adresse existe déjà.");
  }

  return await this.AddressRepository.createAddress(addressData);
}

  async getAllAddresses() {
    return await this.AddressRepository.getAllAddresses();
  }

  async getAddressById(id) {
    return await this.AddressRepository.getAddressById(id);
  }

  async updateAddressById(id, updateData) {
    return await this.AddressRepository.updateAddressById(id, updateData);
  }

  async deleteAddressById(id) {
    return await this.AddressRepository.deleteAddressById(id);
  }
}
console.log(typeof AddressRepository.getAllAddresses)
export default new AddressService(AddressRepository);
