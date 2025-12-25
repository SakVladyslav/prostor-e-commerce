'use server';

import { prisma } from '@/lib/generated/prisma/helper';

import { Product } from '@/types';
import { convertToPlainObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constants';

// Get latest products
export async function getLatestProducts(): Promise<Product[]> {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
}
