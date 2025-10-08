# Fix for 500 Internal Server Error on /api/auth/register

## Problem
Users are getting a 500 Internal Server Error when trying to register at `https://astroarupshastri.com/api/auth/register`.

## Possible Causes

### 1. **Database Connection Issues**
The most common cause of 500 errors on registration is database connectivity problems.

**Check:**
- Is the database server running?
- Are the database credentials correct in the `.env` file?
- Can the backend connect to the database?

### 2. **Missing Database Tables**
The User table or related tables might not exist in the production database.

**Check:**
```bash
# On the production server
cd /home/mikias/Mikias/Work/Projects/Freelance/astro-site/backend
python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine); print('Tables created')"
```

### 3. **Environment Variables Missing**
The backend requires specific environment variables to be set.

**Required .env variables:**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost/dbname
# or for SQLite
DATABASE_URL=sqlite:///./astrology.db

# JWT Secret
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=https://astroarupshastri.com,https://www.astroarupshastri.com

# Frontend URL
FRONTEND_URL=https://astroarupshastri.com
```

### 4. **Password Hashing Issues**
The `passlib` library might not be installed or configured correctly.

### 5. **SQLAlchemy Session Issues**
Database session management might be failing.

## Solutions

### Solution 1: Check Backend Logs

```bash
# SSH into production server
ssh user@astroarupshastri.com

# Check uvicorn logs
tail -100 /path/to/backend/logs/uvicorn.log

# Or check systemd logs if running as service
sudo journalctl -u astro-backend -n 100
```

### Solution 2: Test Database Connection

Create a test script `test_db.py`:

```python
from app.database import engine, get_db
from app.models import User
from sqlalchemy import text

# Test connection
try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT 1"))
        print("✅ Database connection successful")
except Exception as e:
    print(f"❌ Database connection failed: {e}")

# Test User table
try:
    db = next(get_db())
    users = db.query(User).count()
    print(f"✅ User table accessible, {users} users found")
except Exception as e:
    print(f"❌ User table error: {e}")
```

Run it:
```bash
cd backend
python test_db.py
```

### Solution 3: Add Error Logging to Registration Endpoint

Update `backend/app/routers/auth.py`:

```python
@router.post("/register", response_model=EmailVerificationResponse)
async def register(user: UserCreate, request: Request, db: Session = Depends(get_db)):
    """Register a new user with email verification"""
    try:
        # Check if user already exists
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        if db.query(User).filter(User.username == user.username).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            phone=user.phone,
            preferred_language=user.preferred_language,
            hashed_password=hashed_password,
            role=UserRole.USER,
            is_active=True,
            is_verified=True
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return EmailVerificationResponse(
            message="Registration successful! You can now login with your credentials.",
            email_sent=False
        )
    except HTTPException:
        raise
    except Exception as e:
        # Log the actual error
        import traceback
        print(f"❌ Registration error: {e}")
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )
```

### Solution 4: Fix Database Schema

If the User table schema doesn't match the model:

```bash
cd backend
# Drop and recreate tables (WARNING: This deletes all data!)
python -c "from app.database import engine; from app.models import Base; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine); print('Tables recreated')"
```

For production with data, use Alembic migrations instead:
```bash
alembic revision --autogenerate -m "Update user schema"
alembic upgrade head
```

### Solution 5: Check Python Dependencies

```bash
cd backend
pip install -r requirements.txt --upgrade
```

Ensure these are in `requirements.txt`:
```txt
fastapi
uvicorn[standard]
sqlalchemy
psycopg2-binary  # for PostgreSQL
passlib[bcrypt]
python-jose[cryptography]
python-multipart
email-validator
pydantic
pydantic[email]
```

### Solution 6: Restart Backend Service

```bash
# If running with systemd
sudo systemctl restart astro-backend

# If running with PM2
pm2 restart astro-backend

# If running manually
pkill -f uvicorn
cd backend
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &
```

## Quick Diagnostic Commands

Run these on the production server:

```bash
# 1. Check if backend is running
curl http://localhost:8000/health

# 2. Check database connection
cd backend
python -c "from app.database import engine; print(engine.url)"

# 3. Test registration locally on server
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "full_name": "Test User",
    "password": "testpass123",
    "phone": "1234567890",
    "preferred_language": "en"
  }'

# 4. Check backend logs
tail -50 logs/uvicorn.log
```

## Most Likely Fix

Based on the code review, the most likely issue is:

1. **Database not initialized** - Run this on production:
   ```bash
   cd /home/mikias/Mikias/Work/Projects/Freelance/astro-site/backend
   python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
   ```

2. **Missing SECRET_KEY** - Add to `.env`:
   ```env
   SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
   ```

3. **Restart the backend**:
   ```bash
   sudo systemctl restart astro-backend
   # or
   pm2 restart astro-backend
   ```

## Prevention

To prevent this in the future:

1. **Add health check endpoint with database test**:
```python
@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
```

2. **Add proper logging**:
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

3. **Add monitoring** - Use tools like:
   - Sentry for error tracking
   - DataDog for monitoring
   - LogRocket for session replay

## Contact for Support

If the issue persists, please provide:
1. Backend logs (`tail -100 logs/uvicorn.log`)
2. Database connection string (without password)
3. Python version (`python --version`)
4. FastAPI version (`pip show fastapi`)
5. Any error messages from the browser console

