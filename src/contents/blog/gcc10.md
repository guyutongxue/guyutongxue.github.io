---
title: GCC 10 installation (Ubuntu)
---

```sh
# upgrade softwares
sudo apt update
sudo apt upgrade
# install dependencies
sudo apt install build-essential wget m4 flex bison
# download sources
cd ~
wget http://mirror.hust.edu.cn/gnu/gcc/gcc-10.1.0/gcc-10.1.0.tar.xz
tar xf gcc-10.1.0.tar.xz
# download prerequisites
cd gcc-10.1.0
contrib/download_prerequisites
# start comiling
cd ~
mkdir build && cd build
../gcc-10.1.0/configure -v --build=x86_64-linux-gnu --host=x86_64-linux-gnu --target=x86_64-linux-gnu --prefix=/usr/local/gcc-10.1.0 --enable-checking=release --enable-languages=c,c++,fortran --disable-multilib --program-suffix=-10.1
make -j8
# install
sudo make install-strip
# change deafult version
sudo update-alternatives --install /usr/bin/gcc gcc /usr/local/gcc-10.1.0/bin/gcc-10.1 80 --slave /usr/bin/g++ g++ /usr/local/gcc-10.1.0/bin/g++-10.1
```