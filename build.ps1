npm run-script build
cd build
tar -cvzf 1.tgz *
cd ../
mv build/1.tgz ./
# scp 1.tgz hk1:/var/www/html/xzllo