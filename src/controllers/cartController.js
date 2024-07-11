import prisma from "../config/database";

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
