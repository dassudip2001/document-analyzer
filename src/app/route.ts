import { NextResponse } from "next/server";

export type ResponseT = {
  message: string;
  status: number;
};

export async function GET() {
  try {
    return NextResponse.json<ResponseT>({
      message: "Server is running .........",
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
