#!/usr/bin/env python3

from app.routers.auth import router

print('Auth router loaded successfully')
print('Available routes:')
for route in router.routes:
    print(f'  {route.methods} {route.path}')
