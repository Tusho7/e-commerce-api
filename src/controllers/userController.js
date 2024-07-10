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

export const registerUser = async (req, res) => {
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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user || !user.isVerified) {
      return res
        .status(401)
        .json({ message: "User not found or not verified" });
    }

    if (user.isBlocked)
      return res
        .status(401)
        .json({ message: "თქვენი მომხმარებელი დაბლოკილია." });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: true,
    });

    res.status(200).json({ id: user.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ error: error.message });
  }
};
