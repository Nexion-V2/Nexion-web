```bash

############################################################
# Git-এ main branch-এ commit করার ধাপসমূহ
############################################################

# 1️⃣ Current branch check (বর্তমান branch দেখো)
# ------------------------------------------------
git status
# অথবা
git branch
# ব্যাখ্যা: দেখাবে তুমি কোন branch-এ আছো। *main থাকলে তুমি main-এ আছো।

# 2️⃣ Main branch-এ যাও (যদি অন্য branch-এ থাকো)
# ------------------------------------------------
git checkout main
# ব্যাখ্যা: main branch-এ switch করার জন্য।

# 3️⃣ Local main update করো
# -------------------------
git pull origin main
# ব্যাখ্যা: remote repository থেকে main branch-এর latest update নাও।

# 4️⃣ পরিবর্তনগুলো stage করো
# --------------------------
git add .
# ব্যাখ্যা: সব পরিবর্তন stage করবে।

# নির্দিষ্ট ফাইলের জন্য:
git add path/to/file
# ব্যাখ্যা: শুধুমাত্র নির্দিষ্ট ফাইল stage করবে।

# 5️⃣ Commit changes (commit তৈরি করো)
# ------------------------------------
git commit -m "Describe your changes here"
# ব্যাখ্যা: stage করা পরিবর্তন commit করবে। 
# message-এ সংক্ষেপে লিখে দাও কি পরিবর্তন হলো।

# উদাহরণ:
git commit -m "Fix dark mode styles in TeacherAssignmentPanel"

# 6️⃣ Push to main branch (remote-এ push করো)
# --------------------------------------------
git push origin main
# ব্যাখ্যা: local commit remote main branch-এ আপলোড হবে।

# ⚠️ সাবধানতার বিষয়
# -----------------
# - Direct main-এ push করলে conflict হতে পারে যদি অন্য কেউ main update করছে।
# - ভালো practice: feature branch-এ কাজ করে Pull Request (PR) দিয়ে merge করা।
# - Solo project বা trusted environment-এ সরাসরি main-এ commit করা ঠিক আছে।

#All Port Kill from Powershell
taskkill /F /IM node.exe

