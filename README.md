# Suivi-facture

## Fonctionnalités

Suivi facture est une application qui permet de joindre des fichiers aux entrée/sortie d'un compte bancaire. 
On peut synchroniser ses dépenses grace à un compte GoCardLess. 
Une notification est envoyée lorsque des opérations n'ont pas de fichiers associés. 
Les fichiers sont exportables sous la forme de zip

## Développement 

Cette App est ma première app en React et en React-native. 
J'ai découvert les fonctionnalités du frmamework en avancant dans la création de l'app. 
C'est donc pas trop production ready, mais ca suffira pour mes besoins. 


## TODO

- Améliorer les écrans d'initialisation GoCardLess (M)
- Notifier l'utilisateur d'un problème avec la conf GoCardLess
   - Token expiré (S)
   - Token bientot expiré (S)
   - Synchronisation échouée (S)
- Notifier périodiquement l'utilisateur que des entrées n'ont pas de fichier (S)
   - Parametrer la période (S)
- Pouvoir selectionner plusieurs dépenses pour 1 fichier (L)
- Améliorer la gueule de l'app (M)
- CI/CD + publish sur FDroid

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

3. Build the native app

   ```bash
    npx expo run:android
   ```

3. Start the app

   ```bash
    npx expo start
   ```

4. If You want to test on android, checkout sdkmanager
To connect adb through WSL2 : 

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).