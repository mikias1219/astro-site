"""
Email service for sending booking confirmations and notifications
"""

import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional
from datetime import datetime

from app.models import Booking, User, UserVerification
import secrets
import uuid
from datetime import datetime, timedelta

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
    
    def generate_verification_token(self) -> str:
        """Generate a secure verification token"""
        return secrets.token_urlsafe(32)
    
    def send_verification_email(self, user: User, token: str, frontend_url: str = "http://localhost:3000"):
        """Send email verification email"""
        verification_url = f"{frontend_url}/verify-email?token={token}"
        
        subject = "Verify Your Email Address - Astrology Website"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4a5568; text-align: center;">Welcome to Astrology Website!</h2>
                
                <p>Dear {user.full_name},</p>
                
                <p>Thank you for registering with us! To complete your registration and start using our services, please verify your email address by clicking the button below:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}" 
                       style="background-color: #4a5568; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Verify Email Address
                    </a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">{verification_url}</p>
                
                <p><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
                
                <p>If you didn't create an account with us, please ignore this email.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Best regards,<br>
                    Astrology Website Team<br>
                    <br>
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to Astrology Website!
        
        Dear {user.full_name},
        
        Thank you for registering with us! To complete your registration and start using our services, please verify your email address by visiting the following link:
        
        {verification_url}
        
        Important: This verification link will expire in 24 hours for security reasons.
        
        If you didn't create an account with us, please ignore this email.
        
        Best regards,
        Astrology Website Team
        
        This is an automated message. Please do not reply to this email.
        """
        
        return self.send_email(user.email, subject, html_content, text_content)
    
    def send_password_reset_email(self, user: User, token: str, frontend_url: str = "http://localhost:3000"):
        """Send password reset email"""
        reset_url = f"{frontend_url}/reset-password?token={token}"
        
        subject = "Password Reset Request - Astrology Website"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4a5568; text-align: center;">Password Reset Request</h2>
                
                <p>Dear {user.full_name},</p>
                
                <p>We received a request to reset your password for your Astrology Website account. If you made this request, click the button below to reset your password:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" 
                       style="background-color: #e53e3e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #666;">{reset_url}</p>
                
                <p><strong>Important:</strong> This password reset link will expire in 1 hour for security reasons.</p>
                
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Best regards,<br>
                    Astrology Website Team<br>
                    <br>
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Password Reset Request
        
        Dear {user.full_name},
        
        We received a request to reset your password for your Astrology Website account. If you made this request, visit the following link to reset your password:
        
        {reset_url}
        
        Important: This password reset link will expire in 1 hour for security reasons.
        
        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        
        Best regards,
        Astrology Website Team
        
        This is an automated message. Please do not reply to this email.
        """
        
        return self.send_email(user.email, subject, html_content, text_content)
    
    def send_welcome_email(self, user: User):
        """Send welcome email after successful verification"""
        subject = "Welcome to Astrology Website - Your Account is Verified!"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #4a5568; text-align: center;">Welcome to Astrology Website!</h2>
                
                <p>Dear {user.full_name},</p>
                
                <p>🎉 Congratulations! Your email address has been successfully verified and your account is now active.</p>
                
                <p>You can now enjoy all our services:</p>
                <ul>
                    <li>📊 Free horoscope readings</li>
                    <li>🔮 Astrology consultations</li>
                    <li>💎 Gemstone recommendations</li>
                    <li>📅 Book appointments with our expert astrologers</li>
                    <li>📖 Daily, weekly, and monthly predictions</li>
                </ul>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000" 
                       style="background-color: #4a5568; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                        Explore Our Services
                    </a>
                </div>
                
                <p>If you have any questions or need assistance, feel free to contact our support team.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Best regards,<br>
                    Astrology Website Team<br>
                    <br>
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to Astrology Website!
        
        Dear {user.full_name},
        
        Congratulations! Your email address has been successfully verified and your account is now active.
        
        You can now enjoy all our services:
        - Free horoscope readings
        - Astrology consultations
        - Gemstone recommendations
        - Book appointments with our expert astrologers
        - Daily, weekly, and monthly predictions
        
        Visit us at: http://localhost:3000
        
        If you have any questions or need assistance, feel free to contact our support team.
        
        Best regards,
        Astrology Website Team
        
        This is an automated message. Please do not reply to this email.
        """
        
        return self.send_email(user.email, subject, html_content, text_content)

# Global email service instance
email_service = EmailService()
