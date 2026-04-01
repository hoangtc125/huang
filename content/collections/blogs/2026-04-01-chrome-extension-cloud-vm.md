---
title: "Chạy Chrome Extensions 24/7 trên Cloud VM: Setup từ A-Z"
slug: "chrome-extension-cloud-vm"
description: "Hướng dẫn setup cloud VM chạy Chrome browser với extensions 24/7 — Xvfb virtual display, screen session, watchdog tự restart, Telegram monitoring."
cover: "https://picsum.photos/seed/chrome-vm-cloud/1200/630"
topic: "system-design"
tags:
  - "DevOps"
  - "Cloud"
  - "Browser Automation"
  - "Linux"
related_projects: []
related_blogs:
  - "facebook-data-crawl-esuit-automa"
published: true
featured: false
date: "2026-04-01"
reading_time: 8
seo_title: "Chạy Chrome Extensions 24/7 trên Cloud VM — Xvfb, Watchdog, Telegram"
seo_description: "Setup hoàn chỉnh để chạy Chrome browser automation với extensions liên tục trên Ubuntu EC2: virtual display, auto-restart, Telegram monitoring."
---

# Chạy Chrome Extensions 24/7 trên Cloud VM

## Bối cảnh

Một số tác vụ tự động hóa cần Chrome browser thật — không phải headless Chromium, mà là Chrome đầy đủ với extensions đang chạy. Vấn đề: Chrome cần màn hình để render, và máy cá nhân không thể treo 24/7.

Giải pháp: Ubuntu VM trên cloud + **Xvfb** (virtual framebuffer) làm màn hình ảo. Chrome không biết mình đang chạy không có monitor vật lý.

## Tổng quan kiến trúc

```
Cloud VM (Ubuntu 22.04)
   │
   ├─ Xvfb :99        → virtual display 1366×768
   ├─ Fluxbox          → window manager nhẹ (Chrome cần WM để render đúng)
   ├─ Chrome           → chạy trên display :99, extensions hoạt động bình thường
   ├─ screen           → giữ session sau khi ngắt SSH
   ├─ crontab @reboot  → auto-start khi VM reboot
   └─ watchdog (*/5)   → cron check Chrome còn sống, restart nếu crash
```

Khi cần cấu hình extension lần đầu, dùng **x11vnc** để stream display :99 ra ngoài — kết nối VNC Viewer, setup xong thì đóng, không cần VNC nữa.

## Chuẩn bị VM

### Spec tối thiểu

| Thành phần | Khuyến nghị |
| --- | --- |
| OS | Ubuntu Server 22.04 LTS |
| CPU | 2 vCPU |
| RAM | 2 GB + 2 GB swap |
| Storage | 15 GB |

2 GB RAM là đủ cho Chrome với 1-2 tab nếu có swap. Không nên mở nhiều hơn 2-3 tab vì sẽ bắt đầu dùng swap nhiều, Chrome chậm lại.

### Security Group

Chỉ mở port `22` (SSH) cho IP của bạn. Port `5900` (VNC) chỉ mở tạm khi cần cài extension ban đầu — **xóa rule ngay sau khi xong**.

## Cài đặt

### Tạo swap

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Cài các package cần thiết

```bash
sudo apt-get update
sudo apt-get install -y \
  xvfb \
  fluxbox \
  x11vnc \
  screen \
  curl \
  wget \
  gnupg
```

### Cài Chrome

```bash
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
  | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

## Script khởi động Chrome

`start-chrome.sh` — script chính để start Xvfb và Chrome:

```bash
#!/bin/bash
source ~/.chrome-vm.env  # load TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export DISPLAY=:99

# Dừng instance cũ nếu có
pkill -f "Xvfb :99" 2>/dev/null
sleep 1

# Khởi động virtual display
Xvfb :99 -screen 0 1366x768x24 &
sleep 2

# Khởi động window manager
fluxbox &
sleep 1

# Khởi động Chrome
google-chrome \
  --display=:99 \
  --no-sandbox \
  --disable-dev-shm-usage \
  --user-data-dir=/home/ubuntu/chrome-profile \
  &

# Notify Telegram
source /home/ubuntu/chrome-vm/telegram.sh
tg_send "Chrome started on $(hostname) — $(date '+%H:%M %d/%m')"
```

Chạy trong `screen` session để tiếp tục chạy sau khi ngắt SSH:

```bash
screen -S chrome
/home/ubuntu/chrome-vm/start-chrome.sh
# Ctrl+A rồi D để detach — Chrome vẫn chạy
```

## Watchdog — tự restart khi crash

Chrome trên VM đôi khi crash do memory pressure hoặc extension conflict. Watchdog là cron job chạy mỗi 5 phút:

```bash
#!/bin/bash
# watchdog.sh
source ~/.chrome-vm.env
source /home/ubuntu/chrome-vm/telegram.sh

if ! pgrep -x "chrome" > /dev/null; then
    tg_send "Chrome died — restarting on $(hostname)"
    screen -S chrome -X quit 2>/dev/null
    screen -dmS chrome /home/ubuntu/chrome-vm/start-chrome.sh
fi
```

Thêm vào crontab:

```bash
crontab -e
```

```
# Auto-start khi reboot
@reboot screen -dmS chrome /home/ubuntu/chrome-vm/start-chrome.sh

# Watchdog mỗi 5 phút
*/5 * * * * /home/ubuntu/chrome-vm/watchdog.sh
```

## Telegram helper

`telegram.sh` — hàm gửi notify dùng `curl`, source vào bất kỳ shell script nào:

```bash
#!/bin/bash
# telegram.sh
tg_send() {
  local msg="$1"
  curl -s -X POST \
    "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d "chat_id=${TELEGRAM_CHAT_ID}" \
    -d "text=${msg}" > /dev/null
}
```

Lấy token và chat ID:
1. Chat với `@BotFather` → `/newbot` → copy token
2. Chat với `@userinfobot` → copy chat_id

Lưu vào `~/.chrome-vm.env`:

```bash
TELEGRAM_BOT_TOKEN=123456:ABC-DEF
TELEGRAM_CHAT_ID=123456789
```

```bash
chmod 600 ~/.chrome-vm.env  # không để ai đọc được
```

### Hai kênh notify

| Sự kiện | Nơi chạy | Cách gửi |
| --- | --- | --- |
| Chrome start / restart | Shell script | `telegram.sh` → `curl` |
| Chrome crash detected | Shell watchdog | `telegram.sh` → `curl` |
| Automation workflow bắt đầu | Trong browser | `automaFetch` từ extension |

Notify từ shell và từ browser là hai luồng độc lập — kể cả khi extension chưa chạy, shell vẫn báo được khi Chrome crash.

## Cài extensions qua VNC (1 lần)

Extensions cần được cài thủ công qua giao diện Chrome. Làm một lần duy nhất:

```bash
# Trên EC2 — start VNC server
x11vnc -display :99 -forever -shared -rfbauth ~/.vnc/passwd -bg
```

Đặt VNC password trước (chỉ cần một lần):

```bash
x11vnc -storepasswd ~/.vnc/passwd
```

Sau đó:
1. AWS Security Group → mở port `5900` cho IP của bạn
2. VNC Viewer → kết nối `<public-ip>:5900`
3. Cài extensions, đăng nhập, import workflow config
4. Đóng VNC Viewer (không đóng Chrome)
5. **AWS → xóa rule port 5900 ngay**

## Quản lý hàng ngày

```bash
# Attach vào session Chrome
screen -r chrome

# Detach (không tắt Chrome)
# Ctrl+A rồi D

# Xem RAM
free -h

# Restart Chrome thủ công
pkill -f "google-chrome"
/home/ubuntu/chrome-vm/start-chrome.sh

# Xem log crontab
grep CRON /var/log/syslog | tail -20
```

## Chi phí

| Resource | Chi phí/tháng |
| --- | --- |
| t3.small (2 vCPU, 2GB RAM) | ~$15 |
| 15 GB EBS gp2 | ~$1.5 |
| **Tổng** | **~$17/tháng** |

Có thể về $0 nếu dùng AWS Free Tier (750 giờ t2.micro/tháng trong năm đầu) hoặc Google Cloud free credits. t2.micro ít RAM hơn nhưng đủ chạy nếu tối ưu swap và giới hạn số tab.

## Những điểm cần lưu ý

- **Không mở quá 2-3 tab** — RAM 2 GB không đủ, Chrome sẽ bắt đầu dùng swap và chậm đáng kể
- **Port VNC chỉ mở tạm** — để lâu là rủi ro bảo mật, xóa ngay sau khi setup xong
- **Backup chrome-profile** định kỳ nếu muốn giữ session đăng nhập và extension config

```bash
# Backup profile
tar -czf chrome-profile-backup.tar.gz ~/chrome-profile
scp -i key.pem ubuntu@<ip>:~/chrome-profile-backup.tar.gz .
```

- **Watchdog check mỗi 5 phút** — khoảng gap tối đa Chrome có thể chết mà không ai biết là 5 phút. Telegram notify giúp catch được ngay khi watchdog kick in

## Kết

Setup này đơn giản hơn nghe — khoảng 30-45 phút từ lúc tạo VM đến lúc Chrome chạy ổn định trên cloud. Phần tốn thời gian nhất thường là cấu hình Telegram bot và test watchdog.

Điểm mấu chốt: **Xvfb là thứ làm tất cả hoạt động được**. Chrome không quan tâm màn hình có thật hay không — chỉ cần có display để render. Virtual framebuffer cung cấp đúng thứ đó với overhead gần như bằng 0.
