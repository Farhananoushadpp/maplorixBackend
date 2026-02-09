import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send contact form submission email
export const sendContactEmail = async (contact) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin
      subject: `New Contact Form Submission: ${contact.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023341; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Maplorix - New Contact Submission</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #023341; margin-bottom: 20px;">Contact Details</h2>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p><strong>Name:</strong> ${contact.name}</p>
              <p><strong>Email:</strong> ${contact.email}</p>
              ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
              <p><strong>Subject:</strong> ${contact.subject}</p>
              <p><strong>Category:</strong> ${contact.category}</p>
              <p><strong>Priority:</strong> ${contact.priority}</p>
              <p><strong>Date:</strong> ${contact.createdAt.toLocaleString()}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px;">
              <h3 style="color: #023341; margin-bottom: 10px;">Message:</h3>
              <p style="white-space: pre-wrap;">${contact.message}</p>
            </div>
          </div>
          
          <div style="background: #4CBD99; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">This is an automated message from Maplorix Contact Form</p>
            <p style="margin: 5px 0 0 0;">Please respond to the inquiry at your earliest convenience.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully');
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

// Send application confirmation email
export const sendApplicationEmail = async (application) => {
  try {
    const transporter = createTransporter();
    
    // Send to applicant
    const applicantMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: application.email,
      subject: 'Application Received - Maplorix',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023341; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Maplorix - Application Received</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #023341; margin-bottom: 20px;">Dear ${application.fullName},</h2>
            
            <p>Thank you for your interest in the <strong>${application.jobRole}</strong> position at Maplorix.</p>
            
            <p>We have successfully received your application and resume. Our recruitment team will carefully review your profile and qualifications.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #023341; margin-bottom: 10px;">Application Details:</h3>
              <p><strong>Position:</strong> ${application.jobRole}</p>
              <p><strong>Email:</strong> ${application.email}</p>
              <p><strong>Phone:</strong> ${application.phone}</p>
              <p><strong>Experience:</strong> ${application.experience}</p>
              <p><strong>Submitted:</strong> ${application.createdAt.toLocaleString()}</p>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your application within 3-5 business days</li>
              <li>If your profile matches our requirements, we will contact you for an interview</li>
              <li>You can check the status of your application by contacting us</li>
            </ul>
            
            <p>For any inquiries, please contact us at <a href="mailto:info@maplorix.com">info@maplorix.com</a></p>
          </div>
          
          <div style="background: #4CBD99; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0 0;">The Maplorix Team</p>
          </div>
        </div>
      `
    };

    // Send notification to admin
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Job Application: ${application.jobRole} - ${application.fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023341; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Maplorix - New Job Application</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #023341; margin-bottom: 20px;">Application Details</h2>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
              <p><strong>Name:</strong> ${application.fullName}</p>
              <p><strong>Email:</strong> ${application.email}</p>
              <p><strong>Phone:</strong> ${application.phone}</p>
              <p><strong>Location:</strong> ${application.location}</p>
              <p><strong>Applied Position:</strong> ${application.jobRole}</p>
              <p><strong>Experience:</strong> ${application.experience}</p>
              ${application.skills ? `<p><strong>Skills:</strong> ${application.skills}</p>` : ''}
              ${application.currentCompany ? `<p><strong>Current Company:</strong> ${application.currentCompany}</p>` : ''}
              ${application.expectedSalary.min || application.expectedSalary.max ? 
                `<p><strong>Expected Salary:</strong> ${application.formattedExpectedSalary}</p>` : ''}
              <p><strong>Notice Period:</strong> ${application.noticePeriod}</p>
              <p><strong>Applied:</strong> ${application.createdAt.toLocaleString()}</p>
              <p><strong>Resume:</strong> ${application.resume.originalName} (${(application.resume.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
            
            ${application.coverLetter ? `
              <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #023341; margin-bottom: 10px;">Cover Letter:</h3>
                <p style="white-space: pre-wrap;">${application.coverLetter}</p>
              </div>
            ` : ''}
            
            ${application.linkedinProfile || application.portfolio ? `
              <div style="background: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                <h3 style="color: #023341; margin-bottom: 10px;">Additional Links:</h3>
                ${application.linkedinProfile ? `<p><strong>LinkedIn:</strong> <a href="${application.linkedinProfile}">${application.linkedinProfile}</a></p>` : ''}
                ${application.portfolio ? `<p><strong>Portfolio:</strong> <a href="${application.portfolio}">${application.portfolio}</a></p>` : ''}
              </div>
            ` : ''}
          </div>
          
          <div style="background: #4CBD99; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">Please review this application in the admin panel</p>
          </div>
        </div>
      `
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(applicantMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);
    
    console.log('Application emails sent successfully');
  } catch (error) {
    console.error('Error sending application emails:', error);
    throw error;
  }
};

// Send interview invitation email
export const sendInterviewEmail = async (application, interviewDetails) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: application.email,
      subject: `Interview Invitation - Maplorix`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #023341; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Maplorix - Interview Invitation</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #023341; margin-bottom: 20px;">Dear ${application.fullName},</h2>
            
            <p>Congratulations! We would like to invite you for an interview for the <strong>${application.jobRole}</strong> position.</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #023341; margin-bottom: 10px;">Interview Details:</h3>
              <p><strong>Date:</strong> ${new Date(interviewDetails.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> ${new Date(interviewDetails.date).toLocaleTimeString()}</p>
              <p><strong>Type:</strong> ${interviewDetails.type}</p>
              ${interviewDetails.location ? `<p><strong>Location:</strong> ${interviewDetails.location}</p>` : ''}
              ${interviewDetails.meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${interviewDetails.meetingLink}">${interviewDetails.meetingLink}</a></p>` : ''}
            </div>
            
            ${interviewDetails.notes ? `
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #023341; margin-bottom: 10px;">Additional Information:</h3>
                <p>${interviewDetails.notes}</p>
              </div>
            ` : ''}
            
            <p>Please confirm your availability by replying to this email within 24 hours.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
          </div>
          
          <div style="background: #4CBD99; color: white; padding: 15px; text-align: center;">
            <p style="margin: 0;">Best regards,</p>
            <p style="margin: 5px 0 0 0;">The Maplorix Team</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Interview invitation email sent successfully');
  } catch (error) {
    console.error('Error sending interview email:', error);
    throw error;
  }
};

export default {
  sendContactEmail,
  sendApplicationEmail,
  sendInterviewEmail
};
