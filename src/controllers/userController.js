import prisma from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import {
  forgotPasswordEmail,
  sendVerificationEmail,
  updateUserEmail,
} from "../utils/email.js";
import { registerUserSchema, loginUserSchema } from "../joi/validation.js";

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
    const { error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = new Set();
      error.details.forEach((detail) => {
        if (detail.context.key === "password") {
          errorMessages.add(
            "Password must be at least 8 characters long, contain at least one uppercase letter and one number"
          );
        } else if (detail.context.key === "email") {
          errorMessages.add("Invalid email format");
        } else {
          errorMessages.add(detail.message);
        }
      });
      return res
        .status(400)
        .json({ error: Array.from(errorMessages).join("; ") });
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
    const { error } = loginUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details
        .map((detail) => detail.message)
        .join("; ");
      return res.status(400).json({ error: errorMessages });
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

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};

    if (email && email !== user.email) {
      const verificationCode = generateUniqueCode();
      await updateUserEmail(email, verificationCode);

      updates.email = email;
      updates.verificationCode = verificationCode;
      updates.isVerified = false;
    } else if (email && email !== user.email && user.isVerified) {
      updates.email = email;
    }

    if (firstName) {
      updates.firstName = first_name;
    }

    if (lastName) {
      updates.lastName = last_name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await prisma.users.update({
      where: {
        id: parseInt(id),
      },
      data: updates,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
        verificationCode: null,
      },
    });

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPassword = generateNewPssword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    await forgotPasswordEmail(
      email,
      "Paswword reset",
      `Your new password is ${newPassword}`
    );

    res
      .status(200)
      .json({
        message:
          "Password updated successfully, check your email for the new password.",
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
