import connectDB from "@/lib/dbConnect";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { username, email, password } = await req.json();

    // Check if the Username already exists
    const existingUserVerfifiedByUsername = await User.findOne({
      username,
      isVerified: true,
    });

    // if exists
    if (existingUserVerfifiedByUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken.",
        },
        {
          status: 400,
        }
      );
    }

    // if not, then check if the email exists
    const existingUserByEmail = await User.findOne({
      email,
    });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // if exists
    if (existingUserByEmail) {
      // exists but its verified
      if (existingUserByEmail.isVerified) {
        return NextResponse.json(
          {
            success: false,
            message: "User already exist with this email.",
          },
          {
            status: 400,
          }
        );
      }
      // exists but not verified then update the user
      else {
        const hashedPassword = await bcrypt.hash(password, 10);

        existingUserByEmail.password = hashedPassword;

        existingUserByEmail.verifyCode = verifyCode;

        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 60 * 60 * 1000
        );

        await existingUserByEmail.save();
      }
    }
    // if not exists, then create the user
    else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      await User.create({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isAcceptingMessage: true,
        messages: [],
        isVerified: false,
      });
    }

    // send verification email code
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    console.log(emailResponse);

    if (!emailResponse.success) {
      return NextResponse.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully, Please verify your email.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Sign Up Error", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error Registering User",
      },
      {
        status: 500,
      }
    );
  }
}
