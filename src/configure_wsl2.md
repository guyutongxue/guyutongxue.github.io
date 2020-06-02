# Configure WSL with beauty

## Update to newer Windows version (>= 18917)(from insider channel).

## Enable features and reboot

```PowerShell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```
## Download Ubuntu from Microsoft Store.

```PowerShell
bash
```
To initialize the OS.

## Upgrade version

```PowerShell
wsl --set-version Ubuntu 2
```

You may be asked to install a core update pack. Just follow the instruction.

## Transfer the filesystem to an other place

```PowerShell
wsl --export Ubuntu D:\ubuntu.tar
```

Remove Ubuntu from Microsoft store.

```PowerShell
wsl --import Ubuntu /path/to/your/favorite D:\ubuntu.tar --version 2
```

Modify Registry for the default user. Goto `HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss\`, where you may find a GUID stand for the distribute you just imported. Change the uid to the original one. You can find uid by tapping following command into bash:
```bash
cat /etc/passwd | grep <username>
```
Try again login by `bash` or `wsl`. 

## Prepare for Windows Terminal

Download Windows Terminal from Microsoft Store.

Configure settings:
```JSON
{
    "defaultProfile": "{8bb950c2-4343-563a-9788-e8a1d22d142f}", // GUID to the WSL
    "initialCols": 100,
    "initialRows": 30,
    "profiles": {
        "defaults": {
            // Put settings here that you want to apply to all profiles
            // "fontFace": "等距更纱黑体 SC",
            "fontFace": "MesloLGS NF", // fix better with zsh-powerlevel10k, Chinese supported
            "fontSize": 10,
            // "useAcrylic": true,
            // "acrylicOpacity": 0.7
        },
        "lists": [] //...
    }
}
```

Register to Explorer context:

Regedit, change directory to  `HKEY_CLASSES_ROOT\Directory\Background\shell`.

Add item `wt`, use string `Open Windows Terminal` as defaultl value, add a string called `Icon` if you want.

Inside this item, add subitem called `command`. Use
```
"C:\Users\Guyutongxue\AppData\Local\Microsoft\WindowsApps\wt.exe" -d  %V\.
```
as the default value.

## Install zsh and configure with theme

```Bash
sudo apt install zsh
```

```Bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

```Bash
git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k
```

Set `ZSH_THEME="powerlevel10k/powerlevel10k"` in `~/.zshrc`.

Type zsh and you can configure whatever you like.
