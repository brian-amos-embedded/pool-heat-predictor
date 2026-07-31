# Pool Heat Predictor

## Install on iPhone or iPad

1. Open the published Pool Heat Predictor site in **Safari**.
2. Tap the **Share** button.
3. Scroll down and tap **Add to Home Screen**.
4. Edit the name if desired, then tap **Add**.
5. Launch **Pool Heat** from the Home Screen like a normal app.

> Apple requires Safari for the normal Home Screen installation flow. The app needs internet access for live weather, but saved settings and calibration readings remain stored on the device.

## Install on Android

1. Open the published Pool Heat Predictor site in **Chrome**.
2. Tap the browser menu (**⋮**).
3. Tap **Install app** or **Add to Home screen**.
4. Confirm the installation.
5. Launch **Pool Heat** from the app drawer or Home Screen.

> Chrome may also display an automatic **Install** prompt. Live weather requires internet access; saved settings and calibration readings remain stored locally on the device.

## About

A lightweight, iPhone- and Android-friendly pool heating predictor that estimates when a pool will reach a target temperature using pool size, heater output, cover status, pump state, live weather, and optional calibration readings. It includes a projected temperature graph and can be installed as a Progressive Web App from Safari or Chrome.

## Features

- Weather-aware estimated time to the target temperature
- Pool-volume, heater-output, and efficiency settings
- Cover-open and cover-closed modeling
- Pump and heater-state adjustment
- Live hourly weather from Open-Meteo
- Optional calibration readings based on actual pool performance
- Projected temperature graph
- Local storage for settings and readings
- Progressive Web App support for iPhone, iPad, and Android

## Default configuration

The included defaults are configured for:

- 11,500-gallon pool
- 504-square-foot surface area
- 250,000 BTU/hr propane heater
- 84% heater efficiency
- State College, Pennsylvania weather location

All values can be changed in the app.

## Publishing with GitHub Pages

1. Open this repository's **Settings**.
2. Select **Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the `main` branch and the `/ (root)` folder.
5. Click **Save**.
6. After deployment completes, open the GitHub Pages URL shown in the Pages settings.

The expected address is:

`https://brian-amos-embedded.github.io/pool-heat-predictor/`

## Privacy

The app does not require an account. Pool settings and calibration readings are stored in the browser's local storage and are not committed to this repository. Location is used only when the user grants browser permission, so the app can request local weather data.