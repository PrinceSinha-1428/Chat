import { resendClient, sender } from "@lib/resend"
import { createWelcomeEmailTemplate } from "./emailTemplate"



export const sendWelcomeEmail = async (email: string, name: string, clientUrl: string ): Promise<void> => {
  const { data, error} = await resendClient.emails.send({
    from: `${sender.name}<${sender.email}>`,
    to: email,
    subject: 'Welcome to chat',
    html: createWelcomeEmailTemplate(name,clientUrl)
  });
  if(error) {
    console.log(error);
    throw new Error("Failed to send email");
  }
  console.log("Email sent succesfully", data);
}