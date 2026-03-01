import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import express from "express";
import User from "../models/userModel.js"
import authMiddleware from "../middleware/authMiddleware.js";
import { sendResetEmail } from "../utils/sendEmail.js";
import { register, login, getProfile, updateProfile, changePassword, verifyEmail  } from "../controllers/authController.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail);


//  (frontend /me hit kar raha hai)
router.get("/me", authMiddleware, getProfile);

//  Update profile route
router.put("/profile", authMiddleware, updateProfile);





//change password route
router.put("/change-password", authMiddleware, changePassword);





// Google authentication
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { 
        id: req.user._id,
        hasPassword: !!req.user.password
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${process.env.REDIRECT_URL}/oauth-success?token=${token}`);
  }
);



router.post("/set-password", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user.password) {
    return res.status(400).json({ message: "Password already set" });
  }

  user.name = req.body.name;
  user.password = await bcrypt.hash(req.body.password, 10);

  await user.save();

  res.json({ message: "Profile updated successfully" });
});


router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Security: same response even if user not found
    if (!user) {
      return res.json({
        message: "If this email exists, a reset link has been sent."
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetUrl = `${process.env.REDIRECT_URL}/reset-password/${resetToken}`;

   await sendResetEmail(user.email, resetUrl, user.name);
    

    res.json({
      message: "Email has been sent please check you Inbox section."
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
