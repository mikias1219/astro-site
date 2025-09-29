"""
Email service for sending booking confirmations and notifications
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime

from app.models import Booking, User

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.smtp_username = os.getenv("SMTP_USERNAME")
        self.smtp_password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", "noreply@astrologywebsite.com")
        self.from_name = os.getenv("FROM_NAME", "Astrology Website")
    
    def send_email(self, to_email: str, subject: str, html_content: str, text_content: Optional[str] = None):
        """Send email using SMTP"""
        if not self.smtp_username or not self.smtp_password:
            print(f"Email not configured. Would send to {to_email}: {subject}")
            return False
        
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            
            # Add text content
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            # Add HTML content
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Failed to send email: {e}")
            return False
    
    def send_booking_confirmation(self, booking: Booking):
        """Send booking confirmation email"""
        subject = f"Booking Confirmation - {booking.service.name}"
        
        html_content = f"""
        <html>
        <body>
            <h2>Booking Confirmation</h2>
            <p>Dear {booking.customer_name},</p>
            
            <p>Thank you for booking with us! Here are your booking details:</p>
            
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 10px;"><strong>Service:</strong></td>
                    <td style="padding: 10px;">{booking.service.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Date:</strong></td>
                    <td style="padding: 10px;">{booking.booking_date.strftime('%B %d, %Y')}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Time:</strong></td>
                    <td style="padding: 10px;">{booking.booking_time}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Status:</strong></td>
                    <td style="padding: 10px;">{booking.status.value.title()}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Duration:</strong></td>
                    <td style="padding: 10px;">{booking.service.duration_minutes} minutes</td>
                </tr>
            </table>
            
            {f'<p><strong>Notes:</strong> {booking.notes}</p>' if booking.notes else ''}
            
            <p>If you need to reschedule or cancel your appointment, please contact us.</p>
            
            <p>Best regards,<br>Astrology Website Team</p>
        </body>
        </html>
        """
        
        text_content = f"""
        Booking Confirmation
        
        Dear {booking.customer_name},
        
        Thank you for booking with us! Here are your booking details:
        
        Service: {booking.service.name}
        Date: {booking.booking_date.strftime('%B %d, %Y')}
        Time: {booking.booking_time}
        Status: {booking.status.value.title()}
        Duration: {booking.service.duration_minutes} minutes
        
        {f'Notes: {booking.notes}' if booking.notes else ''}
        
        If you need to reschedule or cancel your appointment, please contact us.
        
        Best regards,
        Astrology Website Team
        """
        
        return self.send_email(booking.customer_email, subject, html_content, text_content)
    
    def send_booking_update(self, booking: Booking, old_status: str):
        """Send booking update notification"""
        subject = f"Booking Update - {booking.service.name}"
        
        html_content = f"""
        <html>
        <body>
            <h2>Booking Update</h2>
            <p>Dear {booking.customer_name},</p>
            
            <p>Your booking has been updated:</p>
            
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 10px;"><strong>Service:</strong></td>
                    <td style="padding: 10px;">{booking.service.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Previous Status:</strong></td>
                    <td style="padding: 10px;">{old_status.title()}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>New Status:</strong></td>
                    <td style="padding: 10px;">{booking.status.value.title()}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Date:</strong></td>
                    <td style="padding: 10px;">{booking.booking_date.strftime('%B %d, %Y')}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Time:</strong></td>
                    <td style="padding: 10px;">{booking.booking_time}</td>
                </tr>
            </table>
            
            <p>Best regards,<br>Astrology Website Team</p>
        </body>
        </html>
        """
        
        return self.send_email(booking.customer_email, subject, html_content)
    
    def send_admin_notification(self, booking: Booking, admin_email: str):
        """Send admin notification for new booking"""
        subject = f"New Booking - {booking.service.name}"
        
        html_content = f"""
        <html>
        <body>
            <h2>New Booking Received</h2>
            
            <p>A new booking has been received:</p>
            
            <table border="1" style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 10px;"><strong>Customer:</strong></td>
                    <td style="padding: 10px;">{booking.customer_name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Email:</strong></td>
                    <td style="padding: 10px;">{booking.customer_email}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Phone:</strong></td>
                    <td style="padding: 10px;">{booking.customer_phone}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Service:</strong></td>
                    <td style="padding: 10px;">{booking.service.name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Date:</strong></td>
                    <td style="padding: 10px;">{booking.booking_date.strftime('%B %d, %Y')}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Time:</strong></td>
                    <td style="padding: 10px;">{booking.booking_time}</td>
                </tr>
                <tr>
                    <td style="padding: 10px;"><strong>Status:</strong></td>
                    <td style="padding: 10px;">{booking.status.value.title()}</td>
                </tr>
            </table>
            
            {f'<p><strong>Notes:</strong> {booking.notes}</p>' if booking.notes else ''}
            
            <p>Please log in to the admin dashboard to manage this booking.</p>
        </body>
        </html>
        """
        
        return self.send_email(admin_email, subject, html_content)

# Global email service instance
email_service = EmailService()
