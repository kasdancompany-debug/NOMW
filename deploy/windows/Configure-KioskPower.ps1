# Disable sleep / screensaver for a dedicated museum kiosk PC (run elevated once).
# Does not change display brightness policies; IT may tighten further via GPO.

#Requires -RunAsAdministrator

Write-Host "[nomow] Configuring power / screensaver for always-on kiosk..."

powercfg /change monitor-timeout-ac 0
powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0
powercfg /change monitor-timeout-dc 0
powercfg /change standby-timeout-dc 0
powercfg /change hibernate-timeout-dc 0

# Prefer "High performance" if available
$guid = (powercfg /list) | Select-String -Pattern "High performance" | ForEach-Object {
  if ($_ -match "([a-f0-9\-]{36})") { $Matches[1] }
} | Select-Object -First 1
if ($guid) {
  powercfg /setactive $guid
  Write-Host "[nomow] Active power plan: High performance ($guid)"
}

New-Item -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Force | Out-Null
Set-ItemProperty -Path "HKLM:\SOFTWARE\Policies\Microsoft\Windows\Personalization" -Name "NoLockScreen" -Type DWord -Value 1 -Force

# Current-user screensaver off (also set for the auto-logon user profile)
$ssKey = "HKCU:\Control Panel\Desktop"
Set-ItemProperty -Path $ssKey -Name "ScreenSaveActive" -Value "0" -Force
Set-ItemProperty -Path $ssKey -Name "ScreenSaverIsSecure" -Value "0" -Force

# Quiet notifications for the kiosk session (Focus assist / quiet hours — Windows 10/11)
try {
  New-Item -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Notifications\Settings" -Force | Out-Null
  New-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\QuietHours" -Name "Enabled" -PropertyType DWord -Value 1 -Force -ErrorAction SilentlyContinue | Out-Null
} catch {}

Write-Host "[nomow] Done. Sign out/in once if screensaver still appears, then re-check."
Write-Host "[nomow] Also set: Settings → System → Notifications → Off for tips/suggestions."
