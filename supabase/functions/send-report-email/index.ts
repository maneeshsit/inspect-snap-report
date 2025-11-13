import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReportEmailRequest {
  inspectorName: string;
  inspectionDate: string;
  propertyAddress: string;
  reportContent: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { inspectorName, inspectionDate, propertyAddress, reportContent }: ReportEmailRequest = await req.json();

    console.log("Sending report email to inspectorsnapreport@gmail.com");

    const emailResponse = await resend.emails.send({
      from: "Inspection Reports <onboarding@resend.dev>",
      to: ["inspectorsnapreport@gmail.com"],
      subject: `Inspection Report - ${propertyAddress || 'N/A'} - ${inspectionDate}`,
      html: `
        <h1>Inspection Report</h1>
        <p><strong>Inspector:</strong> ${inspectorName}</p>
        <p><strong>Date:</strong> ${inspectionDate}</p>
        <p><strong>Property Address:</strong> ${propertyAddress || 'N/A'}</p>
        <hr />
        <pre style="white-space: pre-wrap; font-family: monospace;">${reportContent}</pre>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending report email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
