# Monkon Servisleri Yüklenmiyorsa - Hızlı Çözüm

## 🚨 Sorun: Servisler Yüklenmiyor

Aşağıdaki adımları sırayla dene:

---

## ✅ Step 1: Docker Desktop'ı Kontrol Et

**Masaüstüne Bak:**
- Dock'ta Docker simgesi görüyorsa, ona tıkla
- "Docker is running" yazısını ara
- Eğer yazıyorsa, devam et
- Yazıyorsa Docker uygulamasını başlat: Applications → Docker

**Terminal'de kontrol et:**
```bash
docker ps
```
- Eğer hata almıyorsan → Docker çalışıyor ✅
- Eğer port hatasısa → Docker Desktop başlat
- 5-10 saniye bekle, tekrar dene

---

## ✅ Step 2: Docker Compose Kontrol Et

```bash
cd ~/Desktop/monkonom
docker-compose version
```

Eğer version döndürüyorsa → çalışıyor ✅

---

## ✅ Step 3: Image'ları Yeniden Build Et

```bash
cd ~/Desktop/monkonom

# Tüm servisleri durdur
docker-compose down -v

# Resimleri sil
docker-compose down -v --rmi all

# Yeniden inşa et
docker-compose build --no-cache

# Başlat
docker-compose up -d
```

---

## ✅ Step 4: Log'ları Kontrol Et

```bash
# Tüm logları göster
docker-compose logs

# Spesifik servisin logunu göster
docker-compose logs apache
docker-compose logs php
docker-compose logs mysql
```

---

## ✅ Step 5: Adım Adım Başlat

```bash
# Her servisi ayrı ayrı test et
docker-compose up -d php
sleep 5
docker-compose ps

docker-compose up -d mysql
sleep 5
docker-compose ps

docker-compose up -d apache
sleep 5
docker-compose ps
```

---

## 🛠️ Yaygın Sorunlar & Çözümler

### Problem: "Port already in use"
```bash
# Port 80'i kullanan işlemi bul
lsof -i :80

# veya 3306 için
lsof -i :3306

# Process'i öldür (PID ile)
kill -9 <PID>

# Sonra tekrar dene
docker-compose up -d
```

### Problem: "Cannot connect to Docker daemon"
```bash
# Docker Desktop'ı başlat
open -a Docker

# 30 saniye bekle, tekrar dene
docker ps
```

### Problem: "Insufficient disk space"
```bash
# Docker cleanup yap
docker system prune -a --volumes

# Diskten boş alan liberate et
# Trash'ı boşalt: Cmd + Cmd Delete
```

### Problem: "PHP container health check failing"
```bash
# PHP image rebuild et
docker-compose down
docker-compose build --no-cache php
docker-compose up -d
```

---

## 🆘 Nuke & Restart (Son Çare)

**Tüm Docker'ı resetle:**
```bash
# Tüm containerleri sil
docker ps -a -q | xargs docker rm -f

# Tüm volumeleri sil
docker volume prune -f

# Yeniden başlat
cd ~/Desktop/monkonom
docker-compose build
docker-compose up -d
docker-compose ps
```

---

## ✅ Kontrol Listesi

Çalışıp çalışmadığını test et:

```bash
# 1. Konteynerler çalışıyor mu?
docker-compose ps
# Hepsi "Up" olmalı ✅

# 2. Portlar açık mı?
lsof -i :80
lsof -i :3306
lsof -i :8080

# 3. Web sunucusunu test et
curl http://localhost

# 4. MySQL'i test et
docker-compose exec mysql mysql -umonkon -pmonkon_password -e "SELECT 1;"

# 5. CLI komutlarını test et
monkon status
```

---

## 📋 Detaylı Çıktı Topla

Hala sorunu varsa, aşağıdaki çıktıyı paylaş:

```bash
# Adım 1: Sistem durumu
echo "=== DOCKER STATE ==="
docker info 2>&1 | head -20

# Adım 2: Container durumu
echo "=== CONTAINERS ==="
docker-compose ps

# Adım 3: Loglar
echo "=== LOGS ==="
docker-compose logs 2>&1 | tail -30

# Adım 4: Network
echo "=== NETWORK ==="
docker network ls
docker inspect monkonom_monkon-network 2>/dev/null | head -30
```

---

## 🎯 Sorunu Bulma Sırası

1. **Docker açık mı?** → Docker Desktop başlat
2. **Image build olmuş mu?** → `docker images | grep monkon` kontrol et
3. **Container çalışıyor mu?** → `docker-compose ps` kontrol et
4. **Port açık mı?** → `lsof -i :80` kontrol et
5. **Network sorun mu?** → `docker network inspect` kontrol et
6. **Log hataları var mı?** → `docker-compose logs` kontrol et

---

**Hangi adımda takıldığını söyle, yardımcı olurum!** 💪
