import * as React from "react";
import {
  Html,
  Button,
  Body,
  Container,
  Heading,
  Text,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

function Email({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Body
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Heading
            style={{ fontSize: "24px", color: "#333333", marginBottom: "20px" }}
          >
            Email Verification
          </Heading>
          <Text style={{ fontSize: "16px", color: "#333333" }}>
            Hello {username},
          </Text>
          <Text
            style={{ fontSize: "16px", color: "#333333", marginBottom: "20px" }}
          >
            Thank you for registering with us. Please use the following OTP to
            verify your email address:
          </Text>
          <Text
            style={{
              fontSize: "24px",
              color: "#333333",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            {otp}
          </Text>
          <Button
            style={{
              backgroundColor: "#007bff",
              color: "#ffffff",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
            href={`http://localhost:3000/verify/${username}`}
          >
            Verify Email
          </Button>
          <Text
            style={{ fontSize: "14px", color: "#888888", marginTop: "20px" }}
          >
            If you did not request this verification, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default Email;
