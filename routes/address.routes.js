import { Router } from 'express';

export function addressRouter(addressController) {
  const router = Router();

  router.post('/', (req, res) => addressController.createAddress(req, res));
  router.get('/', (req, res) => addressController.getAllAddresses(req, res));
  router.get('/:id', (req, res) => addressController.getAddressById(req, res));
  router.put('/:id', (req, res) => addressController.updateAddressById(req, res));
  router.delete('/:id', (req, res) => addressController.deleteAddressById(req, res));

  return router;
}