import { ENV } from "@config/env";
import { Resend } from "resend";

export const resendClient = new Resend(ENV.RESEND_API_KEY);

export const sender = {
  name: ENV.EMAIL_FROM_NAME,
  email: ENV.EMAIL_FROM
}