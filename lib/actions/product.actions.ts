'use server';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/db/prisma';

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { Prisma } from '../generated/prisma/browser';
import { convertToPlainObject, formatError } from '../utils';
import { insertProductSchema, updateProductSchema } from '../validators';

import z from 'zod';

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}

// Get product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug },
  });
}

// Get product by id
export async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(product);
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string;
  page: number;
  limit?: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter: Prisma.ProductWhereInput =
    category && category !== 'all'
      ? {
          category,
        }
      : {};

  // Price filter
  const [gtPrice, ltPrice] = price?.split('-') || [0, 0];
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(gtPrice),
            lte: Number(ltPrice),
          },
        }
      : {};

  // Rating filter
  const [gtRating, ltRating] = price?.split('-') || [0, 0];
  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: gtRating,
            lte: ltRating,
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...priceFilter,
      ...categoryFilter,
      ...ratingFilter,
    },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create a product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);

    await prisma.product.create({
      data: product,
    });

    revalidatePath('/admin/products');

    return { success: true, message: 'Product created successfully', product };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update a product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');

    return { success: true, message: 'Product updated successfully', product };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Get all product categories
export async function getAllProductCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: true,
  });

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}
