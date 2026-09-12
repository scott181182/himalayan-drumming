import { NextResponse } from "next/server";

export class ApiError extends Error {
  public constructor(
    public readonly status: number,
    public reason: string,
  ) {
    super(reason);
  }

  public toNextResponse(): NextResponse {
    return NextResponse.json({ status: "error", reason: this.reason }, { status: this.status });
  }
}
