import { prisma } from '@/lib/generated/prisma/helper';

import sampleData from './sample-data';

async function main() {
  await prisma.product.deleteMany();
  await prisma.product.createMany({ data: sampleData.products });

  console.log('Seeding database with sample data...');
}

main();
