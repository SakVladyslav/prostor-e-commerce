'use server';

import { cookies } from 'next/headers';

import { CartItem } from '@/types';
import { prisma } from '@/db/prisma';
import { auth } from '@/auth';

import { convertToPlainObject, formatError, round2 } from '../utils';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';

const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

export async function addToCart(data: CartItem) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;

    if (!sessionCartId) throw new Error('Cart session not found');

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;
    const cart = await getMyCart();
    const item = cartItemSchema.parse(data);

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    if (!product) throw new Error('Product not found');

    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId,
        items: [item],
        sessionCardId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      const existingProduct = cart.items.find(
        (product) => product.productId === item.productId
      );

      if (existingProduct) {
        if (product.stock < existingProduct.qty + 1)
          throw new Error('Out of stock');

        cart.items.find(
          (product) => product.productId === item.productId
        )!.qty = existingProduct.qty + 1;
      } else {
        if (product.stock < 1) throw new Error('Not enough stock');

        cart.items.push(item);
      }

      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items,
          ...calcPrice(cart.items),
        },
      });

      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} ${
          existingProduct ? 'updated in' : 'added to'
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function removeFromCart(productId: string) {
  try {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    const product = await prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) throw new Error('Product not found');

    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    const existingProduct = cart.items.find(
      (cartItem) => cartItem.productId === productId
    );
    if (!existingProduct) throw new Error('Item not found');

    if (existingProduct.qty === 1) {
      cart.items = cart.items.filter(
        (cartItem) => cartItem.productId !== productId
      );
    } else {
      cart.items.find((cartItem) => cartItem.productId === productId)!.qty =
        existingProduct?.qty - 1;
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items,
        ...calcPrice(cart.items),
      },
    });

    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;

  if (!sessionCartId) throw new Error('Cart session not found');

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCardId: sessionCartId },
  });

  if (!cart) return undefined;

  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
