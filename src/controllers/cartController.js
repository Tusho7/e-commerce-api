import prisma from "../config/database.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { userId } = req.user;

  try {
    if (!productId || !quantity) {
      return res
        .status(400)
        .json({ error: "productId and quantity are required" });
    }

    const cartItem = await prisma.cart.create({
      data: {
        quantity: parseInt(quantity),
        product: {
          connect: {
            id: parseInt(productId),
          },
        },
        user: {
          connect: {
            id: parseInt(userId),
          },
        },
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Unable to add to cart" });
  }
};

export const getUserCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: parseInt(userId),
      },
      include: {
        product: true,
      },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error getting cart items:", error);
    res.status(500).json({ error: "Unable to get cart items" });
  }
};
