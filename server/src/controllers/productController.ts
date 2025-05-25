import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const product = await prisma.products.findUnique({
      where: { productId: id },
    });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ message: "Error retrieving product" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId, name, price, rating, stockQuantity } = req.body;
    const product = await prisma.products.create({
      data: {
        productId,
        name,
        price,
        rating,
        stockQuantity,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, price, rating, stockQuantity } = req.body;

    const updated = await prisma.products.update({
      where: { productId: id },
      data: {
        name,
        price,
        rating,
        stockQuantity,
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
};
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Delete related Sales and Purchases first
    await prisma.sales.deleteMany({ where: { productId: id } });
    await prisma.purchases.deleteMany({ where: { productId: id } });

    // 2. Then delete the Product
    await prisma.products.delete({
      where: { productId: id },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Delete Product Error:", error);

    if (error.code === "P2025") {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(500).json({ message: "Error deleting product" });
    }
  }
};
