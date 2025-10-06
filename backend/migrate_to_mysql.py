#!/usr/bin/env python3
"""
Database Migration Script: SQLite to MySQL
Migrates data from SQLite database to MySQL for Hostinger VPS deployment
"""

import os
import sqlite3
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime
import sys

def get_sqlite_connection(db_path):
    """Connect to SQLite database"""
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row
        return conn
    except Error as e:
        print(f"Error connecting to SQLite: {e}")
        return None

def get_mysql_connection(host, user, password, database):
    """Connect to MySQL database"""
    try:
        conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            charset='utf8mb4',
            collation='utf8mb4_unicode_ci'
        )
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def migrate_table(cursor_sqlite, cursor_mysql, table_name, columns):
    """Migrate data from one table"""
    try:
        # Get data from SQLite
        cursor_sqlite.execute(f"SELECT {', '.join(columns)} FROM {table_name}")
        rows = cursor_sqlite.fetchall()

        if not rows:
            print(f"No data in {table_name}, skipping...")
            return

        # Prepare MySQL insert
        placeholders = ', '.join(['%s'] * len(columns))
        columns_str = ', '.join(columns)

        # Insert data into MySQL
        insert_query = f"INSERT INTO {table_name} ({columns_str}) VALUES ({placeholders})"

        data_to_insert = []
        for row in rows:
            row_data = []
            for col in columns:
                value = row[col]
                # Handle datetime conversion
                if isinstance(value, str) and len(value) > 10 and 'T' in value:
                    try:
                        # Convert ISO format to MySQL datetime
                        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                        value = dt.strftime('%Y-%m-%d %H:%M:%S')
                    except:
                        pass
                row_data.append(value)
            data_to_insert.append(tuple(row_data))

        cursor_mysql.executemany(insert_query, data_to_insert)
        print(f"Migrated {len(data_to_insert)} rows from {table_name}")

    except Error as e:
        print(f"Error migrating {table_name}: {e}")

def main():
    # Configuration - Update these values
    SQLITE_DB = './astrology_website.db'
    MYSQL_HOST = 'localhost'  # Usually 'localhost' on Hostinger
    MYSQL_USER = input("Enter MySQL username: ")
    MYSQL_PASSWORD = input("Enter MySQL password: ")
    MYSQL_DATABASE = input("Enter MySQL database name: ")

    # Connect to databases
    sqlite_conn = get_sqlite_connection(SQLITE_DB)
    mysql_conn = get_mysql_connection(MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)

    if not sqlite_conn or not mysql_conn:
        print("Failed to connect to databases")
        sys.exit(1)

    try:
        sqlite_cursor = sqlite_conn.cursor()
        mysql_cursor = mysql_conn.cursor()

        # Define table schemas (columns to migrate)
        tables_to_migrate = {
            'users': ['id', 'email', 'username', 'hashed_password', 'full_name', 'phone', 'role', 'is_active', 'is_verified', 'verification_token', 'verification_token_expires', 'reset_password_token', 'reset_password_token_expires', 'preferred_language', 'created_at', 'updated_at'],
            'services': ['id', 'name', 'description', 'service_type', 'price', 'duration_minutes', 'is_active', 'image_url', 'features', 'created_at', 'updated_at'],
            'bookings': ['id', 'user_id', 'service_id', 'booking_date', 'booking_time', 'status', 'notes', 'customer_name', 'customer_email', 'customer_phone', 'birth_date', 'birth_time', 'birth_place', 'created_at', 'updated_at'],
            'pages': ['id', 'title', 'slug', 'content', 'excerpt', 'anchor_text', 'anchor_link', 'is_published', 'created_at', 'updated_at', 'author_id'],
            'blogs': ['id', 'title', 'slug', 'content', 'excerpt', 'featured_image', 'is_published', 'published_at', 'created_at', 'updated_at', 'author_id', 'view_count'],
            'faqs': ['id', 'question', 'answer', 'category', 'order', 'is_active', 'created_at', 'updated_at'],
            'testimonials': ['id', 'user_id', 'name', 'email', 'rating', 'content', 'is_approved', 'service_used', 'created_at', 'updated_at'],
            'panchang': ['id', 'date', 'sunrise', 'sunset', 'moonrise', 'moonset', 'tithi', 'tithi_end_time', 'nakshatra', 'nakshatra_end_time', 'yoga', 'yoga_end_time', 'karan', 'karan_end_time', 'amanta_month', 'purnimanta_month', 'vikram_samvat', 'shaka_samvat', 'created_at', 'updated_at'],
            'horoscopes': ['id', 'zodiac_sign', 'date', 'period_type', 'content', 'love_score', 'career_score', 'health_score', 'lucky_color', 'lucky_number', 'created_at', 'updated_at'],
            'podcasts': ['id', 'title', 'description', 'video_url', 'thumbnail_url', 'duration', 'category', 'is_featured', 'view_count', 'created_at', 'updated_at'],
            'seo': ['id', 'page_id', 'blog_id', 'meta_title', 'meta_description', 'meta_keywords', 'og_title', 'og_description', 'og_image', 'canonical_url', 'schema_markup', 'created_at', 'updated_at'],
            'user_verifications': ['id', 'user_id', 'token', 'token_type', 'expires_at', 'is_used', 'created_at'],
            'kundlis': ['id', 'user_id', 'name', 'birth_date', 'birth_time', 'birth_place', 'latitude', 'longitude', 'timezone_offset', 'gender', 'language', 'sun_sign', 'moon_sign', 'ascendant', 'nakshatra', 'nakshatra_pada', 'tithi', 'yoga', 'karan', 'planetary_positions', 'house_positions', 'aspects', 'mangal_dosha', 'kaal_sarp_dosha', 'shani_dosha', 'report_data', 'chart_type', 'created_at', 'updated_at'],
            'matchings': ['id', 'user_id', 'male_kundli_id', 'female_kundli_id', 'male_name', 'female_name', 'matching_type', 'varna_score', 'vashya_score', 'tara_score', 'yoni_score', 'graha_maitri_score', 'gana_score', 'bhakoot_score', 'nadi_score', 'total_score', 'compatibility_percentage', 'compatibility_level', 'detailed_analysis', 'recommendations', 'remedies', 'created_at', 'updated_at'],
            'numerology': ['id', 'user_id', 'name', 'birth_date', 'life_path_number', 'destiny_number', 'soul_urge_number', 'personality_number', 'maturity_number', 'birth_day_number', 'lucky_numbers', 'lucky_colors', 'lucky_days', 'lucky_stones', 'personality_traits', 'career_guidance', 'relationship_compatibility', 'health_predictions', 'financial_outlook', 'created_at', 'updated_at'],
            'blogs': ['id', 'title', 'slug', 'description', 'featured_image', 'is_published', 'published_at', 'created_at', 'updated_at', 'author_id', 'view_count'],
            'transits': ['id', 'planet', 'from_sign', 'to_sign', 'transit_date', 'end_date', 'general_effects', 'sign_predictions', 'remedies', 'is_active', 'created_at', 'updated_at'],
            'predictions': ['id', 'zodiac_sign', 'date', 'period_type', 'general_prediction', 'love_prediction', 'career_prediction', 'health_prediction', 'finance_prediction', 'love_score', 'career_score', 'health_score', 'finance_score', 'overall_score', 'lucky_color', 'lucky_number', 'lucky_time', 'lucky_direction', 'created_at', 'updated_at'],
            'panchang_details': ['id', 'panchang_id', 'brahma_muhurta_start', 'brahma_muhurta_end', 'abhijit_muhurta_start', 'abhijit_muhurta_end', 'rahu_kaal_start', 'rahu_kaal_end', 'gulika_kaal_start', 'gulika_kaal_end', 'yamaganda_start', 'yamaganda_end', 'dur_muhurta_timings', 'shubh_muhurta_timings', 'festivals', 'vratas', 'daily_prediction', 'created_at', 'updated_at'],
            'gemstone_recommendations': ['id', 'user_id', 'kundli_id', 'primary_gemstone', 'primary_planet', 'primary_benefits', 'alternative_gemstones', 'wearing_day', 'wearing_time', 'wearing_finger', 'metal_recommendation', 'weight_recommendation', 'mantras', 'rituals', 'precautions', 'created_at', 'updated_at'],
            'rudraksha_recommendations': ['id', 'user_id', 'kundli_id', 'primary_mukhi', 'primary_benefits', 'primary_mantra', 'additional_recommendations', 'wearing_day', 'wearing_time', 'thread_material', 'mantras', 'rituals', 'spiritual_benefits', 'health_benefits', 'material_benefits', 'created_at', 'updated_at'],
            'premium_offers': ['id', 'title', 'description', 'offer_type', 'original_price', 'discounted_price', 'discount_percentage', 'included_services', 'valid_from', 'valid_until', 'max_usage_count', 'current_usage_count', 'features', 'is_active', 'is_featured', 'created_at', 'updated_at'],
            'user_premium_purchases': ['id', 'user_id', 'offer_id', 'service_id', 'purchase_type', 'amount_paid', 'payment_method', 'transaction_id', 'status', 'usage_count', 'max_usage', 'valid_until', 'created_at', 'updated_at']
        }

        print("Starting database migration from SQLite to MySQL...")
        print("=" * 50)

        # Migrate each table
        for table_name, columns in tables_to_migrate.items():
            print(f"Migrating table: {table_name}")
            migrate_table(sqlite_cursor, mysql_cursor, table_name, columns)

        # Commit changes
        mysql_conn.commit()
        print("=" * 50)
        print("Migration completed successfully!")

    except Error as e:
        print(f"Migration failed: {e}")
        mysql_conn.rollback()
        sys.exit(1)

    finally:
        if sqlite_conn:
            sqlite_conn.close()
        if mysql_conn:
            mysql_conn.close()

if __name__ == "__main__":
    main()
