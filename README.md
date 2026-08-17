# بوت روم الدعم الفني الصوتي

عندما يدخل أي عضو إلى روم الدعم الفني المحدد، يدخل البوت ويشغّل ملف `support.mp3`، ثم يخرج بعد انتهاء التشغيل.

## 1) عدّل `index.js`

غيّر هذه القيم فقط:

- `GUILD_ID`: آيدي السيرفر.
- `SUPPORT_VOICE_CHANNEL_ID`: آيدي روم الدعم الفني الصوتي.

ثم ارفع ملف الصوت باسم `support.mp3` بجانب `index.js` داخل GitHub.

## 2) إعداد Discord Developer Portal

1. أنشئ Application ثم Bot.
2. فعّل **Server Members Intent** إذا احتجته لاحقًا (الكود الحالي لا يعتمد عليه).
3. ادعُ البوت بصلاحيات: `View Channels` و`Connect` و`Speak`.

## 3) الرفع على GitHub وRailway

1. ارفع جميع الملفات إلى Repository جديد في GitHub.
2. في Railway اختر **New Project > Deploy from GitHub Repo**.
3. داخل **Variables** أضف:
   - الاسم: `DISCORD_TOKEN`
   - القيمة: توكن البوت
4. Railway سيشغّل الأمر `npm start` تلقائيًا.

> لا تضع التوكن في `index.js` أو GitHub نهائيًا.

## ملاحظات

- يجب كتابة الاسم بالضبط: `support.mp3` بحروف صغيرة.
- يجب أن يكون الملف في نفس مكان `index.js`، وليس داخل مجلد آخر.
- إذا كان البوت يشغّل الترحيب بالفعل ودخل شخص آخر، فلن يبدأ تشغيلًا ثانيًا فوق الأول.
