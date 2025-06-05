"# DrugUsePreventionSupportSystem" 
# README.md with setup instructions

# Android Project Git Setup

## 1. Clone the Repository
```sh
git clone <repository_url>
cd your-project
```

## 2. Sync Dependencies
Open the project in Android Studio and select **"Sync Gradle"**.

Or run manually:
```sh
./gradlew clean
./gradlew build
```

## 3. Creating a New Feature Branch
```sh
git checkout -b feature/your-feature
```

## 4. Commit and Push
```sh
git add .
git commit -m "Your commit message"
git push origin feature/your-feature
```

## 5. Open a Pull Request (PR)
Go to GitHub and create a PR to merge into `main`.
