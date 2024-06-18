import connectDB from "@/lib/dbConnect";
import { User } from "@/models/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return NextResponse.json(
      {
        success: false,
        message: "Method not allowed.",
      },
      {
        status: 400,
      }
    );
  }

  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validate with zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters.",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await User.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
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

    return NextResponse.json(
      {
        success: true,
        message: "Username is available.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      {
        status: 400,
      }
    );
  }
}
