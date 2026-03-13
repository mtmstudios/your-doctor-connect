# ZumArzt — n8n Workflows

## Setup (einmalig)

### 1. Umgebungsvariablen in n8n setzen
Settings → Variables:

| Variable | Wert |
|---|---|
| GOOGLE_VISION_API_KEY | dein Google Vision API Key |
| SUPABASE_URL | https://xxx.supabase.co |
| SUPABASE_SERVICE_KEY | supabase service_role key |
| TWILIO_ACCOUNT_SID | ACxxxxxxxx |
| TWILIO_PHONE_NUMBER | +4971112345678 |
| RESEND_API_KEY | re_xxxxxxxx |

### 2. Workflows importieren
n8n Dashboard → Import from File → jeweilige JSON wählen

### 3. Webhook URLs in .env.local eintragen
Nach Import: Workflow öffnen → Webhook-Node → URL kopieren

```
VITE_N8N_OCR_WEBHOOK=https://n8n.zumarzt.de/webhook/zumarzt-ocr
VITE_N8N_BOOK_WEBHOOK=https://n8n.zumarzt.de/webhook/zumarzt-booking
VITE_N8N_CANCEL_WEBHOOK=https://n8n.zumarzt.de/webhook/zumarzt-cancellation
```

## Die 3 Workflows

| Datei | Workflow | Trigger |
|---|---|---|
| 01_ocr_workflow.json | OCR Überweisung | POST /webhook/zumarzt-ocr |
| 02_booking_workflow.json | Buchung verarbeiten | POST /webhook/zumarzt-booking |
| 03_flash_termin_workflow.json | Flash-Termin Börse | POST /webhook/zumarzt-cancellation |
