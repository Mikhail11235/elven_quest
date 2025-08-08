![Elven Quest](https://github.com/user-attachments/assets/33805e8e-4e71-404a-b969-4d27ab14e771)

A simple **event website** with:

- **Wishlist** (reserve/unreserve items)
- **Place & time** info
- **Dress code** section
- **Admin page** (add/edit/delete gifts)
- Mobile-first responsive design


## Tech Stack

- **Frontend**: React (Vite), Nginx (in Docker)
- **Backend**: Python 3 + FastAPI (in Docker)
- **Database**: SQLite
- **HTTPS**: Nginx + Let’s Encrypt (certbot standalone)

## Screenshot
<img width="400" alt="elven" src="https://github.com/user-attachments/assets/08911b85-7952-49c5-b699-bb2ffd4794af" />

## Environment Variables

Create a `.env` file in the project root (same folder as `docker-compose.yml`):

```ini
ACCESS_TOKEN=your_access_code_for_users
ADMIN_TOKEN=your_admin_code
DOMAIN=your-domain.com
```

## Run with Docker
```bash
docker compose build
docker compose up -d
```
Frontend → https://your-domain.com
Backend API → https://your-domain.com/api


## Local Development
#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create DB tables and seed data
python seed.py

uvicorn main:app --reload
```

Backend will be available at:
http://localhost:8000

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:
http://localhost:5173


## Authentication
Users log in with `ACCESS_TOKEN`

Admin panel uses `ADMIN_TOKEN`


## Notes
Let’s Encrypt certificate generation is done **outside of Docker** with `certbot --standalone`

Make sure ports **80/443** are open and your DNS points to the server

Renew certificates via cron or manually with:
```bash
sudo certbot renew --standalone
```

## Credits

Loader animation **"Fire Ring"** by [KRATGYAGUPTA](https://lospec.com/gallery/kratgyagupta/fire-ring), license unknown — used with thanks.
