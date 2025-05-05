sudo systemctl disable --now dailyReset.timer
sudo systemctl disable --now weeklyReset.timer
sudo systemctl daemon-reload

rm -rf builtServices
sudo rm /etc/systemd/system/dailyReset.service
sudo rm /etc/systemd/system/weeklyReset.service
sudo rm /etc/systemd/system/dailyReset.timer
sudo rm /etc/systemd/system/weeklyReset.timer
