import type { SaleorConfig } from "../config/schema";
import { logger } from "../../lib/logger";
import type { CategoryOperations, Category } from "./repository";

type CategoryConfigInput = NonNullable<SaleorConfig["categories"]>[number];

export class CategoryService {
  constructor(private repository: CategoryOperations) {}

  private async getExistingCategory(name: string) {
    return this.repository.getCategoryByName(name);
  }

  private async createCategory(
    input: CategoryConfigInput,
    parentId?: string
  ): Promise<Category> {
    logger.debug("Creating category", {
      name: input.name,
      parentId,
    });

    // Generate a slug if not provided
    const createInput = {
      name: input.name,
      slug: input.name.toLowerCase().replace(/\s+/g, '-'),
    };

    try {
      const category = await this.repository.createCategory(
        createInput,
        parentId
      );

      logger.debug("Created category", {
        id: category.id,
        name: category.name,
        parentId,
      });

      return category;
    } catch (error) {
      logger.error("Failed to create category", {
        name: input.name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  async bootstrapCategories(categories: CategoryConfigInput[]) {
    logger.debug("Bootstrapping categories");

    return Promise.all(
      categories.map((category) => this.bootstrapCategory(category))
    );
  }

  async getOrCreateCategory(
    categoryInput: CategoryConfigInput | string
  ): Promise<Category> {
    // Handle both string and object inputs
    const categoryName = typeof categoryInput === 'string' 
      ? categoryInput 
      : categoryInput.name;
    
    const categoryObject = typeof categoryInput === 'string'
      ? { name: categoryInput }
      : categoryInput;

    try {
      const existingCategory = await this.getExistingCategory(categoryName);

      if (existingCategory) {
        return existingCategory;
      }

      return this.createCategory(categoryObject);
    } catch (error) {
      logger.error("Failed to get or create category", {
        name: categoryName,
        error: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }

  private async bootstrapCategory(
    categoryInput: CategoryConfigInput
  ): Promise<Category> {
    logger.debug("Bootstrapping category", { name: categoryInput.name });

    const category = await this.getOrCreateCategory(categoryInput);

    logger.debug("Existing category", {
      category,
    });

    // compare existingCategory subcategories with categoryInput.subcategories
    const subcategoriesToCreate =
      categoryInput.subcategories?.filter(
        (subcategory) =>
          !category?.children?.edges?.some(
            (edge) => edge.node.name === subcategory.name
          )
      ) ?? [];

    logger.debug("Subcategories to create", {
      subcategories: subcategoriesToCreate,
    });

    for (const subcategory of subcategoriesToCreate) {
      await this.createCategory({ name: subcategory.name }, category.id);
    }

    return category;
  }
}
