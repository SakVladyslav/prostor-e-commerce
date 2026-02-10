import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

import 'dotenv/config';

import { PrismaClient } from '../lib/generated/prisma/client';

neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});
