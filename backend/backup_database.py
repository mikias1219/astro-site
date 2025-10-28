#!/usr/bin/env python3
"""
Database Backup Script for Astrology Website
Ensures data persistence and creates regular backups
"""

import os
import sqlite3
import shutil
from datetime import datetime
import subprocess
import sys

def create_backup():
    """Create a backup of the SQLite database"""
    try:
        # Database file path
        db_file = "astrology_website.db"
        
        if not os.path.exists(db_file):
            print(f"❌ Database file {db_file} not found!")
            return False
            
        # Create backup filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_file = f"astrology_website_backup_{timestamp}.db"
        
        # Copy database file
        shutil.copy2(db_file, backup_file)
        
        print(f"✅ Database backup created: {backup_file}")
        
        # Verify backup
        if os.path.exists(backup_file):
            original_size = os.path.getsize(db_file)
            backup_size = os.path.getsize(backup_file)
            
            if original_size == backup_size:
                print(f"✅ Backup verified: {backup_size} bytes")
                return True
            else:
                print(f"❌ Backup verification failed: {original_size} vs {backup_size}")
                return False
        else:
            print("❌ Backup file not created!")
            return False
            
    except Exception as e:
        print(f"❌ Error creating backup: {e}")
        return False

def restore_backup(backup_file):
    """Restore database from backup"""
    try:
        if not os.path.exists(backup_file):
            print(f"❌ Backup file {backup_file} not found!")
            return False
            
        # Create backup of current database before restore
        current_backup = f"astrology_website_pre_restore_{datetime.now().strftime('%Y%m%d_%H%M%S')}.db"
        if os.path.exists("astrology_website.db"):
            shutil.copy2("astrology_website.db", current_backup)
            print(f"✅ Current database backed up as: {current_backup}")
        
        # Restore from backup
        shutil.copy2(backup_file, "astrology_website.db")
        
        print(f"✅ Database restored from: {backup_file}")
        return True
        
    except Exception as e:
        print(f"❌ Error restoring backup: {e}")
        return False

def check_database_integrity():
    """Check database integrity"""
    try:
        conn = sqlite3.connect("astrology_website.db")
        cursor = conn.cursor()
        
        # Check database integrity
        cursor.execute("PRAGMA integrity_check;")
        result = cursor.fetchone()
        
        if result[0] == "ok":
            print("✅ Database integrity check passed")
            
            # Get table count
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tables = cursor.fetchall()
            print(f"📊 Found {len(tables)} tables")
            
            # Get total records count
            total_records = 0
            for table in tables:
                table_name = table[0]
                cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
                count = cursor.fetchone()[0]
                total_records += count
                print(f"  - {table_name}: {count} records")
            
            print(f"📊 Total records: {total_records}")
            
            conn.close()
            return True
        else:
            print(f"❌ Database integrity check failed: {result[0]}")
            conn.close()
            return False
            
    except Exception as e:
        print(f"❌ Error checking database integrity: {e}")
        return False

def list_backups():
    """List all available backups"""
    try:
        backup_files = [f for f in os.listdir(".") if f.startswith("astrology_website_backup_") and f.endswith(".db")]
        
        if not backup_files:
            print("📁 No backup files found")
            return []
            
        print("📁 Available backups:")
        for backup in sorted(backup_files, reverse=True):
            size = os.path.getsize(backup)
            mod_time = datetime.fromtimestamp(os.path.getmtime(backup))
            print(f"  - {backup} ({size} bytes, {mod_time.strftime('%Y-%m-%d %H:%M:%S')})")
            
        return backup_files
        
    except Exception as e:
        print(f"❌ Error listing backups: {e}")
        return []

def main():
    """Main function"""
    print("🔍 ASTROLOGY WEBSITE DATABASE MANAGEMENT")
    print("========================================")
    
    if len(sys.argv) < 2:
        print("Usage: python backup_database.py [backup|restore|check|list]")
        print("  backup  - Create a new backup")
        print("  restore - Restore from backup (requires backup filename)")
        print("  check   - Check database integrity")
        print("  list    - List available backups")
        return
    
    command = sys.argv[1].lower()
    
    if command == "backup":
        print("🔄 Creating database backup...")
        create_backup()
        
    elif command == "restore":
        if len(sys.argv) < 3:
            print("❌ Please provide backup filename")
            print("Usage: python backup_database.py restore <backup_filename>")
            return
        backup_file = sys.argv[2]
        print(f"🔄 Restoring from backup: {backup_file}")
        restore_backup(backup_file)
        
    elif command == "check":
        print("🔍 Checking database integrity...")
        check_database_integrity()
        
    elif command == "list":
        print("📁 Listing available backups...")
        list_backups()
        
    else:
        print(f"❌ Unknown command: {command}")

if __name__ == "__main__":
    main()
