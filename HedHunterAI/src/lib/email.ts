import { Resend } from "resend";

const FROM = process.env.FROM_EMAIL ?? "no-reply@hedhunter.ai";

// Lazy — only instantiated when an email is actually sent (not at build time)
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

async function send(params: { to: string; subject: string; html: string }) {
  const resend = getResend();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — email skipped:", params.subject);
    return;
  }
  await resend.emails.send({ from: FROM, to: params.to, subject: params.subject, html: params.html });
}

export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<void> {
  await send(params);
}

export async function sendOfferEmail(to: string, params: {
  applicantCode: string; jobTitle: string; companyName: string; hireDate: string;
}): Promise<void> {
  await send({
    to,
    subject: `Job Offer: ${params.jobTitle}`,
    html: `<h2>You have received a job offer!</h2>
           <p>Congratulations, <strong>${params.applicantCode}</strong>.</p>
           <p>You have been selected for <strong>${params.jobTitle}</strong>.</p>
           <p>Proposed start date: <strong>${params.hireDate}</strong></p>
           <p>Please log in to your dashboard to accept or decline.</p>`,
  });
}

export async function sendCompanyApprovedEmail(to: string, companyName: string): Promise<void> {
  await send({
    to,
    subject: "Your company has been approved on Hed Hunter AI",
    html: `<h2>Welcome to Hed Hunter AI, ${companyName}!</h2>
           <p>Your company profile has been reviewed and approved.</p>
           <p>You can now post job positions and start reviewing merit-based candidates.</p>`,
  });
}

export async function sendAppealResolutionEmail(to: string, params: {
  result: string; notes: string; applicantCode: string;
}): Promise<void> {
  await send({
    to,
    subject: "Your appeal has been reviewed",
    html: `<h2>Appeal Update — ${params.applicantCode}</h2>
           <p>Your appeal has been <strong>${params.result}</strong>.</p>
           <p>Reviewer notes: ${params.notes}</p>`,
  });
}

export async function sendPaymentReceiptEmail(to: string, params: {
  amount: number; type: string; date: string;
}): Promise<void> {
  await send({
    to,
    subject: `Payment receipt — $${(params.amount / 100).toFixed(2)}`,
    html: `<h2>Payment Confirmed</h2>
           <p>Amount: <strong>$${(params.amount / 100).toFixed(2)}</strong></p>
           <p>Type: ${params.type}</p><p>Date: ${params.date}</p>
           <p>Thank you for using Hed Hunter AI.</p>`,
  });
}
