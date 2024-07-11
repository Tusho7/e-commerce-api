import prisma from "../config/database.js";

export const createWishlist = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const existingWishlistEntry = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: parseInt(userId),
          productId: parseInt(productId),
        },
      },
    });

    if (existingWishlistEntry) {
      return res
        .status(400)
        .json({ message: "პროდუქტი უკვე დამატებულია სურვილების სიაში" });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId: parseInt(userId),
        productId: parseInt(productId),
      },
    });

    res.status(201).json({ wishlist });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
