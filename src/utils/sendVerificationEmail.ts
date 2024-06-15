import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import Email from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
     await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Vault Verification Code",
      react: Email({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.log("Error sending verification code", error);

    return {
      success: false,
      message: "Error sending verification code.",
    };
  }
}
