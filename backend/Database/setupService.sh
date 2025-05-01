PROJECT_BACKEND_DIR='/home/henri/Projects/WebSudoku/backend/'

cd ${PROJECT_BACKEND_DIR}Database

cp draftDailyReset.service dailyReset.service
cp draftWeeklyReset.service weeklyReset.service

echo "ExecStart=${PROJECT_BACKEND_DIR}venv/bin/python3  ${PROJECT_BACKEND_DIR}database.py dailyReset" >>dailyReset.service
echo "ExecStart=${PROJECT_BACKEND_DIR}venv/bin/python3 ${PROJECT_BACKEND_DIR}database.py weeklyReset" >>weeklyReset.service

sudo cp dailyReset.service /etc/systemd/system/
sudo cp dailyReset.timer /etc/systemd/system/
sudo cp weeklyReset.service /etc/systemd/system/
sudo cp weeklyReset.timer /etc/systemd/system/

echo "reloading systemctl daemon"
sudo systemctl daemon-reload
echo "enable daily reset"
sudo systemctl enable dailyReset.timer
echo "enable weekly reset"
sudo systemctl enable weeklyReset.timer
