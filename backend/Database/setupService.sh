PROJECT_BACKEND_DIR='/home/henri/Projects/WebSudoku/backend/'

cd ${PROJECT_BACKEND_DIR}Database

mkdir -p builtServices

cp draftDailyReset.service builtServices/dailyReset.service
cp draftWeeklyReset.service builtServices/weeklyReset.service

echo "ExecStart=${PROJECT_BACKEND_DIR}venv/bin/python3  ${PROJECT_BACKEND_DIR}database.py dailyReset" >>builtServices/dailyReset.service
echo "ExecStart=${PROJECT_BACKEND_DIR}venv/bin/python3 ${PROJECT_BACKEND_DIR}database.py weeklyReset" >>builtServices/weeklyReset.service

sudo cp builtServices/dailyReset.service /etc/systemd/system/
sudo cp dailyReset.timer /etc/systemd/system/
sudo cp builtServices/weeklyReset.service /etc/systemd/system/
sudo cp weeklyReset.timer /etc/systemd/system/

echo "reloading systemctl daemon"
sudo systemctl daemon-reload
echo "enable and start daily reset"
sudo systemctl enable dailyReset.timer
sudo systemctl start dailyReset.timer
echo "enable weekly reset"
sudo systemctl enable weeklyReset.timer
sudo systemctl start weeklyReset.timer
