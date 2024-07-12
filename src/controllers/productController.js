import prisma from "../config/database.js";

export const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    colors,
    sizes,
    isOnSale,
    salePercentage,
    shipping,
    categoryId,
  } = req.body;

  const { files } = req;
  const images = files.map((file) => "productImages/" + file.originalname);

  if (isOnSale && !salePercentage) {
    return res.status(400).json({ message: "მიუთითეთ ფასდაკლების პროცენტი." });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        images: { set: images },
        stock: parseInt(stock),
        colors,
        sizes,
        shipping,
        isOnSale,
        salePercentage: isOnSale ? parseInt(salePercentage) : null,
        categoryId: parseInt(categoryId),
      },
    });

    console.log(product);
    res.status(201).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;

  const {
    name,
    description,
    price,
    stock,
    colors,
    sizes,
    shipping,
    categoryId,
  } = req.body;

  const { files } = req.files;

  const images = files.map((file) => "productImages/" + file.originalname);

  try {
    const product = await prisma.product.update({
      where: {
        id: parseInt(id),
      },
      data: {
        name,
        description,
        price,
        images,
        stock,
        colors,
        sizes,
        shipping,
        categoryId: parseInt(categoryId),
      },
    });

    res.status(200).json({ product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: parseInt(categoryId),
      },
    });

    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
