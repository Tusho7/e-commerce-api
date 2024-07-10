import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import sendVerificationEmail from "../utils/email.js";

const generateUniqueCode = () => {
  return uuidv4();
};

const generateNewPssword = () => {
  return Math.random().toString(36).slice(-8);
};

const registerUser = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const { file } = req;

  try {
    if (!email || !firstName || !lastName || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const userExists = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationCode = generateUniqueCode();

    const newUser = await prisma.users.create({
      data: {
        email,
        firstName,
        password: hashedPassword,
        lastName,
        password,
        profilePicture: "profilePictures/" + file.originalname,
      },
    });

    await sendVerificationEmail(email, verificationCode);

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default registerUser;
