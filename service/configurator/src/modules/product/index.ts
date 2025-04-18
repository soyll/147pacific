import { createClient } from "urql";
import { ProductRepository } from "./repository";
import { ProductService } from "./product-service";

export { ProductService } from "./product-service";
export { ProductRepository } from "./repository";

export const createProductService = (
  client: ReturnType<typeof createClient>,
  productTypeService: any,
  categoryService: any,
  attributeService: any,
  channelService: any
) => {
  const repository = new ProductRepository(client);
  const service = new ProductService(
    repository,
    productTypeService,
    categoryService,
    attributeService,
    channelService
  );
  return service;
}; 