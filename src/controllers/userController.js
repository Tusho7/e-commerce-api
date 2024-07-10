import prisma from "../config/database.js";

const registerUser = async (req, res) => {
  const { email, firstName, lastName, password, profilePicture } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
        profilePicture,
      },
    });
    res.json(newUser);
  } catch (error) {
    res.json({ error: "An error occurred while creating the user." });
  }
};

export default registerUser;