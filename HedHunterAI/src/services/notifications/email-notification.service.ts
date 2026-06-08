import { sendEmail } from "@/lib/email";
import { formatCurrency } from "@/utils/formatCurrency";

export async function sendOfferEmail(to: string, jobTitle: string, companyName: string, hireDate: Date): Promise<void> {
  await sendEmail({
    to, subject: `Job Offer: ${jobTitle} at ${companyName}`,
    html: `<p>You have received a job offer for <strong>${jobTitle}</strong> at ${companyName}.</p>
           <p>Proposed hire date: ${hireDate.toLocaleDateString()}</p>
           <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/job-seeker/offers">View and respond to your offer →</a></p>`,
  });
}

export async function sendApplicationReceivedEmail(to: string, jobTitle: string, anonymousCode: string): Promise<void> {
  await sendEmail({
    to, subject: `Application submitted: ${jobTitle}`,
    html: `<p>Your application for <strong>${jobTitle}</strong> has been submitted.</p>
           <p>Your anonymous applicant code is: <strong>${anonymousCode}</strong></p>
           <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/job-seeker/applications">Track your application →</a></p>`,
  });
}

export async function sendApprovalEmail(to: string, companyName: string): Promise<void> {
  await sendEmail({
    to, subject: `${companyName} — Your account has been approved`,
    html: `<p>Your company account for <strong>${companyName}</strong> has been approved.</p>
           <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/company/jobs/create">Post your first job →</a></p>`,
  });
}

export async function sendAppealUpdateEmail(to: string, status: string, notes?: string): Promise<void> {
  await sendEmail({
    to, subject: `Your appeal has been ${status}`,
    html: `<p>Your score appeal has been <strong>${status}</strong>.</p>
           ${notes ? `<p>Reviewer notes: ${notes}</p>` : ""}
           <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/job-seeker/applications">View your applications →</a></p>`,
  });
}

export async function sendPaymentReceiptEmail(to: string, amount: number, type: string): Promise<void> {
  await sendEmail({
    to, subject: `Payment receipt — ${formatCurrency(amount)}`,
    html: `<p>Payment of <strong>${formatCurrency(amount)}</strong> received for: ${type.replace(/_/g, " ")}.</p>
           <p>Thank you for using Hed Hunter AI.</p>`,
  });
}
